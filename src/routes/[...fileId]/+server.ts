// Copyright (c) 2023 Patsagorn Y.
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import type { RequestHandler } from './$types';
import { getImageBuffer, getImageMetadata } from '$lib/server/firebase';
import { error } from '@sveltejs/kit';

export const GET = (async ({ params, url }) => {
	const { fileId } = params;
	try {
		const fileBuffer = await getImageBuffer('p/' + fileId);
		const FileMetadata = await getImageMetadata('p/' + fileId);
		return new Response(fileBuffer, {
			headers: {
				'Content-Type': FileMetadata.contentType,
				'Cache-Control': 'max-age=31536000',
				'Content-Disposition': url.searchParams.get('download') ? 'attachment' : 'inline'
			}
		});
	} catch (err) {
		throw error(500, err.message);
	}
}) satisfies RequestHandler;
