<script lang="ts">
	import { StorageList } from 'sveltefire';
	import FileList from './FileList.svelte';
	import { SkeletonText, UnorderedList, ListItem } from 'carbon-components-svelte';
	import type { StorageReference } from 'firebase/storage';

	export let currentRef: string | StorageReference = 'p/';
</script>

<StorageList bind:ref={currentRef} let:list>
	<UnorderedList>
		{#if list === null}
			<SkeletonText width="100%" />
		{:else if list.prefixes.length === 0 && list.items.length === 0}
			<ListItem>Empty</ListItem>
		{:else}
			<FileList items={list.items} />
		{/if}
	</UnorderedList>
</StorageList>
