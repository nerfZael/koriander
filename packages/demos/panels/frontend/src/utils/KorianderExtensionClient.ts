import {
  InvokeResult,
  InvokerOptions,
  PolywrapClientConfig,
  Uri,
} from "@polywrap/client-js";
import { msgpackDecode } from "@polywrap/msgpack-js";

export class KorianderExtensionClient {
  public async invoke<
    TData = unknown,
    TUri extends string | Uri = string
  >(
    options: InvokerOptions<TUri, PolywrapClientConfig<string>>
  ): Promise<InvokeResult<TData>> {
    const result = await (window as any).koriander.invoke(options.uri, options.method, options.args);
    console.log("Result from Koriander:", result);
    return {
      data: result.data ? msgpackDecode(result.data) : undefined,
      error: result.error,
    } as InvokeResult<TData>;
  }
}
