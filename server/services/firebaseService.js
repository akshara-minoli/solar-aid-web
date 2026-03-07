import admin from 'firebase-admin';

/**
 * Send a push notification to a specific device token
 */
export const sendPushNotification = async (token, title, body, data = {}) => {
    try {
        if (!admin.apps.length) {
            console.warn('⚠️ Firebase not initialized. Skipping push notification.');
            return;
        }

        const message = {
            notification: {
                title,
                body,
            },
            token,
            data,
        };

        const response = await admin.messaging().send(message);
        console.log('✅ Push notification sent successfully:', response);
        return response;
    } catch (error) {
        console.error('❌ Error sending push notification:', error.message);
        // don't throw, just log
    }
};

/**
 * Send a notification to multiple tokens
 */
export const sendMulticastNotification = async (tokens, title, body, data = {}) => {
    try {
        if (!admin.apps.length || !tokens || tokens.length === 0) {
            return;
        }

        const message = {
            notification: {
                title,
                body,
            },
            tokens,
            data,
        };

        const response = await admin.messaging().sendEachForMulticast(message);
        console.log(`✅ Sent ${response.successCount} push notifications`);
        return response;
    } catch (error) {
        console.error('❌ Error sending multicast notification:', error.message);
    }
};
