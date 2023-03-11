<!--
 Copyright (c) 2023 Patsagorn Y.
 
 This software is released under the MIT License.
 https://opensource.org/licenses/MIT
-->
<script lang="ts">
	import 'carbon-components-svelte/css/g100.css';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { initializeFirebase } from '$lib/client/firebase';
	import { Content, ToastNotification } from 'carbon-components-svelte';
	import { files as filesStore, fileData } from '$lib/files';
	if (browser) {
		try {
			initializeFirebase({
				apiKey: 'AIzaSyAvJSdy51pvcFzbRzrkamJrdeNECVltmqM',
				authDomain: 'patsagonesite.firebaseapp.com',
				projectId: 'patsagonesite',
				storageBucket: 'patsagonesite.appspot.com',
				messagingSenderId: '908887098198',
				appId: '1:908887098198:web:75a1f07127287958d24cf7',
				measurementId: 'G-ZY168V3W1D'
			});
		} catch (ex) {
			console.error(ex);
		}
	}
	let files: File[] = [];
	function dropFiles({ dataTransfer }) {
		if (!dataTransfer.files) return;
		console.log(dataTransfer.files);
		files = [...dataTransfer.files];
		files.forEach((file) => {
			$fileData = [
				...$fileData,
				{
					id: $fileData.length,
					name: file.name,
					size: file.size,
					type: file.type,
					file,
					isUploaded: false
				}
			];
		});
	}
	let over = false;
</script>

<div
	on:drop
	on:drop|preventDefault={(e) => {
		over = false;
		dropFiles(e);
	}}
	on:dragover
	on:dragover|preventDefault={({ dataTransfer }) => {
		over = true;
		dataTransfer.dropEffect = 'copy';
	}}
	on:dragleave
	on:dragleave|preventDefault={({ dataTransfer }) => {
		over = false;
		dataTransfer.dropEffect = 'move';
	}}
	class="drop-file-dialog"
	data-dragover={over}
>
	<Content>
		<slot />
	</Content>
</div>

<style lang="scss">
	div {
		[data-isdragover] {
			background-color: #e0e0e0;
		}
		&.drop-file-dialog {
			&[data-dragover='true'] {
				&::before {
					content: 'Please drop your files here uWu';
					position: fixed;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					color: #ffffff;
					font-size: 1.5rem;
					font-weight: 600;
					text-align: center;
					pointer-events: none;
					z-index: 1;
					background-color: #e0e0e011;
					height: 100%;
					width: 100%;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					backdrop-filter: blur(10px);
					z-index: 5;
				}
			}
		}
	}
</style>
