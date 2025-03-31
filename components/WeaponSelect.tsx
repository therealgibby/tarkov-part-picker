"use client";

import { ChangeEvent, useRef, useState } from "react";
import WeaponInfo from "./WeaponInfo";
import { Weapon } from "@/lib/weapons";

type Props = {
	weapons: Weapon[];
};

export default function WeaponSelect({ weapons }: Props) {
	const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null);
	const configuredWeapon = useRef<Weapon | null>(null);

	async function handleWeaponSelect(event: ChangeEvent<HTMLSelectElement>) {
		const weaponIndex = event.target.value;

		if (weaponIndex === "none") {
			setSelectedWeapon(null);
			return;
		}

		if (isStringInteger(weaponIndex)) {
			const intWeaponIndex = parseInt(weaponIndex);
			if (intWeaponIndex < 0 || intWeaponIndex >= weapons.length) return;

			const weaponInfo = await fetchWeaponInfo(
				weapons[intWeaponIndex].id
			);
			if (weaponInfo) {
				setSelectedWeapon(weaponInfo);
				configuredWeapon.current = {
					...weaponInfo,
				};
			}
		}
	}

	return (
		<div className="flex flex-col items-center">
			<h2 className="text-3xl font-bold mt-10">Create Gun Build</h2>
			<select
				className="w-2xl mt-10 bg-none border-gray-400 border-2 rounded-md px-1 py-0.5 outline-none"
				onChange={handleWeaponSelect}
				defaultValue="none"
			>
				<option value="none" className="bg-black">
					Select a weapon...
				</option>
				{weapons &&
					weapons.map((weapon, index) => {
						return (
							<option
								key={weapon.id}
								className="bg-black"
								value={index}
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

async function fetchWeaponInfo(weaponId: string): Promise<Weapon | null> {
	return await fetch(`${process.env.NEXT_PUBLIC_URL}/api/weapons/${weaponId}`)
		.then((response) => {
			if (response.ok) return response.json();
			return response.json().then((json) => Promise.reject(json));
		})
		.catch((error) => {
			console.log(error.error);
			return null;
		});
}

function isStringInteger(str: string): boolean {
	if (typeof str !== "string") {
		return false;
	}
	if (str.trim() === "") {
		return false;
	}

	return /^-?\d+$/.test(str);
}
