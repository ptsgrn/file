import { FIREBASE_SERVER_CONFIG } from '$env/static/private';
import admin from 'firebase-admin';

export function initializeFirebase() {
	if (admin.apps && admin.apps.length) {
		return admin.apps[0] as admin.app.App;
	} else {
		const serviceAccount = JSON.parse(FIREBASE_SERVER_CONFIG);
		const app = admin.initializeApp({
			credential: admin.credential.cert(serviceAccount),
			databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
		});
		return app
	}
}

export async function decodeToken(token: string) {
	if (!token || token === 'null' || token === 'undefined') return null;
	try {
		const app = initializeFirebase();
		return await app.auth().verifyIdToken(token);
	} catch (err) {
		return null;
	}
}

export async function getDocuments(collectionPath: string, uid: string) {
	if (!uid) return [];
	const app = initializeFirebase();
	const db = app.firestore();
	const querySnapshot = await db.collection(collectionPath).where('uid', '==', uid).get();
	const list: Array<Document> = [];
	querySnapshot.forEach((doc) => {
		const document: Document = <Document>doc.data(); // Just need the data on the server
		document._id = doc.id;
		list.push(document);
	});
	return list;
}

export async function createDocument(collectionPath: string, uid: string) {
	const app = initializeFirebase();
	const db = app.firestore();
	const doc = await (await db.collection(collectionPath).add({ uid })).get();

	const document = doc.data()!; // Just need the data on the server
	document._id = doc.id;
	return document;
}
