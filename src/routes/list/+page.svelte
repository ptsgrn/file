<!--
 Copyright (c) 2023 Patsagorn Y.
 
 This software is released under the MIT License.
 https://opensource.org/licenses/MIT
-->
<script>
	import { InlineLoading, ListItem, SkeletonText, UnorderedList } from 'carbon-components-svelte';
	import { getAllImagesInRef } from '$lib/client/firebase';
	import { browser } from '$app/environment';
</script>

{#await getAllImagesInRef()}
	<InlineLoading />
	<SkeletonText />
{:then data}
	<UnorderedList expressive>
		{#each data as item}
			<ListItem>{item.name}</ListItem>
		{/each}
	</UnorderedList>
{:catch error}
	<p>{error.message}</p>
{/await}
<!-- <DataTable
  headers={[
    { key: 'name', value: 'Name' },
    { key: 'size', value: 'Size' },
    { key: 'type', value: 'Type'},
    { key: 'thumbnail', value: 'Thumbnail'},
    { key: 'action', value: 'Action' }
  ]}
  rows={getAllImagesInRef()}
  /> -->
