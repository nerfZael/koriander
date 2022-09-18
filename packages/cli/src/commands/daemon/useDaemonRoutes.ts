import { Express } from "express";
import { PolywrapClient } from "@polywrap/client-js";
import { handleError } from "./handleError";
import { msgpackDecode, msgpackEncode } from "@polywrap/msgpack-js";

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
      args: msgpackDecode(new Uint8Array(args)) as any,
    });

    const sanitizedResult = {
      data: [...msgpackEncode(result.data)],
      error: result.error
        ? result.error.message
        : undefined
    };

    console.log(sanitizedResult);

    res.json(sanitizedResult);
  }));
};