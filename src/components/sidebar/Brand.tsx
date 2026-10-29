import { PanelLeft, Search } from "lucide-react";
import Logo from "../icons/Logo";
import { useLocale } from "../../context/LocaleContext";

interface Props {
  onToggleSidebar?: () => void;
  onSearch?: () => void;
}

const iconButton =
  "flex size-8 cursor-pointer items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white";

export default function Brand({ onToggleSidebar, onSearch }: Props) {
  const { t } = useLocale();
  const searchButton = (
    <button type="button" aria-label={t("searchChats")} className={iconButton} onClick={onSearch}>
      <Search className="size-[18px]" aria-hidden="true" />
    </button>
  );
  const closeButton = onToggleSidebar && (
    <button type="button" aria-label={t("closeSidebar")} className={iconButton} onClick={onToggleSidebar}>
      <PanelLeft className="size-[18px]" aria-hidden="true" />
    </button>
  );
  return (
    <div className="flex w-[232.75px] items-start justify-between">
      <a href="/" className="flex items-start gap-[10px] text-white" aria-label={`${t("brandName")} — ${t("workspace")}`}>
        <Logo className="h-[52px] w-[37px] shrink-0 text-white" />
        <span className="mt-[6px] flex flex-col">
          <span className="text-[25px] font-semibold leading-[30px] tracking-[0.012em]">{t("brandName")}</span>
          <span className="mt-[3.1px] whitespace-nowrap text-[14px] font-normal uppercase leading-[16px] tracking-[0.045em]">
            {t("workspace")}
          </span>
        </span>
      </a>
      <div className="mt-[2px] flex shrink-0 items-center rtl:translate-x-4">
        {searchButton}{closeButton}
      </div>
    </div>
  );
}
