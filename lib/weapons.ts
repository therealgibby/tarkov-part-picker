import { serverCache } from "@/utils/cache";
import "server-only";

async function fetchGraphQL<T>(
	query: string
): Promise<GraphQLResponse<T> | null> {
	return fetch("https://api.tarkov.dev/graphql", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json",
		},
		body: JSON.stringify({ query }),
	})
		.then(async (response) => {
			return response.json().catch((jsonError) => {
				console.log(jsonError);
				return null;
			});
		})
		.catch((requestError) => {
			console.log(requestError);
			return null;
		});
}

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
					properties {
						... on ItemPropertiesWeapon {
							caliber
							defaultPreset {
									imageLink
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

interface GraphQLResponse<T> {
	data: T;
	errors?: any[];
}

interface WeaponsResponse {
	items: Weapon[];
}

interface WeaponResponse {
	item: Weapon;
}

interface WeaponModsResponse {
	items: WeaponMod[];
}

interface WeaponModResponse {
	item: WeaponMod;
}

interface Item {
	id: string;
	name: string;
	iconLink: string;
	wikiLink: string;
	properties: ItemPropertiesWeapon | ItemPropertiesWeaponMod;
}

export interface Weapon extends Item {
	properties: ItemPropertiesWeapon;
}

export interface WeaponMod extends Item {
	properties: ItemPropertiesWeaponMod;
}

interface ItemPropertiesWeapon {
	caliber: string;
	defaultPreset: {
		imageLink: string;
	};
	slots: {
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
	}[];
}

interface ItemPropertiesWeaponMod {
	ergonomics: number;
	recoil: number;
	recoilModifier: number;
	accuracyModifier: number;
	slots: {
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
	}[];
}
