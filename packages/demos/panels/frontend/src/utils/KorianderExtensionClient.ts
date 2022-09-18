import {
  InvokeResult,
  InvokerOptions,
  PolywrapClientConfig,
  Uri,
} from "@polywrap/client-js";
import { msgpackDecode, msgpackEncode } from "@polywrap/msgpack-js";
import axios from "axios";

export class KorianderExtensionClient {
  constructor(
    config?: Partial<PolywrapClientConfig>
  ) {
  }

  public async invoke<
    TData = unknown,
    TUri extends string | Uri = string
  >(
    options: InvokerOptions<TUri, PolywrapClientConfig<string>>
  ): Promise<InvokeResult<TData>> {
    const result = await axios.post(`http://localhost:5137/client/invoke`, {
      uri: options.uri,
      method: options.method,
      args: [...msgpackEncode(options.args)],
    });

    return {
      data: msgpackDecode(new Uint8Array(result.data.data)),
      error: result.data.error ? new Error(result.data.error) : undefined,
    } as InvokeResult<TData>;
  }
}
