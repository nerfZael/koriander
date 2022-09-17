import { msgpackEncode } from "@polywrap/msgpack-js";
import axios from "axios";

export const invoke = async (
  provider: string,
  uri: string,
  method: string,
  args: Record<string, unknown>
) => {
  const result = await internalInvoke(provider, uri, method, args);

  return result;
};

const internalInvoke = async (
  provider: string,
  uri: string,
  method: string,
  args: Record<string, unknown>
) => {
  const result = await axios.post(`${provider}/client/invoke`, {
    uri: uri,
    method: method,
    args: [...msgpackEncode(args)],
  });
};
