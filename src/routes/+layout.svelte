<script lang="ts">
	import { FirebaseApp } from 'sveltefire';
	import { initializeApp } from 'firebase/app';
	import { getFirestore } from 'firebase/firestore';
	import { getAuth } from 'firebase/auth';
	import { getStorage } from 'firebase/storage';
	import { Content, Grid } from 'carbon-components-svelte';
	import 'carbon-components-svelte/css/g90.css';
	import '@fontsource/ibm-plex-sans-thai';
	import '$lib/app.css';
	import { Toaster } from 'svelte-sonner';

	const app = initializeApp({
		apiKey: 'AIzaSyAvJSdy51pvcFzbRzrkamJrdeNECVltmqM',
		authDomain: 'patsagonesite.firebaseapp.com',
		databaseURL: 'https://patsagonesite-default-rtdb.asia-southeast1.firebasedatabase.app',
		projectId: 'patsagonesite',
		storageBucket: 'patsagonesite.appspot.com',
		messagingSenderId: '908887098198',
		appId: '1:908887098198:web:dc476095ccdf1b0ed24cf7',
		measurementId: 'G-GJWDG2KKM2'
	});

	const firestore = getFirestore(app);
	const auth = getAuth(app);
	const storage = getStorage(app);
</script>

<Toaster />
<FirebaseApp {auth} {firestore} {storage}>
	<Content>
		<Grid>
			<slot />
		</Grid>
	</Content>
</FirebaseApp>
