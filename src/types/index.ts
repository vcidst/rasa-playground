
export type FileType = "flows" | "domain" | "config" | "endpoints";

export interface RasaFile {
  type: FileType;
  name: string;
  content: string;
}
