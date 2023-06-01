<script lang="ts">
	import { Button, Card, ItemPage, TrackList } from "$components";
import type { PageData } from "./$types";

    export let data: PageData;

    $: artist = data.artist;
    $: artistAlbums = data.artistAlbums;
    $: artistApearsOn = data.artistApearsOn;
    $: artistTopTracks = data.artistTopTracks;
    $: artistRelatedArtists = data.artistRelatedArtists;
    $: color = data.color;

    const followersFormat = Intl.NumberFormat('en', {
        notation: 'compact'
    });
</script>
    <ItemPage
        title={data.title}
        type={artist.type}
        color={color}
        image={artist.images[0].url || undefined}
    >
    <span slot="meta" class="following-count">{followersFormat.format(artist?.followers?.total || 0)} Followers</span>
    <div class="content">
        {#if artistTopTracks && artistTopTracks.tracks.length > 0}
            <div class="section">
                <div class="section-title">
					<h2>Top Tracks</h2>
				</div>
                <TrackList tracks={artistTopTracks.tracks} userPlaylists={data.userAllPlaylists?.filter((pl) => pl.owner.id === data.user?.id)} />
            </div>
        {/if}
        {#if artistAlbums && artistAlbums.items.length > 0}
            <div class="section">
                <div class="section-title">
					<h2>Albums</h2>
                    <Button element="a" href={`/artist/${artist.id}/albums`} variant="outline"
						>View All <span class="visually-hidden">Albums</span>
                    </Button>
				</div>
                <div class="grid-items">
					{#each artistAlbums.items as album}
						<div class="grid-item">
							<Card item={album} />
						</div>
					{/each}
				</div>
            </div>
        {/if}
        {#if artistApearsOn && artistApearsOn.items.length > 0}
            <div class="section">
                <div class="section-title">
                    <h2>Appears On</h2>
                    <Button element="a" href={`/artist/${artist.id}/appears-on`} variant="outline"
						>View All <span class="visually-hidden">artist appearances</span>
                    </Button>
                </div>
                <div class="grid-items">
                    {#each artistApearsOn.items as appearsOn}
                        <div class="grid-item">
                            <Card item={appearsOn} />
                        </div>
                    {/each}
                </div>
                
            </div>
        {/if}
        {#if artistRelatedArtists && artistRelatedArtists.artists.length > 0}
            <div class="section">
                <div class="section-title">
                    <h2>Related Artists</h2>
                    <Button element="a" href={`/artist/${artist.id}/related-artists`} variant="outline"
						>View All <span class="visually-hidden">Relasted Artists</span>
                    </Button>
                </div>
                <div class="grid-items">
                    {#each artistRelatedArtists.artists.splice(0,6) as artist}
                        <div class="grid-item">
                            <Card item={artist} />
                        </div>
                    {/each}
                </div>
            </div>
        {/if}
    </div>

    </ItemPage>

    <style lang="scss">
        .section {
            margin-bottom: 40px;
            .section-title {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 10px;
                h2 {
                    font-size: functions.toRem(26);
                    font-weight: 600;
                }
            }
        }
    </style>