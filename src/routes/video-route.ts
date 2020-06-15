
import { Router } from "express";
import fs from 'fs';
import path from 'path';
const videosRouter = Router();

videosRouter.get('/', async (req: any, res: any) => {
    res.send('video route test ok!');
})

videosRouter.get('/p2p/test', async (req: any, res: any) => {
    res.sendFile(path.resolve("./src/test/index.html"));
});

videosRouter.get('/:videoId', async (req: any, res: any) => {
    try {
        const filePath = path.join(__dirname, `../videos/${req.params.videoId}.mp4`);
        const stat = fs.statSync(filePath);
        const fileSize = stat.size
        const range = req.headers.range

        if (range) {

            const parts = range.replace(/bytes=/, "").split("-");

            const start = parseInt(parts[0], 10);
            const end = parts[1]
                ? parseInt(parts[1], 10)
                : fileSize - 1

            // console.log('start:',start,'end:',end);

            const chunksize = (end - start) + 1
            const file = fs.createReadStream(filePath, { start, end })

            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            }

            // console.log('head:',head);

            res.writeHead(206, head)
            file.pipe(res)
        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
            }
            res.writeHead(200, head)
            fs.createReadStream(filePath).pipe(res)
        }
    }
    catch (e) {
        console.error(e);
        res.status(404).send(`Video not found!`);
    }
});

export default videosRouter;