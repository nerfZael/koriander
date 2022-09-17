import { KorianderExtensionClient } from "./KorianderExtensionClient";

export const writeToFile = async (
  filePath: string,
  fileText: string
): Promise<void> => {
  const client = new KorianderExtensionClient();

  const result = await client.invoke({
    uri: `ens/fs.polywrap.eth`,
    method: "writeFile",
    args: {
      path: filePath,
      data: fileText,
    },
  });

  if (result.error) {
    alert(result.error);
    console.error(result.error);
  }
};
