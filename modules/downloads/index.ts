import { requireNativeModule } from 'expo';

type DownloadsModule = {
  saveText(name: string, mimeType: string, content: string): Promise<string | null>;
};

const Downloads = requireNativeModule<DownloadsModule>('Downloads');

export function saveTextToDownloads(
  name: string,
  mimeType: string,
  content: string
): Promise<string | null> {
  return Downloads.saveText(name, mimeType, content);
}
