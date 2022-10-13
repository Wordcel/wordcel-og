import sharp from 'sharp';
import { InviteOG } from './invite';
import { ProfileOG } from './profile';
import { ArticleOG } from './article';

// @ts-expect-error
import imageDataURI from 'image-data-uri';
import fs from 'fs';
import path from 'path';
import { uploadImage, getImage } from './s3';

const convert = async (svg: string) => {
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return png;
}

process.env.FONTCONFIG_PATH = '/var/task/fonts';

export const lambdaHandler = async (event: any, context: any, callback: any) => {

  const request = event.Records[0].cf.request;
  const response = event.Records[0].cf.response;

  const headers = response.headers;

  //Set new headers
  headers['strict-transport-security'] = [{key: 'Strict-Transport-Security', value: 'max-age= 63072000; includeSubdomains; preload'}];
  headers['content-security-policy'] = [{key: 'Content-Security-Policy', value: "default-src 'none'; img-src 'self'; script-src 'self'; style-src 'self'; object-src 'none'"}];
  headers['x-content-type-options'] = [{key: 'X-Content-Type-Options', value: 'nosniff'}];
  headers['x-frame-options'] = [{key: 'X-Frame-Options', value: 'DENY'}];
  headers['x-xss-protection'] = [{key: 'X-XSS-Protection', value: '1; mode=block'}];
  headers['referrer-policy'] = [{key: 'Referrer-Policy', value: 'same-origin'}];
  response.headers = headers;
  response.headers['content-type'] = [{ key: 'Content-Type', value: 'image/png' }];

  // Set the response status code and bodyEncoding
  response.status = '200';
  response.statusDescription = 'OK';
  response.bodyEncoding = 'base64';

  const uri = request.uri;
  const method = request.method;
  const s3String = uri.slice(1);

  const exists = await getImage(s3String);
  if (exists) callback(null, response);

  // Split the uri and get the last part
  const uriParts = uri.split('/');
  const lastUriPart = uriParts[uriParts.length - 1];

  console.log('Event: ', JSON.stringify(event, null, 2));
  console.log('uri', uri);
  console.log('method', method);
  console.log('lastUriPart', lastUriPart);

  if (uriParts[1] === 'article') {
    const base64Data = decodeURIComponent(lastUriPart);
    const dataString = Buffer.from(base64Data, 'base64').toString();
    console.log('dataString', dataString);
    try {
      const data = JSON.parse(dataString);
      if (!data.title || !data.name || !data.image) return
      const imageData = await imageDataURI.encodeFromURL(data.image);
      const png = await convert(
        ArticleOG(data.title, data.name, imageData)
      );
      try {
        await uploadImage(png, uri.slice(1));
      } catch (e) {
        console.error(e);
      }
      // set the response body to the image
      response.body = png.toString('base64');

    } catch (e) {
      console.error(e)
      const defaultOG = fs.readFileSync(path.join('static', 'meta.png'))
      response.body = defaultOG.toString('base64');
    }
  }

  if (uriParts[1] === 'user') {
    const base64Data = decodeURIComponent(lastUriPart);
    const dataString = Buffer.from(base64Data, 'base64').toString();
    try {
      const data = JSON.parse(dataString);
      if (!data.name || !data.username || !data.bio || !data.image) return
      const imageData = await imageDataURI.encodeFromURL(data.image);
      const png = await convert(
        ProfileOG(data.name, data.username, data.bio, imageData)
      );
      try {
        await uploadImage(png, uri.slice(1));
      } catch (e) {
        console.error(e);
      }
      response.body = png.toString('base64');
    } catch (e) {
      console.error(e)
      const defaultOG = fs.readFileSync(path.join(__dirname, '..', 'static', 'meta.png'))
      response.body = defaultOG.toString('base64');
    }
  }

  if (uriParts[1] === 'invite') {
    try {
      const name = decodeURIComponent(lastUriPart);
      const png = await convert(
        InviteOG(name)
      );
      console.log('uploading image to s3', JSON.stringify(name, null, 2));
      try {
        await uploadImage(png, uri.slice(1));
      } catch (e) {
        console.error(e);
      }

      response.body = png.toString('base64');
    } catch (e) {
      console.error(e)
      const defaultOG = fs.readFileSync(path.join(__dirname, '..', 'static', 'meta.png'))
      response.body = defaultOG.toString('base64');
    }
  }
  callback(null, response);
}