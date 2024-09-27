<script lang="ts">
	import { page } from '$app/stores';
	import { ListItem, Button } from 'carbon-components-svelte';
	import {
		type StorageReference,
		type getStorage,
		type ref,
		deleteObject,
		getDownloadURL
	} from 'firebase/storage';
	import { DownloadURL } from 'sveltefire';
	import {
		DataTable,
		Toolbar,
		ToolbarContent,
		ToolbarSearch,
		Pagination,
		Link,
		OverflowMenu,
		OverflowMenuItem
	} from 'carbon-components-svelte';
	import Copy from 'carbon-icons-svelte/lib/Copy.svelte';
	import { toast } from 'svelte-sonner';

	export let items: StorageReference[] = [];

	$: rows = items.map((v) => {
		return {
			id: v.fullPath,
			fullpath: v.fullPath,
			ref: v,
			name: v.name
		};
	});

	let filteredRowIds = [] as unknown[];

	async function deleteItem(ref: StorageReference) {
		try {
			await deleteObject(ref);
		} catch (err) {
			toast.error(`Error deleting file: ${err.message}`);
			return;
		}
		toast.success(`File deleted: ${ref.name}`);
	}

	async function copyStorageDirectLink(ref: StorageReference) {
		const url = await getDownloadURL(ref);
		navigator.clipboard.writeText(url);
		toast.success(`Storage direct link copied to clipboard: ${ref.name}`);
	}

	async function copyPublicLink(ref: StorageReference) {
		const url = `${$page.url.origin}/${ref.name}`;
		navigator.clipboard.writeText(url);
		toast.success(`Public link copied to clipboard: ${ref.name}`);
	}
</script>

<DataTable
	headers={[
		{ key: 'name', value: 'Name' },
		{ key: 'quickaction', empty: true },
		{ key: 'menu', empty: true }
	]}
	{rows}
>
	<Toolbar>
		<ToolbarContent>
			<ToolbarSearch persistent shouldFilterRows bind:filteredRowIds />
		</ToolbarContent>
	</Toolbar>
	<strong slot="title">Public Files</strong>
	<span slot="description" style="font-size: 1rem">
		Your public files uploaded on <code>p/</code>
	</span>
	<svelte:fragment slot="cell-header" let:header>
		{header.value}
	</svelte:fragment>
	<svelte:fragment slot="cell" let:row let:cell>
		{#if cell.key === 'menu'}
			<OverflowMenu flipped>
				<OverflowMenuItem
					on:click={() => copyStorageDirectLink(row.ref)}
					text="Copy storage direct link"
				/>
				<OverflowMenuItem on:click={() => deleteItem(row.ref)} danger text="Delete" />
			</OverflowMenu>
		{:else if cell.key === 'quickaction'}
			<DownloadURL let:link ref={row.fullpath}>
				<Button
					size="field"
					icon={Copy}
					kind="ghost"
					iconDescription="Copy public link to clipboard"
					on:click={() => copyPublicLink(row.ref)}
				/>
			</DownloadURL>
		{:else}
			{cell.value}
		{/if}
	</svelte:fragment>
</DataTable>
