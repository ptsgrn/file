// Copyright (c) 2023 Patsagorn Y.
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import type { Handle } from '@sveltejs/kit';
import { decodeToken } from '$lib/server/firebase';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('token') || '';
	const decodedToken = await decodeToken(token);
	if (decodedToken) {
		const { uid, name, email } = decodedToken;
		event.locals.userSession = { uid, name, email: email ?? '' };
	}

	const response = await resolve(event);

	return response;
};
