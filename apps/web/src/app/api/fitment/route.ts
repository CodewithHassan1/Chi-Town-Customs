import { NextResponse } from "next/server";
import db from "@/lib/db";
import { FitmentQuerySchema } from "@chi-town/contracts";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const yearStr = searchParams.get("year");
    const make = searchParams.get("make");
    const model = searchParams.get("model");
    const trim = searchParams.get("trim") || undefined;

    if (!yearStr || !make || !model) {
      let records: any[] = [];
      try {
        records = await db.fitmentRecord.findMany({
          select: { year: true, make: true, model: true, trim: true, boltPattern: true },
          distinct: ["year", "make", "model"],
          orderBy: [{ year: "desc" }, { make: "asc" }],
        });
      } catch (e) {
        console.warn("api/fitment database query error, using fallback vehicle list:", e);
        records = [
          { year: 2024, make: "Ford", model: "Mustang", trim: "GT / Dark Horse", boltPattern: "5x114.3" },
          { year: 2024, make: "Chevrolet", model: "Corvette", trim: "Stingray C8", boltPattern: "5x120" },
          { year: 2023, make: "BMW", model: "M3 / M4", trim: "Competition G80/G82", boltPattern: "5x112" },
          { year: 2023, make: "Jeep", model: "Grand Cherokee", trim: "Trackhawk / SRT", boltPattern: "5x127" },
          { year: 2022, make: "Dodge", model: "Charger / Challenger", trim: "Hellcat / Scat Pack", boltPattern: "5x115" },
        ];
      }
      return NextResponse.json({ success: true, count: records.length, availableVehicles: records });
    }

    const validation = FitmentQuerySchema.safeParse({
      year: yearStr,
      make,
      model,
      trim,
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid fitment query parameters", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { year, make: queryMake, model: queryModel } = validation.data;

    // Search for match in database: first exact year, then generation-wide
    let record = await db.fitmentRecord.findFirst({
      where: {
        year,
        make: { contains: queryMake, mode: "insensitive" },
        model: { contains: queryModel.split(" ")[0], mode: "insensitive" },
      },
    });

    if (!record) {
      record = await db.fitmentRecord.findFirst({
        where: {
          make: { contains: queryMake, mode: "insensitive" },
          model: { contains: queryModel.split(" ")[0], mode: "insensitive" },
        },
        orderBy: { year: "desc" },
      });
    }

    if (!record) {
      return NextResponse.json({
        success: true,
        isVerified: false,
        message:
          "No automated verified fitment profile found for this exact trim. Our Chicago master fitment specialists can verify custom offset and caliper clearance manually.",
        phoneContact: "+1 773-287-3000",
        shopAddress: "311 N Cicero Ave, Chicago, IL 60644",
      });
    }

    // Find compatible wheels from database matching bolt pattern and diameter range
    const compatibleWheels = await db.product.findMany({
      where: {
        isActive: true,
        productType: "WHEEL",
        variants: {
          some: {
            boltPattern: record.boltPattern,
            diameter: {
              gte: record.minDiameter,
              lte: record.maxDiameter,
            },
          },
        },
      },
      include: {
        brand: true,
        variants: {
          where: {
            boltPattern: record.boltPattern,
            diameter: {
              gte: record.minDiameter,
              lte: record.maxDiameter,
            },
          },
        },
      },
      take: 8,
    });

    return NextResponse.json({
      success: true,
      isVerified: record.isVerified,
      fitment: {
        year: record.year,
        make: record.make,
        model: record.model,
        trim: record.trim,
        boltPattern: record.boltPattern,
        diameterRange: `${record.minDiameter}" – ${record.maxDiameter}"`,
        offsetRange: `+${record.minOffset} to +${record.maxOffset} mm`,
        frontTireSize: record.tireSizeFront,
        rearTireSize: record.tireSizeRear,
        notes: record.notes,
      },
      compatibleWheelsCount: compatibleWheels.length,
      compatibleWheels,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Fitment lookup failed" }, { status: 500 });
  }
}
