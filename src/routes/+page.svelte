<script>
	import { SignedIn, SignedOut } from 'sveltefire';
	import { Row, Column, Button } from 'carbon-components-svelte';
	import { signInWithPopup } from 'firebase/auth';
	import { authProvider } from '$lib/client/auth';
	import Locked from 'carbon-icons-svelte/lib/Locked.svelte';
	import GameOfLife from '$lib/components/GameOfLife.svelte';
	import Uploader from '$lib/components/Uploader.svelte';
	import Logout from 'carbon-icons-svelte/lib/Logout.svelte';
	import FilesLists from '$lib/components/FilesLists.svelte';
</script>

<svelte:head>
	<title>PTSGRN Files</title>
</svelte:head>

<SignedIn let:signOut let:user>
	<Row>
		<Column>
			<Button icon={Logout} kind="danger-ghost" on:click={signOut}>Sign Out</Button>
			<Uploader />
		</Column>
		<FilesLists />
	</Row>
</SignedIn>

<SignedOut let:auth>
	<Row class="middle">
		<Column>
			<div class="content-block">
				<h1 class="headerTitle">PTSGRN's Files</h1>
				<p>
					<strong class="subtitle">Welcome to PTSGRN's Files!</strong> Actually I made it for my own
					use and you didn't supposed to be here bruh.
				</p>
			</div>
		</Column>
		<Column>
			<div class="content-block">
				<Button icon={Locked} on:click={() => signInWithPopup(auth, authProvider)}>Sign In</Button>
			</div>
		</Column>
	</Row>
</SignedOut>

<GameOfLife />

<style>
	:global(.headerTitle) {
		font-weight: bold;
		margin-bottom: 1rem;
	}
	:global(.middle) {
		display: flex;
		place-items: center;
		justify-content: center;
		align-items: center;
	}
	.subtitle {
		margin-bottom: 2rem;
	}
	.content-block {
		margin-bottom: 1rem;
		border: 0.3rem solid rgba(2, 255, 255, 1);
		padding: 1.5rem;
		background-color: #262626;
	}
</style>
