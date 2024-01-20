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

export function stripBase64Prefix(image: string) {
    const prefixes = ['data:image/png;base64,', 'data:image/jpeg;base64,', 'data:image/webp;base64,'];

    for (const prefix of prefixes) {
        if (image.startsWith(prefix)) {
            return image.replace(prefix, '');
        }
    }

    // If no matching prefix is found, return the original string
    return image;
}

export const isBase64Image = (data: string): boolean => {
    const regex = /^data:image\/(png|jpeg|webp);base64,/;
    return regex.test(data);
};