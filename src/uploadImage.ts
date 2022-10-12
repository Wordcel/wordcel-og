import S3 from 'aws-sdk/clients/s3';

const bucketName = 'og-image-generator-assets-ccc0160';

async function uploadImage(buffer: Buffer, s3key: string) {
  const s3 = new S3();
  const type = 'png';
  const params = {
    Bucket: bucketName,
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

export default uploadImage;