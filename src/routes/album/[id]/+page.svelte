<script lang="ts">
	import { ItemPage, TrackList } from "$components";
    import { getCopyrightSymbol } from "$helpers";
	import type { PageData } from "./$types";

    export let data: PageData;

    $: album = data.album;
    $: color = data.color;
</script>

<ItemPage 
    title={album.name} 
    type={album.album_type} 
    color={color}
    image={album.images[0].url}
    >
    <p class="meta" slot="meta">
        <span class="artists">
            {album.artists.map(a => a.name).join(', ')}
        </span>
        <span class="date">{new Date(album.release_date).getFullYear()}</span>
        <span class="tracks-count">{`${album.total_tracks} Track${album.total_tracks > 1 ? 's':''}`}</span>
    </p>
    <TrackList tracks={album.tracks.items} userPlaylists={data.userAllPlaylists} />
    <div class="credits">
        <p class="date">
            
        </p>
        {#each album.copyrights as copyright}
            <p class="copyright">
                {getCopyrightSymbol(copyright.type)}{copyright.text}
            </p>
        {/each}
    </div>
</ItemPage>

<style lang="scss">
    .credits {
        margin-top: 40px;
        p {
            color: var(--light-gray);
            margin: 0;
            font-size: functions.toRem(11);
            &.date {
                font-size: functions.toRem(13);
            }
        }
    }
</style>