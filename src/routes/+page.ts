import type { PageLoad } from "./$types";
import { fetchRefresh } from "$helpers";

export const load: PageLoad = async ({ fetch: _fetch, parent }) => {
    const limit = 6;
    const fetch = (path: string) => fetchRefresh(_fetch, path);
    const { user } = await parent();

    const catRes = await fetch(`/api/spotify/browse/categories`);
    const catResJSON: SpotifyApi.MultipleCategoriesResponse | undefined = catRes.ok ? await catRes.json() : undefined;

    const randomCats = catResJSON ? catResJSON.categories.items.sort(() => 0.5 - Math.random()).slice(0, 3) : [];
    const randomCatsPromises = randomCats.map(cat => fetch(`/api/spotify/browse/categories/${cat.id}/playlists?limit=${limit}`));

    const newReleases = fetch(`/api/spotify/browse/new-releases?limit=${limit}`);
    const featuredPlaylists = fetch(`/api/spotify/browse/featured-playlists?limit=${limit}`);
    const userPlaylists = fetch(`/api/spotify/users/${user?.id}/playlists?limit=${limit}`);

    const [newReleasesRes, featuredPlaylistsRes, userPlaylistsRes, ...randomCatsRes] = await Promise.all([
        newReleases, 
        featuredPlaylists, 
        userPlaylists,
        ...randomCatsPromises
    ]);

    return {
        newReleases: newReleasesRes.ok ? await newReleasesRes.json() as Promise<SpotifyApi.ListOfNewReleasesResponse>: undefined,
        featuredPlaylists: featuredPlaylistsRes.ok ? await featuredPlaylistsRes.json() as Promise<SpotifyApi.ListOfFeaturedPlaylistsResponse> : undefined,
        userPlaylists: userPlaylistsRes.ok ? await userPlaylistsRes.json() as Promise<SpotifyApi.ListOfUsersPlaylistsResponse>: undefined,
        homeCategories: randomCats,
        categoriesPlaylist: Promise.all(randomCatsRes.map(res => res.ok ? res.json() as Promise<SpotifyApi.CategoryPlaylistsResponse>: undefined))
    }
};