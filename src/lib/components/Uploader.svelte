<!--
 Copyright (c) 2023 Patsagorn Y.
 
 This software is released under the MIT License.
 https://opensource.org/licenses/MIT
-->
<script lang="ts">
	import { page } from '$app/stores';
	import { publicURL, signOut, uploadFile as uploadFileToFirebase } from '$lib/client/firebase';
	import {
		Button,
		DataTable,
		FileUploaderDropContainer,
		InlineLoading,
		OverflowMenu,
		OverflowMenuItem,
		TextArea,
		Toolbar,
		ToolbarContent,
		ToolbarMenu,
		ToolbarMenuItem,
		ToolbarSearch
	} from 'carbon-components-svelte';
	import CheckmarkOutline from 'carbon-icons-svelte/lib/CheckmarkOutline.svelte';
	import type { Files } from 'filedrop-svelte';
	import { files as filesStore, fileData } from '$lib/files';
	import { filesize } from 'filesize';
	import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
	import CloudUpload from 'carbon-icons-svelte/lib/CloudUpload.svelte';
	import { prevent_default } from 'svelte/internal';

	let fileInput: HTMLInputElement;
	let files: File[] = [];
	$filesStore.forEach((item, i) => {
		$fileData.push({
			id: i,
			name: item.name,
			size: item.size,
			type: item.type,
			file: item,
			isUploaded: false
		});
	});

	function appendFile() {
		if (!files) return;
		$fileData = [
			...$fileData,
			...files.map((file, i) => ({
				id: i,
				name: file.name,
				size: file.size,
				type: file.type,
				file,
				isUploaded: false
			}))
		];
	}

	function uploadFile() {
		if (!$fileData.length) return;
		console.log($fileData);
		$fileData.forEach((item) => {
			$fileData = $fileData.map((item) => {
				if (item.name === item.name) {
					return {
						...item,
						status: 'uploading'
					};
				}
				return item;
			});
			uploadFileToFirebase(item.name, item.file, {
				customMetadata: {
					'content-type': item.type,
					uploaded_by: $page.data.userSession?.name,
					uploaded_at: new Date().toISOString()
				}
			})
				.then((snapshot) => {
					console.log(snapshot);
					$fileData = $fileData.map((item) => {
						if (item.name === snapshot.metadata.name) {
							return {
								...item,
								status: 'uploaded',
								snapshot: snapshot
							};
						}
						return item;
					});
				})
				.catch((error) => {
					console.error(error);
				});
		});
	}
</script>

<FileUploaderDropContainer
	multiple
	labelText="Drag and drop files here or click to upload"
	ref={fileInput}
	bind:files
	on:change={appendFile}
	kind="primary"
/>

<DataTable
	headers={[
		{
			value: 'Status',
			key: 'status'
		},
		{
			value: 'Name',
			key: 'name'
		},
		{
			value: 'Size',
			key: 'size'
		},
		{
			value: 'Type',
			key: 'type'
		},
		{
			value: 'Action',
			key: 'action'
		}
	]}
	bind:rows={$fileData}
	sortable
>
	<Toolbar>
		<ToolbarContent>
			<ToolbarMenu>
				<ToolbarMenuItem primaryFocus>Reset</ToolbarMenuItem>
			</ToolbarMenu>
			<Button
				kind="danger"
				on:click={() => {
					$fileData = [];
				}}>Remove all</Button
			>
		</ToolbarContent>
	</Toolbar>
	<svelte:fragment slot="cell" let:rowIndex let:cell>
		{#if cell.key === 'action'}
			<div style:display="flex">
				<Button
					kind="danger"
					size="small"
					icon={TrashCan}
					iconDescription="Remove"
					on:click={() => {
						$fileData = $fileData.filter((item) => item.id !== rowIndex);
					}}
				/>
				<OverflowMenu flipped size="sm">
					<OverflowMenuItem text="Upload" />
					<OverflowMenuItem text="Download" />
				</OverflowMenu>
			</div>
		{:else if cell.key === 'id'}
			{cell.value + 1}
		{:else if cell.key === 'name'}
			<TextArea
				value={cell.value}
				rows={2}
				disabled={$fileData[rowIndex].status === 'uploaded' ||
					$fileData[rowIndex].status === 'uploading'}
				on:change={(e) => {
					let name = e.target?.value || cell.value;
					// check if name is a valid file name
					let validFileName = name.match(/^[^\\/:*?"<>|]+$/);
					if (!validFileName) {
						e.target?.setCustomValidity('Invalid file name');
						e.target?.reportValidity();
						e.target.value = cell.value;
						return;
					}
					$fileData[rowIndex].name = name;
				}}
			/>
		{:else if cell.key === 'size'}
			{filesize(cell.value)}
		{:else if cell.key === 'status'}
			{#if cell.value === 'uploaded'}
				<Button
					size="small"
					kind="ghost"
					on:click={async () => {
						let url = `https://file.ptsgrn.dev/${$fileData[rowIndex].name}`;
						navigator.clipboard.writeText(url);
					}}
					icon={CheckmarkOutline}
					iconDescription="Copy link to file"
				/>
			{:else if cell.value === 'uploading'}
				<InlineLoading status="active" description="Uploading file" />
			{/if}
		{:else}
			{cell.value}
		{/if}
	</svelte:fragment>
</DataTable>
<Button
	disabled={!$fileData.length || $fileData.some((item) => item.status === 'uploading')  || !$fileData.some((item) => !item.status)}
	kind="primary"
	icon={CloudUpload}
	on:click={uploadFile}>Upload</Button
>
