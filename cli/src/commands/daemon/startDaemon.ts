import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import http from "http";
import { handleError } from "./handleError";
import timeout from "connect-timeout";
import { PolywrapClient } from "@polywrap/client-js";
import { useDaemonRoutes } from "./useDaemonRoutes";

export const homepageMessage = "Koriander node daemon";

export const startDaemon = (port: number, requestTimeout: number, client: PolywrapClient): Promise<http.Server> => {
  const app = express();
  app.use(timeout(requestTimeout));
  app.use(express.json());

  app.all('*', handleError(async (req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    if (req.method === 'OPTIONS') {
      res.send(200);
    } else {
      console.log(`Request:  ${req.method} --- ${req.url}`);
      next();
    }
  }));

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.on('finish', () => {
      console.log(`Response: ${req.method} ${res.statusCode} ${req.url}`);
    });
    next();
  });

  app.use(cors({
    origin: "*",
  }));

  app.get('/', handleError(async (_: any, res: any) => {
    res.send(`<pre>${homepageMessage}</pre>`);
  }));

  useDaemonRoutes(app, client);

  const server = http.createServer({}, app);
  
  return new Promise<http.Server>((resolve, reject) => {
    server.listen(port, () => {
      console.log(`Koriander daemon running on port ${port}`);
      resolve(server);
    });
  });
};
