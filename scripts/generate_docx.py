import os
import re
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, color_hex):
    shading_elm = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{color_hex}"/>')
    cell._tc.get_or_add_tcPr().append(shading_elm)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def create_styled_docx(md_path, docx_path, main_title, subtitle):
    doc = docx.Document()

    # Set page margins (1 inch all around)
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

    # Base Styles
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Calibri'
    normal_style.font.size = Pt(10.5)
    normal_style.font.color.rgb = RGBColor(40, 44, 52)

    # Document Header Title
    title_p = doc.add_paragraph()
    title_p.paragraph_format.space_before = Pt(0)
    title_p.paragraph_format.space_after = Pt(4)
    run_title = title_p.add_run(main_title)
    run_title.font.name = 'Calibri'
    run_title.font.size = Pt(24)
    run_title.font.bold = True
    run_title.font.color.rgb = RGBColor(215, 25, 32) # #D71920 Chi-Town Red

    # Subtitle
    sub_p = doc.add_paragraph()
    sub_p.paragraph_format.space_before = Pt(0)
    sub_p.paragraph_format.space_after = Pt(18)
    run_sub = sub_p.add_run(subtitle)
    run_sub.font.name = 'Calibri'
    run_sub.font.size = Pt(11)
    run_sub.font.italic = True
    run_sub.font.color.rgb = RGBColor(100, 105, 115)

    # Divider bar
    divider_p = doc.add_paragraph()
    divider_p.paragraph_format.space_after = Pt(16)
    r_div = divider_p.add_run("―" * 48)
    r_div.font.color.rgb = RGBColor(215, 25, 32)

    with open(md_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    in_code_block = False
    code_lines = []
    in_table = False
    table_lines = []

    def flush_table():
        nonlocal in_table, table_lines
        if not table_lines:
            return
        
        # Parse table lines
        rows_data = []
        for tl in table_lines:
            parts = [p.strip() for p in tl.split('|')[1:-1]]
            # check if it's separator row
            if parts and all(re.match(r'^:?-+:?$', p) for p in parts):
                continue
            if parts:
                rows_data.append(parts)

        if rows_data:
            num_cols = max(len(r) for r in rows_data)
            table = doc.add_table(rows=len(rows_data), cols=num_cols)
            table.alignment = WD_TABLE_ALIGNMENT.CENTER
            table.autofit = True

            for r_idx, row in enumerate(rows_data):
                for c_idx in range(num_cols):
                    val = row[c_idx] if c_idx < len(row) else ""
                    cell = table.cell(r_idx, c_idx)
                    cell.text = val
                    set_cell_margins(cell, top=120, bottom=120, left=160, right=160)
                    cell_p = cell.paragraphs[0]
                    cell_p.paragraph_format.space_before = Pt(0)
                    cell_p.paragraph_format.space_after = Pt(0)

                    if r_idx == 0:
                        set_cell_background(cell, "111317") # Dark header
                        for run in cell_p.runs:
                            run.font.bold = True
                            run.font.color.rgb = RGBColor(255, 255, 255)
                            run.font.size = Pt(9.5)
                    else:
                        bg_color = "F9FAFB" if r_idx % 2 == 1 else "FFFFFF"
                        set_cell_background(cell, bg_color)
                        for run in cell_p.runs:
                            run.font.size = Pt(9.5)
                            run.font.color.rgb = RGBColor(35, 38, 44)

            # Space after table
            spacer = doc.add_paragraph()
            spacer.paragraph_format.space_before = Pt(4)
            spacer.paragraph_format.space_after = Pt(8)

        table_lines = []
        in_table = False

    def flush_code():
        nonlocal in_code_block, code_lines
        if not code_lines:
            return
        code_text = "".join(code_lines)
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(6)
        p.paragraph_format.space_after = Pt(10)
        p.paragraph_format.left_indent = Inches(0.2)
        run = p.add_run(code_text)
        run.font.name = 'Consolas'
        run.font.size = Pt(9.0)
        run.font.color.rgb = RGBColor(30, 30, 30)

        # Style with light shading
        code_lines = []
        in_code_block = False

    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        # Handle code blocks
        if stripped.startswith("```"):
            if in_code_block:
                flush_code()
            else:
                if in_table:
                    flush_table()
                in_code_block = True
                code_lines = []
            i += 1
            continue

        if in_code_block:
            code_lines.append(line)
            i += 1
            continue

        # Handle tables
        if stripped.startswith("|") and stripped.endswith("|"):
            in_table = True
            table_lines.append(stripped)
            i += 1
            continue
        elif in_table:
            flush_table()

        # Empty lines
        if not stripped:
            i += 1
            continue

        # Skip main top title if already emitted
        if stripped.startswith("# ") and i < 5:
            i += 1
            continue

        # Heading 1
        if stripped.startswith("# "):
            h_text = stripped[2:].strip()
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(20)
            p.paragraph_format.space_after = Pt(6)
            p.paragraph_format.keep_with_next = True
            r = p.add_run(h_text)
            r.font.name = 'Calibri'
            r.font.size = Pt(17)
            r.font.bold = True
            r.font.color.rgb = RGBColor(215, 25, 32) # Red
            i += 1
            continue

        # Heading 2
        if stripped.startswith("## "):
            h_text = stripped[3:].strip()
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(15)
            p.paragraph_format.space_after = Pt(5)
            p.paragraph_format.keep_with_next = True
            r = p.add_run(h_text)
            r.font.name = 'Calibri'
            r.font.size = Pt(13.5)
            r.font.bold = True
            r.font.color.rgb = RGBColor(17, 19, 23) # Dark
            i += 1
            continue

        # Heading 3
        if stripped.startswith("### "):
            h_text = stripped[4:].strip()
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(11)
            p.paragraph_format.space_after = Pt(3)
            p.paragraph_format.keep_with_next = True
            r = p.add_run(h_text)
            r.font.name = 'Calibri'
            r.font.size = Pt(11.5)
            r.font.bold = True
            r.font.color.rgb = RGBColor(41, 45, 52)
            i += 1
            continue

        # Bullet list
        if stripped.startswith("* ") or stripped.startswith("- "):
            b_text = stripped[2:].strip()
            p = doc.add_paragraph(style='List Bullet')
            p.paragraph_format.space_before = Pt(1.5)
            p.paragraph_format.space_after = Pt(2.5)

            # parse bold inside bullet
            parts = re.split(r'(\*\*.*?\*\*)', b_text)
            for part in parts:
                if part.startswith("**") and part.endswith("**"):
                    r = p.add_run(part[2:-2])
                    r.font.bold = True
                else:
                    p.add_run(part)
            i += 1
            continue

        # Numbered list
        m_num = re.match(r'^(\d+)\.\s+(.*)$', stripped)
        if m_num:
            item_text = m_num.group(2)
            p = doc.add_paragraph(style='List Number')
            p.paragraph_format.space_before = Pt(1.5)
            p.paragraph_format.space_after = Pt(2.5)
            parts = re.split(r'(\*\*.*?\*\*)', item_text)
            for part in parts:
                if part.startswith("**") and part.endswith("**"):
                    r = p.add_run(part[2:-2])
                    r.font.bold = True
                else:
                    p.add_run(part)
            i += 1
            continue

        # Blockquote
        if stripped.startswith("> "):
            bq_text = stripped[2:].strip()
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(6)
            p.paragraph_format.space_after = Pt(6)
            p.paragraph_format.left_indent = Inches(0.25)
            r = p.add_run(bq_text)
            r.font.italic = True
            r.font.color.rgb = RGBColor(100, 105, 115)
            i += 1
            continue

        # Standard paragraph
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(6)

        parts = re.split(r'(\*\*.*?\*\*)', stripped)
        for part in parts:
            if part.startswith("**") and part.endswith("**"):
                r = p.add_run(part[2:-2])
                r.font.bold = True
            else:
                p.add_run(part)

        i += 1

    if in_table:
        flush_table()
    if in_code_block:
        flush_code()

    doc.save(docx_path)
    print(f"Generated: {docx_path}")

if __name__ == "__main__":
    os.makedirs("docs", exist_ok=True)
    
    # 1. Developer Documentation
    create_styled_docx(
        md_path="docs/DEVELOPER_DOCUMENTATION.md",
        docx_path="docs/DEVELOPER_DOCUMENTATION.docx",
        main_title="Chi-Town Customs USA — Developer Technical Architecture Guide",
        subtitle="Comprehensive Engineering Documentation, Database Relational Schemas, Edge Security & API Specifications"
    )

    # 2. Client Documentation
    create_styled_docx(
        md_path="docs/CLIENT_DOCUMENTATION.md",
        docx_path="docs/CLIENT_DOCUMENTATION.docx",
        main_title="Chi-Town Customs USA — Client & Store Operations User Guide",
        subtitle="Complete Storefront Features Guide, Staff Operations Manual & Support Procedures"
    )
