import { useState } from "react";
import ChatBubbleIcon from "../icons/ChatBubbleIcon";
import ChatItemMenu, { type ChatAction } from "./ChatItemMenu";

interface Props {
  title: string;
  id: string;
  pinned?: boolean;
  archived?: boolean;
  active?: boolean;
  onSelect?: () => void;
  onAction?: (id: string, action: ChatAction) => void;
}

export default function ChatListItem({ id, title, pinned, archived, active, onSelect, onAction }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <li
      className={`group relative ms-2 flex h-[39px] w-[224.75px] items-center rounded-xl ps-[6px] transition-colors duration-200 hover:bg-white/10 has-[:focus-visible]:bg-white/10 ${
        active || menuOpen ? "bg-white/[0.14]" : ""
      } ${menuOpen ? "z-20" : ""}`}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-current={active ? "page" : undefined}
        className="flex min-w-0 flex-1 cursor-pointer items-center gap-[9.7px] rounded-lg text-start outline-none text-[14px] font-medium text-white/70 transition-colors duration-200 hover:text-white group-hover:text-white aria-[current=page]:text-white"
      >
        <ChatBubbleIcon className="h-[18px] w-[19.5px] shrink-0" />
        <span dir="auto" className="min-w-0 flex-1 truncate text-start">
          {title}
        </span>
      </button>
      <ChatItemMenu title={title} pinned={pinned} archived={archived} onAction={(action) => onAction?.(id, action)} onOpenChange={setMenuOpen} />
    </li>
  );
}
