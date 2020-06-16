import express from "express";
import * as bodyParser from "body-parser";
import path from 'path';
import videosRoutes from './routes/video-route';

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routerSetup();
    // this.mysqlSetup();
  }

  private config(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }

  private routerSetup() {
    const router: express.Router = express.Router()
    // placeholder route handler
    router.get('/', async (req: express.Request, res: express.Response) => {
      res.json({
        message: 'Hello World!'
      });
    });
    router.get('/WebRTC', async (req: express.Request, res: express.Response) => {
      res.sendFile(path.resolve("./src/test/index.html"));
    });
    this.app.use('/', router);
    this.app.use('/video', videosRoutes);
    // this.app.use('/auth', [authMiddleware], UserRouter)
  }

    // private mysqlSetup() {
    //     createConnection(config).then(connection => {
    //         console.log("Has connected to DB? ", connection.isConnected);
    //         let userRepository = connection.getRepository(User);
    // }).catch(error => console.log("TypeORM connection error: ", error));

}

export default new App().app;