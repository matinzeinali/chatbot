import { FileText, X } from "lucide-react";
import { formatSize, isImage, type Attachment } from "../../data/messages";
import { useLocale } from "../../context/LocaleContext";

interface Props {
  attachment: Attachment;
  onRemove?: () => void;
}

// Thumbnail for images, name + size chip for PDFs. Shows a remove button when onRemove is given.
export default function AttachmentPreview({ attachment, onRemove }: Props) {
  const { t, locale } = useLocale();
  return (
    <div className="group relative shrink-0">
      {isImage(attachment) ? (
        <img
          src={attachment.url}
          alt={attachment.name}
          className="size-16 rounded-xl border border-white/15 object-cover"
        />
      ) : (
        <div className="flex h-16 w-[190px] items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-red-500/20 text-red-300">
            <FileText className="size-5" aria-hidden="true" />
          </span>
          <span className="min-w-0 text-start">
            <span dir="auto" className="block truncate text-[13px] font-medium text-white">{attachment.name}</span>
            <span className="block text-[12px] text-white/55">{t("pdf")} · {formatSize(attachment.size, locale)}</span>
          </span>
        </div>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={t("removeFile").replace("{name}", attachment.name)}
          className="absolute -right-1.5 -top-1.5 flex size-5 cursor-pointer items-center justify-center rounded-full bg-ink text-white ring-1 ring-white/30 transition hover:bg-white/30 rtl:-left-1.5 rtl:right-auto"
        >
          <X className="size-3" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
