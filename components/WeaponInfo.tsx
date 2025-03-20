"use client";

import { Weapon } from "@/lib/weapons";
import Image from "next/image";

type Props = {
	weapon: Weapon;
};

export default function WeaponInfo({ weapon }: Props) {
	return (
		<div className="flex flex-col items-center">
			<div className="w-full mt-16 flex flex-row gap-4 justify-center">
				{weapon.properties.defaultPreset && (
					<Image
						src={weapon.properties.defaultPreset.imageLink}
						className="h-auto"
						alt="Default preset of selected gun."
						width={384}
						height={262.5}
					/>
				)}
				<div className="flex flex-col gap-2">
					<h2 className="text-2xl font-bold">{weapon.name}</h2>
					<p>
						<span className="font-bold">Caliber: </span>
						{weapon.properties.caliber.replace("Caliber", "")}
					</p>
					<p>
						<span className="font-bold">Wiki: </span>
						<a
							href={`${weapon.wikiLink}`}
							target="_blank"
							className="underline"
						>
							Link
						</a>
					</p>
				</div>
			</div>
			<p className="font-bold mt-8">Required *</p>
			<div className="flex flex-row flex-wrap gap-8 justify-center mt-6">
				{weapon.properties.slots.map((slot) => {
					return (
						<div key={slot.id} className="flex flex-col gap-2">
							{slot.required ? (
								<label className="font-bold">
									* {slot.name}
								</label>
							) : (
								<label className="font-bold">{slot.name}</label>
							)}
							<select
								className="w-80 border-gray-400 border-2 bg-none rounded-md px-1 py-0.5 outline-none"
								defaultValue="none"
							>
								<option value="none" className="bg-black">
									Select a mod...
								</option>

								{slot.filters.allowedItems.map(
									(allowedItem) => {
										return (
											<option
												key={allowedItem.id}
												className="bg-black"
												value={allowedItem.id}
											>
												{allowedItem.name}
											</option>
										);
									}
								)}
							</select>
						</div>
					);
				})}
			</div>
		</div>
	);
}
