import { FIREBASE_SERVER_CONFIG } from '$env/static/private';
import type { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import admin from 'firebase-admin';

function initializeFirebase() {
	if (!admin.apps.length) {
		const serviceAccount = JSON.parse(FIREBASE_SERVER_CONFIG);
		admin.initializeApp({
			credential: admin.credential.cert(serviceAccount),
			databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
			storageBucket: `${serviceAccount.project_id}.appspot.com`
		});
	}
}

export async function decodeToken(token: string): Promise<DecodedIdToken | null> {
	if (!token || token === 'null' || token === 'undefined') return null;
	try {
		initializeFirebase();
		return await admin.auth().verifyIdToken(token);
	} catch (err) {
		return null;
	}
}

export async function getDocuments(collectionPath: string, uid: string): Promise<Array<Document>> {
	if (!uid) return [];
	initializeFirebase();
	const db = admin.firestore();
	const querySnapshot = await db.collection(collectionPath).where('uid', '==', uid).get();
	const list: Array<Document> = [];
	querySnapshot.forEach((doc) => {
		const document: Document = <Document>doc.data(); // Just need the data on the server
		document._id = doc.id;
		list.push(document);
	});
	return list;
}

export async function createDocument(collectionPath: string, uid: string): Promise<Document> {
	initializeFirebase();
	const db = admin.firestore();
	const doc = await (await db.collection(collectionPath).add({ uid })).get();

	const document = <Document>doc.data(); // Just need the data on the server
	document._id = doc.id;
	return document;
}

export async function getFileBuffer(filename: string): Promise<Buffer> {
	initializeFirebase();
	const bucket = admin.storage().bucket();
	const file = bucket.file(filename);
	const [buffer] = await file.download();
	return buffer;
}

export async function getFileMetadata(filename: string): Promise<admin.storage.FileMetadata> {
	initializeFirebase();
	const bucket = admin.storage().bucket();
	const file = bucket.file(filename);
	const [metadata] = await file.getMetadata();
	return metadata;
}
