import sharp from 'sharp';
import { InviteOG } from './invite';
import { ProfileOG } from './profile';
import { ArticleOG } from './article';
// @ts-expect-error
import imageDataURI from 'image-data-uri';
import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();

const convert = async (svg: string) => {
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return png;
}

app.get('/article/:data', async (req, res) => {
  const base64Data = decodeURIComponent(req.params.data);
  const dataString = Buffer.from(base64Data, 'base64').toString();
  try {
    const data = JSON.parse(dataString);
    if (!data.title || !data.name || !data.image) return
    const imageData = await imageDataURI.encodeFromURL(data.image);
    const png = await convert(
      ArticleOG(data.title, data.name, imageData)
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

app.get('/user/:data', async (req, res) => {
  const base64Data = decodeURIComponent(req.params.data);
  const dataString = Buffer.from(base64Data, 'base64').toString();
  try {
    const data = JSON.parse(dataString);
    if (!data.name || !data.username || !data.bio || !data.image) return
    const imageData = await imageDataURI.encodeFromURL(data.image);
    const png = await convert(
      ProfileOG(data.name, data.username, data.bio, imageData)
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

app.get('/invite/:name', async (req, res) => {
  try {
    const name = req.params.name;
    const png = await convert(
      InviteOG(name)
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
