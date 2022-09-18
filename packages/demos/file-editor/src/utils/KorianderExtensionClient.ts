import {
  InvokeResult,
  InvokerOptions,
  PolywrapClient,
  PolywrapClientConfig,
  Uri,
} from "@polywrap/client-js";

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
    console.log("Result from Koriander:", result);
    return {
      data: result.data,
      error: result.error ? new Error(result.error) : undefined,
    } as InvokeResult<TData>;
  }
}
