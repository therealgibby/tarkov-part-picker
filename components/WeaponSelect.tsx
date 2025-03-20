"use client";

import { getWeaponInfo, getWeapons, Weapon } from "@/lib/weapons";
import { ChangeEvent, useEffect, useState } from "react";
import WeaponInfo from "./WeaponInfo";

export default function WeaponSelect() {
	const [weaponsList, setWeaponsList] = useState<Weapon[]>([]);
	const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null);

	useEffect(() => {
		getWeapons().then((weapons) => {
			weapons.sort((weapon, nextWeapon) =>
				weapon.name > nextWeapon.name ? 1 : -1
			);
			setWeaponsList(weapons);
		});
	}, []);

	async function handleWeaponChange(event: ChangeEvent<HTMLSelectElement>) {
		const weaponInfo = await getWeaponInfo(event.target.value);
		if (weaponInfo) setSelectedWeapon(weaponInfo);
	}

	return (
		<div className="flex flex-col items-center">
			<h2 className="text-3xl font-bold mt-10">Create Gun Build</h2>
			<select
				className="w-2xl mt-10 bg-none border-gray-400 border-2 rounded-md px-1 py-0.5 outline-none"
				onChange={handleWeaponChange}
				defaultValue="none"
			>
				<option value="none" className="bg-black">
					Select a weapon...
				</option>
				{weaponsList &&
					weaponsList.map((weapon) => {
						return (
							<option
								key={weapon.id}
								className="bg-black"
								value={weapon.id}
							>
								{weapon.name}
							</option>
						);
					})}
			</select>
			{selectedWeapon && <WeaponInfo weapon={selectedWeapon} />}
		</div>
	);
}
