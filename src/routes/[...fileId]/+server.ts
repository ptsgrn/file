/* eslint-disable @typescript-eslint/ban-ts-comment */
// Copyright (c) 2023 Patsagorn Y.
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import type { RequestHandler } from './$types';
import { getFileBuffer, getFileMetadata } from '$lib/server/firebase';
import { error } from '@sveltejs/kit';
import { ImageManipulation, ImageManipulationError } from '$lib/server/getfile';

export const GET = (async ({ params, url }) => {
	const { fileId } = params;
	try {
		const fileMetadata = await getFileMetadata('p/' + fileId);
		const fileBuffer = await getFileBuffer('p/' + fileId);
		const image = new ImageManipulation(fileBuffer, fileMetadata.ContentType, url.searchParams);
		const manipulatedBuffer = await image.getBuffer();
		return new Response(manipulatedBuffer, {
			headers: {
				'Content-Type': fileMetadata.contentType,
				'Cache-Control': 'max-age=31536000',
				'Content-Disposition': url.searchParams.get('download') ? 'attachment' : 'inline'
			}
		});
	} catch (err: unknown) {
		if (err instanceof ImageManipulationError) throw error(400, err.message);
		// @ts-ignore
		if (err.code === 404) throw error(404, 'File not found');
		// @ts-ignore
		throw error(502, err.message);
	}
}) satisfies RequestHandler;
