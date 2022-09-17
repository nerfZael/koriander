import { Express } from "express";
import { PolywrapClient } from "@polywrap/client-js";
import { handleError } from "./handleError";

export const useDaemonRoutes = (app: Express, client: PolywrapClient) => {
  app.post('/client/invoke', handleError(async (req, res) => {
    const { uri, method, args } = req.body;

    console.log("/client/invoke", {
      uri,
      method,
      args
    });

    const result = await client.invoke({
      uri,
      method,
      args
    });

    const sanitizedResult = {
      data: result.data,
      error: result.error
        ? result.error.message
        : undefined
    };

    console.log(sanitizedResult);

    res.json(sanitizedResult);
  }));
};