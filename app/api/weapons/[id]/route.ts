import { getWeaponInfo } from "@/lib/weapons";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params;
	if (!id) {
		return NextResponse.json(
			{ error: "No weapon ID present in request." },
			{ status: 400 }
		);
	}

	const weaponInfo = await getWeaponInfo(id);

	if (!weaponInfo) {
		return NextResponse.json(
			{ error: "The requested weapon does not exist." },
			{ status: 404 }
		);
	}

	return NextResponse.json(weaponInfo, { status: 200 });
}
