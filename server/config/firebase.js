import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const initializeFirebase = () => {
    try {
        if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_CLIENT_EMAIL) {
            console.warn('⚠️ Firebase credentials missing. Push notifications will be disabled.');
            return null;
        }

        // Handle the private key newline issues commonly found in .env files
        const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                privateKey: privateKey,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            }),
        });

        console.log('✅ Firebase Admin SDK initialized successfully');
        return admin;
    } catch (error) {
        console.error('❌ Firebase initialization error:', error.message);
        return null;
    }
};

export default initializeFirebase;
