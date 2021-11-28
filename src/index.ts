// @ts-ignore
const { convert } = require('convert-svg-to-png');
const { OgSVG } = require('./svg');
const imageDataURI = require('image-data-uri');
const express = require('express')

const app = express();

app.get('/', async (req: any, res: any) => {
    if (!req.query.name || !req.query.link || !req.query.image) return
    try {
        const imageData = await imageDataURI.encodeFromURL(req.query.image);
        const png = await convert(
            OgSVG(req.query.name, req.query.link, imageData)
        );
        res.set('Content-Type', 'image/png');
        res.send(png);
    } catch (e) {
        console.error(e)
        res.status(500).send(e);
    }
});

app.listen(process.env.PORT || 3000, () =>  {
    console.log('The server is running')
})