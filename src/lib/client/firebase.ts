import type { FirebaseApp, FirebaseOptions } from 'firebase/app';
import {
	GoogleAuthProvider,
	signOut as _signOut,
	getAuth,
	onIdTokenChanged,
	signInWithPopup
} from 'firebase/auth';
import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytes,
	listAll,
	type UploadMetadata
} from 'firebase/storage';

import type { FirebaseStorage } from 'firebase/storage';
import { browser } from '$app/environment';
import { initializeApp } from 'firebase/app';
import { invalidateAll } from '$app/navigation';
import { writable } from 'svelte/store';

export const isUnauthorized = writable(false);
export const isLoggingIn = writable(false);
async function setToken(token: string) {
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body: JSON.stringify({ token })
	};

	await fetch('/api/token', options);
}

function listenForAuthChanges() {
	const auth = getAuth(app);

	onIdTokenChanged(
		auth,
		async (user) => {
			if (user) {
				const token = await user.getIdToken();
				await setToken(token);
			} else {
				await setToken('');
			}
			await invalidateAll();
		},
		(err) => console.error('hi', err.message)
	);
}

export let app: FirebaseApp;
export let storage: FirebaseStorage;

export function initializeFirebase(options: FirebaseOptions) {
	if (!browser) {
		throw new Error("Can't use the Firebase client on the server.");
	}
	if (!app) {
		app = initializeApp(options);
		listenForAuthChanges();
	}
	if (!storage) {
		storage = getStorage(app);
	}
}

function providerFor(name: string) {
	switch (name) {
		case 'google':
			return new GoogleAuthProvider();
		default:
			throw 'unknown provider ' + name;
	}
}

function handleAuthError(err: Error) {
	console.error(err);
	isUnauthorized.set(true);
	isLoggingIn.set(false);
}

export async function signInWith(name: string) {
	isUnauthorized.set(false);
	isLoggingIn.set(true);
	const auth = getAuth(app);
	const provider = providerFor(name);
	await signInWithPopup(auth, provider)
		.catch(handleAuthError)
		.then(() => {
			isLoggingIn.set(false);
		});
}

export async function signOut() {
	const auth = getAuth(app);
	await _signOut(auth);
}

export async function fileRef(filename: string) {
	return ref(storage, `p/${filename}`);
}

export async function uploadFile(filename: string, file: File, metadata: UploadMetadata = {}) {
	return await uploadBytes(await fileRef(filename), file, metadata);
}

export async function publicURL(filename: string) {
	const ref = await fileRef(filename);
	return await getDownloadURL(ref);
}

export async function getAllImagesInRef() {
	const listRef = ref(storage, 'p/');
	const list = await listAll(listRef);
	return list.items;
}
