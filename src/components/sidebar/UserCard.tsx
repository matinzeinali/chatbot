import avatar from "../../assets/avatar.jpg";
import { useLocale } from "../../context/LocaleContext";

interface Props {
  name: string;
  plan: string;
  onOpenSettings?: () => void;
}

export default function UserCard({ name, plan, onOpenSettings }: Props) {
  const { t } = useLocale();
  return (
    <button
      type="button"
      aria-label={t("settings")}
      title={t("settings")}
      onClick={onOpenSettings}
      className="flex h-12 w-[232.75px] cursor-pointer items-center rounded-xl text-start transition duration-200 hover:bg-white/[0.06] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
    >
      <img src={avatar} alt="" className="size-12 shrink-0 rounded-full object-cover" />
      <span className="-mt-[1.6px] ms-[11px] flex min-w-0 flex-1 flex-col self-start">
        <span className="truncate text-[21px] font-medium leading-[24px]">{name}</span>
        <span className="mt-[4.8px] text-[12.5px] leading-[14px] opacity-80">{plan}</span>
      </span>
    </button>
  );
}
