import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Validate required environment variables at module load time
function validateEnv() {
  const required = ['AWS_REGION', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_S3_BUCKET'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required AWS environment variables: ${missing.join(', ')}\n` +
      `Please set these in your .env.local file`
    );
  }
}

validateEnv();

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET!;

export interface PresignedUrlResponse {
  uploadUrl: string;
  imageUrl: string;
  key: string;
}

// Validate file before uploading
function validateFile(filename: string, contentType: string) {
  const maxSizeMB = 50;
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  
  if (!allowedMimes.includes(contentType)) {
    throw new Error(
      `Invalid file type: ${contentType}\n` +
      `Allowed: ${allowedMimes.join(', ')}`
    );
  }
  
  const ext = filename.split('.').pop()?.toLowerCase();
  const allowedExts = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
  
  if (!ext || !allowedExts.includes(ext)) {
    throw new Error(
      `Invalid file extension: ${ext}\n` +
      `Allowed: ${allowedExts.join(', ')}`
    );
  }
}

export async function generatePresignedUploadUrl(
  userId: string,
  filename: string,
  contentType: string
): Promise<PresignedUrlResponse> {
  validateFile(filename, contentType);
  
  const timestamp = Date.now();
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
  const key = `uploads/${userId}/${timestamp}-${sanitizedFilename}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 300, // 5 minutes
  });

  const imageUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

  return {
    uploadUrl,
    imageUrl,
    key,
  };
}

export async function deleteS3Object(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
}

/**
 * Extract S3 key from a full S3 URL
 * URL format: https://{bucket}.s3.{region}.amazonaws.com/{key}
 */
export function extractS3KeyFromUrl(imageUrl: string): string | null {
  try {
    const url = new URL(imageUrl);
    // The key is the pathname without the leading slash
    const key = url.pathname.slice(1);
    return key || null;
  } catch {
    return null;
  }
}

export { s3Client, BUCKET_NAME };
