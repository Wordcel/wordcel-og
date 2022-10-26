import S3 from 'aws-sdk/clients/s3';
import { S3_BUCKET_NAME } from './config';

const s3 = new S3();

async function getImage(s3key: string) {
  const params = {
    Bucket: S3_BUCKET_NAME,
    Key: s3key
  }
  try {
    await s3.headObject(params).promise();
    return true;
  } catch (error) {
    return false;
  }
}

async function uploadImage(buffer: Buffer, s3key: string) {
  const type = 'png';
  const params = {
    Bucket: S3_BUCKET_NAME,
    Key: `${s3key}.${type}`,
    Body: buffer,
    ACL: 'public-read',
    ContentEncoding: 'base64',
    ContentType: `image/${type}`,
    CacheControl: 'max-age=604800',
  };
  console.log('uploading image to s3', JSON.stringify(params.Key, null, 2));
  return s3.upload(params).promise();
}

export { uploadImage, getImage };