<script lang="ts">
	import { page } from "$app/stores";
	import { Button } from "$components";
	import { ArrowLeft, ArrowRight } from "lucide-svelte";
	import { createEventDispatcher } from "svelte";

    export let paginatedList: SpotifyApi.PagingObject<any>;
    export let isLoading: boolean;

    $: currentPage = $page.url.searchParams.get('page') || 1;

    const dispatch = createEventDispatcher<{
        loadmore: {}
    }>();
</script>

{#if paginatedList.next}
    <div class="load-more">
        <Button element="button" variant="outline" disabled={isLoading} on:click={() => dispatch('loadmore')}>
            Load More <span class="visually-hidden">Items</span>
        </Button>
    </div>
{/if}

<div class="pagination">
    <div class="previous">
        {#if paginatedList.previous}
            <Button element="a" variant="outline" href="{$page.url.pathname}?{new URLSearchParams({
                page: `${Number(currentPage) - 1}`
            }).toString()}"><ArrowLeft focusable="false" aria-hidden size={16}/> Previous Page</Button>
        {/if}
    </div>
    <div class="next">
        {#if paginatedList.next}
        <Button element="a" variant="outline" href="{$page.url.pathname}?{new URLSearchParams({
            page: `${Number(currentPage) + 1}`
        }).toString()}">Next Page <ArrowRight focusable="false" aria-hidden size={16}/></Button>
    {/if}
    </div>
</div>

<style lang="scss">
    .pagination {
        display: none;
        justify-content: space-between;
        :global(html.no-js) & {
            display: flex;
        }
        :global(svg) {
            vertical-align: middle;
        }
    }
    .load-more {
        padding: 15px;
        text-align: center;
        :global(html.no-js) & {
            display: none;
        }
    }
</style>