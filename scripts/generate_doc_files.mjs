import fs from "fs";

function mdToDocHtml(title, mdContent) {
  let body = mdContent
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/gim, "<em>$1</em>")
    .replace(/`([^`]+)`/gim, '<code style="background-color:#f4f4f4;padding:2px 4px;font-family:Consolas,monospace;">$1</code>')
    .replace(/```([\s\S]*?)```/gim, '<pre style="background-color:#1e1e1e;color:#d4d4d4;padding:12px;border-radius:6px;font-family:Consolas,monospace;font-size:10pt;"><code>$1</code></pre>')
    .replace(/^\s*\*\s+(.*$)/gim, "<li>$1</li>")
    .replace(/^\s*-\s+(.*$)/gim, "<li>$1</li>")
    .replace(/\n\n/gim, "<p></p>");

  return `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset='utf-8'>
<title>${title}</title>
<style>
body { font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #1a1a1a; margin: 40px; }
h1 { color: #D71920; font-size: 20pt; border-bottom: 2px solid #D71920; padding-bottom: 6px; margin-top: 24px; }
h2 { color: #111317; font-size: 15pt; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-top: 20px; }
h3 { color: #333333; font-size: 12pt; margin-top: 16px; }
table { border-collapse: collapse; width: 100%; margin: 16px 0; }
th, td { border: 1px solid #ddd; padding: 8px 12px; font-size: 10pt; text-align: left; }
th { background-color: #f7f7f7; font-weight: bold; }
blockquote { border-left: 4px solid #D71920; margin: 12px 0; padding: 8px 16px; background-color: #fdf5f5; }
code { font-family: Consolas, monospace; }
pre { background: #1e1e1e; color: #d4d4d4; padding: 12px; border: 1px solid #222; overflow-x: auto; }
ul, ol { margin: 8px 0; padding-left: 24px; }
li { margin-bottom: 4px; }
</style>
</head>
<body>
${body}
</body>
</html>`;
}

const devMd = fs.readFileSync("docs/DEVELOPER_DOCUMENTATION.md", "utf8");
const clientMd = fs.readFileSync("docs/CLIENT_DOCUMENTATION.md", "utf8");

fs.writeFileSync("docs/DEVELOPER_DOCUMENTATION.doc", mdToDocHtml("Chi-Town Customs USA - Developer Documentation", devMd), "utf8");
fs.writeFileSync("docs/CLIENT_DOCUMENTATION.doc", mdToDocHtml("Chi-Town Customs USA - Client Operations Guide", clientMd), "utf8");

console.log("Successfully generated .doc files in docs/ folder.");
