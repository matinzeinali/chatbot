export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  /** Object URL used for previews; lives as long as the attachment is displayed. */
  url: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  attachments?: Attachment[];
  /** Prompt used by the local response preview; real model output can replace this later. */
  previewPrompt?: string;
  previewGeneration?: number;
  replyToId?: string;
}

export const PLACEHOLDER_REPLY =
  "Thanks for your message! This is a placeholder response — connect a model API to get real answers.";

export const ACCEPTED_TYPES = ["application/pdf", "image/png", "image/jpeg", "image/gif", "image/webp"];
export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const MAX_ATTACHMENTS = 5;

export const isImage = (a: Pick<Attachment, "type">) => a.type.startsWith("image/");

export function formatSize(bytes: number, locale: "en" | "fa" = "en"): string {
  const formatter = new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US", { maximumFractionDigits: 1 });
  const unit = (english: string, persian: string) => locale === "fa" ? persian : english;
  if (bytes < 1024) return `${formatter.format(bytes)} ${unit("B", "بایت")}`;
  if (bytes < 1024 * 1024) return `${formatter.format(bytes / 1024)} ${unit("KB", "کیلوبایت")}`;
  return `${formatter.format(bytes / 1024 / 1024)} ${unit("MB", "مگابایت")}`;
}
