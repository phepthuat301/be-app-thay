import { getAuth, sendEmailVerification, RecaptchaVerifier, PhoneAuthProvider, signInWithPhoneNumber } from 'firebase/auth';

import { User } from 'orm/entities/models/user';
import { FORGOT_PASSWORD_METHOD_ENUM } from 'share/enum';
import { AccountActionLogsService } from './account-action-log.service';

export class FirebaseService {
    private static instance: FirebaseService;

    private constructor() {
        // Initialize Firebase with your project config
        const firebaseConfig = {
            apiKey: 'AIzaSyAw3giIsy1mPio-8S7loY8KtVxOszNSfVA',
            authDomain: 'YOUR_AUTH_DOMAIN',
            projectId: 'YOUR_PROJECT_ID',
            storageBucket: 'YOUR_STORAGE_BUCKET',
            messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
            appId: 'YOUR_APP_ID',
        };

        firebase.initializeApp(firebaseConfig);
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new FirebaseService();
        }
        return this.instance;
    }

    const sendOTP = async (user: User, forgotMethod: FORGOT_PASSWORD_METHOD_ENUM) => {
        try {
            const auth = getAuth(); // Use getAuth to get the Auth instance

            const numberOfSentOTPToday = await AccountActionLogsService.getInstance().countAccActionLogsToday(
                user.id,
                'SEND_OTP',
                forgotMethod
            );

            if (numberOfSentOTPToday >= 3 && forgotMethod === FORGOT_PASSWORD_METHOD_ENUM.PHONE) {
                throw new Error('Bạn đã vượt quá giới hạn gửi OTP, vui lòng thử lại vào hôm sau.');
            }

            // Save account action send code logs
            await AccountActionLogsService.getInstance().createAccActionLogs(
                user.id,
                'SEND_OTP',
                'COMPLETED',
                forgotMethod
            );

            let targetIdentifier = '';

            if (forgotMethod === FORGOT_PASSWORD_METHOD_ENUM.PHONE) {
                // Send OTP to phone number
                targetIdentifier = user.phone; 
                const appVerifier = new RecaptchaVerifier(auth, 'recaptcha-container');
                const verificationId = await signInWithPhoneNumber(auth, targetIdentifier, appVerifier);
                // Handle OTP verification with verificationId
                console.log('Verification ID:', verificationId);
            } else if (forgotMethod === FORGOT_PASSWORD_METHOD_ENUM.EMAIL) {
                // Send OTP to email address
                targetIdentifier = user.email; // Replace with the actual user's email
                const settings = {
                    url: 'https://your-app-url.com', // Replace with your app's URL for email verification
                };
                await sendEmailVerification(auth.currentUser!, settings);
            } else {
                throw new Error('Invalid forgotMethod');
            }

            console.log('OTP sent successfully');
        } catch (error: any) {
            console.error(error);
            throw new Error('Error sending OTP');
        }
    };
}
