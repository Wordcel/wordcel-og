// @ts-expect-error
import { createConverter } from 'convert-svg-to-png';
import { ProfileOG } from './profile';
import { ArticleOG } from './article';
// @ts-expect-error
import imageDataURI from 'image-data-uri';
import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();

const converter = createConverter({
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

const convert = async (svg: string) => {
  const image = await converter.convert(svg)
  return image
}

app.get('/article/:title/:name/:image', async (req, res) => {
  if (!req.params.title || !req.params.name || !req.params.image) return
  try {
    const imageURLBuffer = Buffer.from(req.params.image, 'base64')
    const imageURL = imageURLBuffer.toString()
    const imageData = await imageDataURI.encodeFromURL(imageURL);
    const png = await convert(
      ArticleOG(req.params.title, req.params.name, imageData)
    );
    res.set('Content-Type', 'image/png');
    res.send(png);
  } catch (e) {
    console.error(e)
    res.set('Content-Type', 'image/png');
    const defaultOG = fs.readFileSync(path.join(__dirname, '..', 'static', 'meta.png'))
    res.send(defaultOG)
  }
})

app.get('/:name/:username/:bio/:image', async (req, res) => {
  if (!req.params.name || !req.params.username || !req.params.bio || !req.params.image) return
  try {
    const imageURLBuffer = Buffer.from(req.params.image, 'base64')
    const imageURL = imageURLBuffer.toString()
    const imageData = await imageDataURI.encodeFromURL(imageURL);
    const png = await convert(
      ProfileOG(req.params.name, req.params.username, req.params.bio, imageData)
    );
    res.set('Content-Type', 'image/png');
    res.send(png);
  } catch (e) {
    console.error(e)
    res.set('Content-Type', 'image/png');
    const defaultOG = fs.readFileSync(path.join(__dirname, '..', 'static', 'meta.png'))
    res.send(defaultOG)
  }
});

const port = process.env.PORT || 3000;

app.listen(process.env.PORT || port, () =>  {
  console.log('The server is running on', port)
});
