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
		return app;
	}
}
