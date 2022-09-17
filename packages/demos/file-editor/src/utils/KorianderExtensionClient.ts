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
    const result = await (window as any).koriander.invoke(options.uri, options.method, options.args);

    return {
      data: result.data.data,
      error: result.data.error ? new Error(result.data.error) : undefined,
    } as InvokeResult<TData>;
  }
}
