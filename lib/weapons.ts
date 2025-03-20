"use client";

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
	const response = await fetchGraphQL<WeaponsResponse>(`
		{
            items(gameMode: regular, type: gun) {
				id
				name
				iconLink
			}
        }`);

	if (!response || response.errors) return [];

	return response.data.items;
}

// gets weapon stats and slots
export async function getWeaponInfo(
	weaponItemId: string
): Promise<Weapon | null> {
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
	return response.data.item;
}

// gets weapon mod stats with given modItemId and its mod slots
export async function getWeaponModInfo(
	modItemId: string
): Promise<WeaponMod | null> {
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
	return response.data.item;
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
