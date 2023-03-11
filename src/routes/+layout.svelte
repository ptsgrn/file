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

<svelte:head>
	<!-- no google and other bot index -->
	<meta name="robots" content="noindex" />
	<!-- other social -->
	<meta name="og:image" content="/file-social-preview.jpg?cover=1200,630" />
	<meta name="og:title" content="📁 FILE" />
	<meta name="og:description" content="FILE? File file, file file FIRE!" />
	<meta name="og:url" content="https://file.ptsgrn.dev" />
	<meta name="og:site_name" content="Patsagorn's File" />
	<meta name="og:type" content="website" />
	<meta name="og:locale" content="en_US" />
	<meta name="og:locale:alternate" content="th_TH" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@ptsgrn" />
	<meta name="twitter:creator" content="@ptsgrn" />
	<meta name="twitter:title" content="📁 FILE" />
	<meta name="twitter:description" content="FILE? File file, file file FIRE!" />
	<meta name="twitter:image" content="/file-social-preview.jpg?cover=1200,630" />
	<meta name="twitter:image:alt" content="FILE? File file, file file FIRE!" />
	<meta name="twitter:image:width" content="1200" />
	<meta name="twitter:image:height" content="630" />
	<meta name="twitter:domain" content="file.ptsgrn.dev" />

	<!-- PWA spec -->
	<link rel="manifest" href="/manifest.json" />
	<meta name="theme-color" content="#161616" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
	<meta name="apple-mobile-web-app-title" content="FILE" />
	<link rel="apple-touch-icon" href="/file-icons.png?contain=192,192" />
	<link rel="apple-touch-startup-image" href="/file-icons.png?contain=192,192" />
	<meta name="msapplication-TileImage" content="/file-icons.png?contain=192,192" />
	<meta name="msapplication-TileColor" content="#161616" />
	<meta name="msapplication-config" content="none"/>
	<meta name="application-name" content="FILE" />
	<meta name="msapplication-tooltip" content="FILE? File file, file file FIRE!" />
	<meta name="msapplication-starturl" content="/" />
	<meta name="msapplication-navbutton-color" content="#161616" />
	<meta name="msapplication-TileImage" content="/file-icons.png?contain=192,192" />
	<meta name="msapplication-TileColor" content="#161616" />
	<meta name="msapplication-square70x70logo" content="/file-icons.png?contain=70,70" />
	<meta name="msapplication-square150x150logo" content="/file-icons.png?contain=150,150" />
	<meta name="msapplication-wide310x150logo" content="/file-icons.png?contain=310,150" />
	<meta name="msapplication-square310x310logo" content="/file-icons.png?contain=310,310" />
</svelte:head>

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
