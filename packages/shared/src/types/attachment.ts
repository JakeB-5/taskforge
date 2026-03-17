import type { Timestamps } from "./common";

export interface Attachment extends Timestamps {
  id: string;
  taskId: string;
  uploaderId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
}
