import { serverCache } from "@/utils/cache";
import {
	fetchGraphQL,
	Item,
	WeaponModResponse,
	WeaponResponse,
	WeaponsResponse,
} from "@/utils/graphql";
import "server-only";

export async function getWeapons(): Promise<Weapon[]> {
	const allWeaponsId = "all-weapons";
	const isCached = serverCache.has(allWeaponsId);

	if (!isCached) {
		const response = await fetchGraphQL<WeaponsResponse>(`
			{
				items(gameMode: regular, type: gun) {
					id
					name
					iconLink
				}
			}`);

		if (!response || response.errors) return [];

		response.data.items.sort((weapon, nextWeapon) =>
			weapon.name.localeCompare(nextWeapon.name)
		);
		serverCache.set(allWeaponsId, response.data.items, 1200);
	}

	// @ts-ignore
	return serverCache.get(allWeaponsId);
}

// gets weapon stats and slots
export async function getWeaponInfo(
	weaponItemId: string
): Promise<Weapon | null> {
	if (typeof weaponItemId !== "string" || weaponItemId === "none") {
		return null;
	}

	const isCached = serverCache.has(weaponItemId);

	if (!isCached) {
		const response = await fetchGraphQL<WeaponResponse>(`
			{
				item(id: "${weaponItemId}") {
					name
					iconLink
					wikiLink
					buyFor {
						currency
						price
						vendor {
							name
							... on TraderOffer {
								minTraderLevel
								normalizedName
							}
							... on FleaMarket {
								normalizedName
							}
						}
					}
					properties {
						... on ItemPropertiesWeapon {
							caliber
							defaultPreset {
									imageLink
									buyFor {
										currency
										price
										vendor {
											name
											normalizedName
											... on TraderOffer {
												minTraderLevel
											}
										}
									}
								}
							slots {
								id
								name
								required
								filters {
									allowedItems {
										id
										name
										iconLink
									}
								}
							}
						}
					}
				}
			}`);

		if (!response || response.errors) return null;

		response.data.item.id = weaponItemId;
		serverCache.set<Weapon>(weaponItemId, response.data.item);
	}

	// @ts-ignore
	return serverCache.get<Weapon>(weaponItemId);
}

// gets weapon mod stats with given modItemId and its mod slots
export async function getWeaponModInfo(
	modItemId: string
): Promise<WeaponMod | null> {
	if (typeof modItemId !== "string" || modItemId === "none") {
		return null;
	}

	const isCached = serverCache.has(modItemId);

	if (!isCached) {
		const response = await fetchGraphQL<WeaponModResponse>(`
			{
				item(id: "${modItemId}") {
					name
					iconLink
					wikiLink
					properties {
						... on ItemPropertiesWeaponMod {
							ergonomics
							recoil
							recoilModifier
							accuracyModifier
							slots {
								id
								name
								required
								filters {
									allowedItems {
										id
										name
										iconLink
									}
								}
							}
						}
					}
				}
			}`);

		if (!response || response.errors) return null;

		response.data.item.id = modItemId;
		serverCache.set(modItemId, response.data.item);
	}

	// @ts-ignore
	return serverCache.get(modItemId);
}

export interface Weapon extends Item {
	properties: ItemPropertiesWeapon;
}

export interface WeaponMod extends Item {
	properties: ItemPropertiesWeaponMod;
}

export interface ItemPropertiesWeapon {
	caliber: string;
	defaultPreset: {
		imageLink: string;
		buyFor: VendorBuyOffer[];
	};
	slots: {
		id: string;
		name: string;
		required: boolean;
		filters: {
			allowedItems: WeaponMod[];
		};
		selectedMod?: WeaponMod;
	}[];
}

export interface ItemPropertiesWeaponMod {
	ergonomics: number;
	recoil: number;
	recoilModifier: number;
	accuracyModifier: number;
	slots: {
		id: string;
		name: string;
		required: boolean;
		filters: {
			allowedItems: WeaponMod[];
		};
		selectedMod?: WeaponMod;
	}[];
}

export type VendorBuyOffer = {
	currency: string;
	price: number;
	vendor: {
		name: string;
		normalizedName: string;
		minTraderLevel?: number;
	};
};
