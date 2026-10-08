import { File } from "expo-file-system";
import { EncodingType, StorageAccessFramework } from "expo-file-system/legacy";
import { Platform } from "react-native";
import { createPdf } from "react-native-pdf-from-image";
import { readAsStringAsync } from "expo-file-system/legacy";


interface WriteFileOptions {
  filename: string;
  mimeType: 'application/pdf' | 'text/csv' | 'text/plain' | 'image/jpeg';
  isLocalFilePath?: boolean;
}

export const writeFileExternallyAndroidOnly = async (
  data: string,
  { filename, mimeType, isLocalFilePath = false }: WriteFileOptions
): Promise<string> => {
  if (Platform.OS !== "android") {
    throw new Error("This function can only be run on Android Device!");
  }

  const permissions =
    await StorageAccessFramework.requestDirectoryPermissionsAsync();

  if (!permissions.granted) {
    throw new Error("Permission DENIED by user");
  }

  let dataToWrite = data;
  let writeOptions = {};

  if (isLocalFilePath) {
    dataToWrite = await readAsStringAsync(data, {
        encoding: EncodingType.Base64
    });
    writeOptions = { encoding: EncodingType.Base64 };
  }

  const externalFileUri = await StorageAccessFramework.createFileAsync(
    permissions.directoryUri,
    filename ?? `${Date.now()}`,
    mimeType,
  );

  await StorageAccessFramework.writeAsStringAsync(externalFileUri, dataToWrite, writeOptions);

  return externalFileUri;
};

export const convertImageToPDF = (
  imageUri: string,
  filename: string,
): string => {
  const cleanUri = imageUri.replace("file://", "");

  const pdfFile = createPdf({
    imagePaths: [cleanUri],
    name: filename,
  });

  return pdfFile.filePath;
};
