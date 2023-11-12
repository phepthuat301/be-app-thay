import aws = require("aws-sdk");
import sharp from 'sharp';

export class AwsService {
    private static instance: AwsService;
    private constructor() { }

    static getInstance() {
        if (!this.instance) {
            this.instance = new AwsService();
        }
        return this.instance;
    }

    signS3 = async (fileName: string, imageBuffer: string) => {
        try {
            const s3 = new aws.S3({
                signatureVersion: 'v4',
            });
            const bufferData = Buffer.from(imageBuffer, 'base64');

            // Convert PNG image to JPEG
            const JPEGImage = await sharp(bufferData).jpeg().toBuffer();

            const s3Params: any = {
                Bucket: process.env.AWS_S3_BUCKET,
                Key: fileName,
                Body: JPEGImage,
                ContentType: 'image/jpeg',
                ACL: 'public-read',
                // ContentDisposition: `attachment; filename=${fileName}`
            };
            const uploadResult = await s3.putObject(s3Params).promise();
            if (!uploadResult) {
                throw new Error('Failed to upload image to S3');
            }

            const url = `${process.env.AWS_S3_ENDPOINT}/${fileName}`;
            return url;
        } catch (error: any) {
            console.log(error);
            throw new Error(error);
        }
    };
}
