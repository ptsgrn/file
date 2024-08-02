import { error, json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
  getStorage
} from 'firebase-admin/storage';
import { initializeFirebase } from '$lib/server/firebase';
import { BUCKET_NAME } from '$env/static/private';

const app = initializeFirebase()

export async function GET({ params }) {
  const { filename } = params
  if (!filename) { 
    error(400, 'filename is required')
  }
  const bucket = getStorage(app).bucket(BUCKET_NAME)
  const file = bucket.file(`p/${filename}`)
  const [url] = await file.getSignedUrl({
    action: 'read',
    expires: Date.now() + 1000 * 60 * 60 * 24
  })
  redirect(303, url)
}