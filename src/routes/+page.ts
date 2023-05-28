import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
    const res = await fetch('/api/spotify/browse/new-releases')
    console.log(await res.json())
};