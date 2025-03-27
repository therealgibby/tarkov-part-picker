"use server";

import WeaponSelect from "@/components/WeaponSelect";
import { getWeapons } from "@/lib/weapons";

export default async function Home() {
	const weaponsList = await getWeapons();

	return (
		<div className="max-w-[1200px] mx-auto pb-32">
			<WeaponSelect weapons={weaponsList} />
		</div>
	);
}
