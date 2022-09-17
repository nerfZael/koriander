import { PolywrapRemoteHttpClient } from "polywrap-remote-http-client";

export const invoke = async (
  provider: string,
  uri: string,
  method: string,
  args: Record<string, unknown>
) => {
  const client = new PolywrapRemoteHttpClient(provider);
  
  const result = await client.invoke({ uri: uri, method: method, args: args });

  return result;
};
