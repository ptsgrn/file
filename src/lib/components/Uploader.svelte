<script lang="ts">
	import { page } from '$app/stores';
	import { DownloadURL, UploadTask, StorageList } from 'sveltefire';
	import {
		FileUploader,
		Button,
		ProgressBar,
		FileUploaderDropContainer,
		Toggle,
		Form
	} from 'carbon-components-svelte';
	import Copy from 'carbon-icons-svelte/lib/Copy.svelte';
	import { filesize } from 'filesize';
	import slugify from 'slugify';
	import { nanoid } from 'nanoid';
	import { StorageError, type StorageReference } from 'firebase/storage';
	import { toast } from 'svelte-sonner';

	let fileUploader: FileUploader;
	let files: File[] = [];
	let isFilenameScrumbled = false;

	function slugifyFilename(filename: string) {
		const ext = filename.split('.').pop();
		const filename_parts = filename.split('.').slice(0, -1).join('.');
		if (isFilenameScrumbled) {
			return nanoid(21) + '.' + ext;
		}
		return (
			slugify(filename_parts, { locale: 'en', lower: true, trim: true }) +
			'-' +
			nanoid(6) +
			'.' +
			ext
		);
	}

	async function copyPublicLink(ref: StorageReference | null) {
		if (!ref) return;
		const url = `${$page.url.origin}/${ref.name}`;
		navigator.clipboard.writeText(url);
		toast.success(`Public link copied to clipboard: ${ref.name}`);
	}
</script>

<FileUploaderDropContainer
	multiple
	labelText="Drag and drop files here or click to upload"
	bind:files
/>
<Toggle labelText="Scrumble file name" bind:value={isFilenameScrumbled} />

{#if files.length > 0}
	{#each files as file}
		{@const filename = slugifyFilename(file.name)}
		<UploadTask ref={`p/${filename}`} data={file} let:progress let:snapshot>
			<span
				id={filename}
				class:bx--file__selected-file={true}
				class:bx--file__selected-file--invalid={snapshot?.state === 'error'}
				class="bx--file__selected-file--md"
			>
				<p class:bx--file-filename={true}>
					{filename}
					<ProgressBar
						status={snapshot?.state === 'running'
							? 'active'
							: snapshot?.state === 'success'
								? 'finished'
								: snapshot?.state === 'error'
									? 'error'
									: undefined}
						value={progress}
						labelText={snapshot?.state}
						helperText={snapshot?.state === 'running'
							? `${progress.toFixed(2)}% uploaded`
							: snapshot?.state === 'success'
								? filename
								: '?'}
					/>
				</p>

				{#if snapshot?.state === 'error'}
					<div class:bx--form-requirement={true}>
						{#await snapshot.task.catch((error) => error) then err}
							{#if err instanceof StorageError}
								<div class:bx--form-requirement__title={true}>
									{err.name} (<code>{err.code}</code>)
								</div>
								<p class:bx--form-requirement__supplement={true}>{err.message}</p>
							{/if}
						{/await}
					</div>
				{/if}
				<p>
					{#if snapshot?.state === 'success'}
						<DownloadURL ref={snapshot.ref} let:link let:ref>
							<Button
								size="field"
								icon={Copy}
								kind="ghost"
								iconDescription="Copy public link to clipboard"
								on:click={() => copyPublicLink(ref)}
							/>
						</DownloadURL>
					{/if}
				</p>
			</span>
		</UploadTask>
	{/each}
{/if}
