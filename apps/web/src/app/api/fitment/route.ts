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
      // Return list of available verified makes and years
      const records = await db.fitmentRecord.findMany({
        select: { year: true, make: true, model: true, trim: true, boltPattern: true },
        distinct: ["year", "make", "model"],
        orderBy: [{ year: "desc" }, { make: "asc" }],
      });
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

    // Search for match in database
    const record = await db.fitmentRecord.findFirst({
      where: {
        year,
        make: { contains: queryMake },
        model: { contains: queryModel.split(" ")[0] }, // match model prefix
      },
    });

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
