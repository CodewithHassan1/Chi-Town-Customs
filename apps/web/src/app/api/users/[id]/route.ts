import { NextResponse } from "next/server";
import db from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { UserUpdateRoleSchema } from "@chi-town/contracts";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const session = await requireAdminSession(request, ["SUPER_ADMIN"]);
    const { id } = await params;
    const body = await request.json();

    const parseResult = UserUpdateRoleSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { role: newRole } = parseResult.data;

    const user = await db.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Protection: Prevent demoting primary super admin account
    if (user.email === "admin@chitowncustoms.com" && newRole !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "The primary Super Admin root account cannot be demoted." },
        { status: 403 }
      );
    }

    // Protection: Prevent demoting your own account
    if (user.id === session.id && newRole !== user.role) {
      return NextResponse.json(
        { error: "You cannot change your own administrative role." },
        { status: 403 }
      );
    }

    const updated = await db.user.update({
      where: { id },
      data: { role: newRole },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        createdAt: true,
      },
    });

    await db.auditLog.create({
      data: {
        action: "USER_ROLE_CHANGED",
        entity: "User",
        entityId: id,
        staffUserId: session.id,
        staffEmail: session.email,
        metadataJson: JSON.stringify({
          targetUser: user.email,
          previousRole: user.role,
          newRole,
          modifiedBy: session.name,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      user: updated,
      message: `User ${user.name} role updated to ${newRole}.`,
    });
  } catch (error: any) {
    const isAuth =
      error.message?.includes("UNAUTHORIZED") || error.message?.includes("FORBIDDEN");
    return NextResponse.json(
      { error: error.message || "Failed to update user role" },
      { status: isAuth ? 401 : 500 }
    );
  }
}
