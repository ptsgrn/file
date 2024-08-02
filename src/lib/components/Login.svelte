<!--
 Copyright (c) 2023 Patsagorn Y.
 
 This software is released under the MIT License.
 https://opensource.org/licenses/MIT
-->
<script lang="ts">
	import { page } from '$app/stores';
	import { isUnauthorized, isLoggingIn, signInWith, signOut } from '$lib/client/firebase';
	import Lock from 'carbon-pictograms-svelte/lib/Lock_01.svelte';
	import Unlock from 'carbon-pictograms-svelte/lib/Unlock_01.svelte';
	import DoNot from 'carbon-pictograms-svelte/lib/DoNot_02.svelte';
	import KeepYourOwnKey from 'carbon-pictograms-svelte/lib/KeepYourOwnKey.svelte';
	import { user } from '$lib/user';
</script>

<button
	data-action={$user ? 'logout' : 'login'}
	on:click={() => {
		if ($user) {
			signOut();
		} else {
			signInWith('google');
		}
	}}
>
	{#if $user}
		<span>{$user.displayName}</span><Unlock title="Logout" width="40px" />
	{:else if $user}
		<KeepYourOwnKey title="Logging in" width="150px" height="150px" />
	{:else if !$user && !$isUnauthorized}
		<Lock title="Login" width="150px" height="150px" />
	{:else if !$user && $isUnauthorized}
		<DoNot title="Not authorized" width="150px" height="150px" />
	{/if}
</button>

<style lang="scss">
	button {
		cursor: pointer;
		background: none;
		border: none;
		color: #ccc;

		&[data-action='login'] {
			display: flex;
			flex-direction: column;
			align-items: center;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);

			svg {
				width: 100px;
				height: 100px;
				fill: #ccc;
				transition: all 0.3s ease-in-out;
			}
		}

		&[data-action='logout'] {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: flex-end;
			gap: 10px;
			font-weight: 700;
			text-shadow: 1px 1px 10px #ccc, 3px 3px 10px #ccc, -2px -2px 10px #ccc;
			transition: all 0.3s ease-in-out;

			&:hover {
				text-shadow: 1px 1px 10px #c6ff0c, 3px 3px 10px #ff2f2f, -2px -2px 10px #3d4aff,
					-1px -1px 10px #ff0c61, -3px -3px 10px #01ff5e, 2px 2px 10px #cccccc;
			}
		}
	}
</style>
