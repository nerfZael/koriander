import {
  InvokeResult,
  InvokerOptions,
  PolywrapClient,
  PolywrapClientConfig,
  Uri,
} from "@polywrap/client-js";
import { msgpackEncode } from "@polywrap/msgpack-js";
import axios from "axios";

export class KorianderExtensionClient extends PolywrapClient {
  constructor(
    config?: Partial<PolywrapClientConfig>
  ) {
    super(config);
  }

  public override async invoke<
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
      data: result.data.data,
      error: result.data.error ? new Error(result.data.error) : undefined,
    } as InvokeResult<TData>;
  }
}
