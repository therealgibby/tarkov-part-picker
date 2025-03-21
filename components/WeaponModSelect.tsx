"use client";

import { getWeaponModInfo, WeaponMod } from "@/lib/weapons";
import { ChangeEvent, useState } from "react";

type Props = {
	slot: {
		id: string;
		name: string;
		required: boolean;
		filters: {
			allowedItems: {
				id: string;
				name: string;
				iconLink: string;
			}[];
		};
	};
};

export default function WeaponModSelect({ slot }: Props) {
	const [selectedMod, setSelectedMod] = useState<WeaponMod | null>(null);

	async function handleModSelect(event: ChangeEvent<HTMLSelectElement>) {
		const newModSelectionId = event.target.value;

		if (newModSelectionId === "none") setSelectedMod(null);

		if (!selectedMod || selectedMod.id !== newModSelectionId) {
			const modInfo = await getWeaponModInfo(event.target.value);
			setSelectedMod(modInfo);
		}
	}

	function selectedModHasSlots(): boolean {
		return (
			selectedMod !== null &&
			selectedMod.properties.slots &&
			selectedMod.properties.slots.length > 0
		);
	}

	return (
		<div
			className={`flex flex-col mt-8 p-4 ${
				selectedModHasSlots() && "border-l-2 border-gray-500"
			}`}
		>
			{slot.required ? (
				<label className="font-bold">* {slot.name}</label>
			) : (
				<label className="font-bold">{slot.name}</label>
			)}
			<select
				className="w-80 border-gray-400 border-2 bg-none rounded-md px-1 py-0.5 outline-none"
				defaultValue="none"
				onChange={handleModSelect}
			>
				<option value="none" className="bg-black">
					None
				</option>

				{slot.filters.allowedItems.map((allowedItem) => {
					return (
						<option
							key={allowedItem.id}
							className="bg-black"
							value={allowedItem.id}
						>
							{allowedItem.name}
						</option>
					);
				})}
			</select>
			{selectedMod && selectedModHasSlots() && (
				<div className="ml-8 flex flex-col">
					{selectedMod.properties.slots.map((slot) => {
						return <WeaponModSelect key={slot.id} slot={slot} />;
					})}
				</div>
			)}
		</div>
	);
}
