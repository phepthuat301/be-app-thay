import { FORGOT_PASSWORD_METHOD_ENUM } from "share/enum";

export function detectEmailOrPhone(input: string): string {
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Regular expression for phone number validation
    const phoneRegex = /^\d{10}$/; // Assuming a 10-digit phone number format

    // Check if the input matches the email regex
    if (emailRegex.test(input)) {
        return FORGOT_PASSWORD_METHOD_ENUM.EMAIL;
    }

    // Check if the input matches the phone number regex
    if (phoneRegex.test(input)) {
        return FORGOT_PASSWORD_METHOD_ENUM.PHONE
    }
    return 'Not a valid email or phone number';
}