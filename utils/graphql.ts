import {
	ItemPropertiesWeapon,
	ItemPropertiesWeaponMod,
	Weapon,
	WeaponMod,
} from "@/lib/weapons";

export async function fetchGraphQL<T>(
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

interface GraphQLResponse<T> {
	data: T;
	errors?: any[];
}

export interface WeaponsResponse {
	items: Weapon[];
}

export interface WeaponResponse {
	item: Weapon;
}

export interface WeaponModResponse {
	item: WeaponMod;
}

export interface Item {
	id: string;
	name: string;
	iconLink: string;
	wikiLink: string;
	properties: ItemPropertiesWeapon | ItemPropertiesWeaponMod;
}
