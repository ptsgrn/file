<!--
 Copyright (c) 2023 Patsagorn Y.
 
 This software is released under the MIT License.
 https://opensource.org/licenses/MIT
-->
<script lang="ts">
	import Login from '$lib/components/Login.svelte';
	import { page } from '$app/stores';
	import Uploader from '$lib/components/Uploader.svelte';
	import { signOut } from '$lib/client/firebase';
	import { Column, Grid, Row } from 'carbon-components-svelte';
</script>

<svelte:head>
	<title>FILE</title>
	<!-- no google and other bot index -->
	<meta name="robots" content="noindex" />
</svelte:head>

<!-- <button on:click|preventDefault={signOut}>Logout</button> -->
<Grid>
	<Row>
		<Column>
			<Login />
		</Column>
	</Row>
	<Row>
		<Column>
			{#if $page.data.userSession?.name}
				<Uploader />
			{/if}
		</Column>
	</Row>
</Grid>
