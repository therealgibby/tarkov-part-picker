"use client";

import { VendorBuyOffer, Weapon } from "@/lib/weapons";
import Image from "next/image";
import WeaponModSelect from "./WeaponModSelect";

type Props = {
	weapon: Weapon;
};

export default function WeaponInfo({ weapon }: Props) {
	return (
		<div className="w-full flex flex-col items-center">
			<div className="w-full mt-16 flex flex-row gap-4 justify-between">
				<div className="flex flex-col gap-2">
					<h2 className="text-2xl font-bold">{weapon.name}</h2>
					{/* Caliber */}
					<p>
						<span className="font-bold">Caliber: </span>
						{weapon.properties.caliber.replace("Caliber", "")}
					</p>
					{/* Wiki Link */}
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
					{/* Base Weapon Prices */}
					<div>
						<span className="font-bold">Base Price: </span>
						<div className="ml-4">
							{weapon.buyFor.length > 0 ? (
								weapon.buyFor.map((buyOffer) => {
									if (
										weapon.buyFor.length === 1 &&
										buyOffer.vendor.normalizedName ===
											"flea-market"
									) {
										return (
											<p
												key={
													buyOffer.vendor
														.normalizedName
												}
											>
												N/A
											</p>
										);
									} else if (
										buyOffer.vendor.normalizedName ===
										"flea-market"
									) {
										return;
									}

									return (
										<BuyOfferView
											key={buyOffer.vendor.normalizedName}
											buyOffer={buyOffer}
										/>
									);
								})
							) : (
								<>N/A</>
							)}
						</div>
					</div>
					{/* Default Preset Prices */}
					{weapon.properties.defaultPreset.buyFor.length > 0 && (
						<div>
							<span className="font-bold">Default Preset: </span>
							<div className="ml-4">
								{weapon.properties.defaultPreset.buyFor.map(
									(buyOffer) => {
										return (
											<BuyOfferView
												key={
													buyOffer.vendor
														.normalizedName
												}
												buyOffer={buyOffer}
											/>
										);
									}
								)}
							</div>
						</div>
					)}
				</div>
				{/* Default Preset Image */}
				{weapon.properties.defaultPreset && (
					<Image
						src={weapon.properties.defaultPreset.imageLink}
						className="h-auto"
						alt="Default preset of selected gun."
						width={384}
						height={262.5}
					/>
				)}
			</div>
			<p className="font-bold mt-8">Mods ( Required * )</p>
			<div className="w-full flex flex-col gap-8 items-start mt-6">
				{weapon.properties.slots.map((slot) => {
					return <WeaponModSelect key={slot.id} slot={slot} />;
				})}
			</div>
		</div>
	);
}

function BuyOfferView({ buyOffer }: { buyOffer: VendorBuyOffer }) {
	return (
		<p>
			<span>
				{buyOffer.vendor.name}
				{buyOffer.vendor.minTraderLevel && (
					<span>
						{" "}
						LL
						{buyOffer.vendor.minTraderLevel}
					</span>
				)}
				{": "}
			</span>
			<span>
				{buyOffer.price} {buyOffer.currency}
			</span>
		</p>
	);
}
