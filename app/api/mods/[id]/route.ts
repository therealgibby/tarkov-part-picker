import { getWeaponModInfo } from "@/lib/weapons";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params;
	if (!id) {
		return NextResponse.json(
			{ error: "No mod ID present in request." },
			{ status: 400 }
		);
	}

	const modInfo = await getWeaponModInfo(id);

	if (!modInfo) {
		return NextResponse.json(
			{ error: "The requested mod does not exist." },
			{ status: 404 }
		);
	}

	return NextResponse.json(modInfo, { status: 200 });
}
