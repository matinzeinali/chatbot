import { SquarePen } from "lucide-react";
import { useLocale } from "../../context/LocaleContext";

interface Props {
  onClick?: () => void;
}

export default function NewChatButton({ onClick }: Props) {
  const { t } = useLocale();
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[40px] w-[232.75px] cursor-pointer items-center gap-3 rounded-xl px-3 text-start text-[16px] font-medium text-white transition duration-200 hover:bg-white/10 active:scale-[0.98]"
    >
      <SquarePen className="size-5 shrink-0" strokeWidth={1.6} aria-hidden="true" />
      {t("newChat")}
    </button>
  );
}
