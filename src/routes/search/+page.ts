import { fetchRefresh } from "$helpers";
import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch, url }) => {
    const query = url.searchParams.get('q');
	if (query) {
		throw redirect(307, `/search/${query}`);
	}
    const catRes = await fetchRefresh(fetch, `/api/spotify/browse/categories?limit=50`);
    return {
        title: 'Search',
        categories: catRes.ok ? catRes.json() as Promise<SpotifyApi.MultipleCategoriesResponse> : undefined
    }
};