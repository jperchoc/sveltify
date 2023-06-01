import { fetchRefresh } from "$helpers";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch, params, depends, route, parent }) => {
    depends(`app:${route.id}`);

    const { user } = await parent();
    
    const artistRes = await fetchRefresh(fetch, `/api/spotify/artists/${params.id}`);

    if (!artistRes.ok) {
        throw error(artistRes.status, 'Failed to load artist data');
    }

    const artistResJSON: SpotifyApi.SingleArtistResponse = await artistRes.json();

    let colorReq;
    if (artistResJSON?.images && artistResJSON.images.length > 0) {
        colorReq = fetchRefresh(fetch, `/api/average-color?${new URLSearchParams({
            image: artistResJSON.images[0].url
        }).toString()}`);
    }

    const [albumsRes, appearsOnRes, topTracksRes, relatedArtistsRes, colorRes] = await Promise.all([
        fetch(`/api/spotify/artists/${params.id}/albums?limit=6&include_groups=album,single`),
        fetch(`/api/spotify/artists/${params.id}/albums?limit=6&include_groups=appears_on`),
        fetch(`/api/spotify/artists/${params.id}/top-tracks?market=${user?.country}`),
        fetch(`/api/spotify/artists/${params.id}/related-artists`),
        colorReq
    ]);
    
    return {
        title: artistResJSON.name,
        artist: artistResJSON,
        artistAlbums: albumsRes.ok ? (albumsRes.json() as Promise<SpotifyApi.ArtistsAlbumsResponse>): undefined,
        artistApearsOn: appearsOnRes.ok ? (appearsOnRes.json() as Promise<SpotifyApi.ArtistsAlbumsResponse>): undefined,
        artistTopTracks: topTracksRes.ok ? (topTracksRes.json() as Promise<SpotifyApi.ArtistsTopTracksResponse>): undefined,
        artistRelatedArtists: relatedArtistsRes.ok ? (relatedArtistsRes.json() as Promise<SpotifyApi.ArtistsRelatedArtistsResponse>): undefined,
        color: colorRes?.ok ? colorRes?.json().then((r) => r.color) : null
    }
};