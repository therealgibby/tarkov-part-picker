"use server";

import WeaponInfo from "@/components/WeaponSelect";

export default async function Home() {
	return (
		<div className="max-w-[1200px] mx-auto pb-32">
			<WeaponInfo />
		</div>
	);
}
