// Copyright (c) 2023 Patsagorn Y.
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import type { RequestHandler } from './$types';
import { redirect } from '@sveltejs/kit';

export const GET = (async ({ params, url }) => {
	const { payload } = params;
	// check if payload is base64
	if (!payload.match(/^[a-zA-Z0-9+/]*={0,2}$/)) throw redirect(301, '/');
	const decoded = Buffer.from(payload, 'base64').toString('utf-8');
	// redirect to decoded url
	throw redirect(302, decoded);
}) satisfies RequestHandler;
