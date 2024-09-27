import type { RequestHandler } from './$types';
import { initializeFirebase } from '$lib/server/firebase';
import { getDownloadURL, getStorage } from 'firebase-admin/storage';
import { json, redirect } from '@sveltejs/kit';
import { RateLimiter } from 'sveltekit-rate-limiter/server';
import { error } from '@sveltejs/kit';
import { AppErrorCodes } from 'firebase-admin/app';

const app = initializeFirebase();

export const GET: RequestHandler = async ({ params, locals }) => {
	const ref = params.ref;
	const signedDownloadUrl = await getStorage(app)
		.bucket('patsagonesite.appspot.com')
		.file(`p/${ref}`)
		.getSignedUrl({
			action: 'read',
			expires: Date.now() + 1000 * 60 * 60 * 1 // 1 hour
		});
	return redirect(302, signedDownloadUrl[0]);
};
