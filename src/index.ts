// @ts-ignore
const { createConverter } = require('convert-svg-to-png');
const { OgSVG } = require('./svg');
const imageDataURI = require('image-data-uri');
const express = require('express')
const fs = require('fs')
const path = require('path')

const app = express();

const converter = createConverter({
    puppeteer: { args: ['--no-sandbox'] }
});

const convert = async (svg: string) => {
    const image = await converter.convert(svg)
    return image
}

app.get('/:name/:link/:image', async (req: any, res: any) => {
    if (!req.params.name || !req.params.link || !req.params.image) return
    try {
        const imageURLBuffer = Buffer.from(req.params.image, 'base64')
        const imageURL = imageURLBuffer.toString()
        const imageData = await imageDataURI.encodeFromURL(imageURL);
        const png = await convert(
            OgSVG(req.params.name, req.params.link, imageData)
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

app.get('/random/gradient', async (req: any, res: any) => {
	try {
		const directory = path.join(__dirname, '..', 'static', 'random-gradients')
		const files = fs.readdirSync(directory)
		const randomFile = files[Math.floor(Math.random() * files.length)]
		const randomGradient = fs.readFileSync(path.join(directory, randomFile))
		res.set('Content-Type', 'image/png');
		res.send(randomGradient);
	} catch (e) {
		console.error(e)
		res.status(500).send(e);
	}
})

const port = process.env.PORT || 3000;

app.listen(process.env.PORT || port, () =>  {
    console.log('The server is running on', port)
})