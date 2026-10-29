import type { ChatGroup } from "../../data/chats";
import ChatListItem from "./ChatListItem";
import type { ChatAction } from "./ChatItemMenu";
import { useLocale } from "../../context/LocaleContext";

interface Props {
  groups: ChatGroup[];
  activeId?: string;
  onSelect?: (id: string) => void;
  onAction?: (id: string, action: ChatAction) => void;
  emptyMessage?: string;
}

export default function ChatList({ groups, activeId, onSelect, onAction, emptyMessage }: Props) {
  const { t } = useLocale();
  return (
    <nav
      aria-label={t("history")}
      className="relative mt-[21.5px] min-h-0 flex-1 before:absolute before:bottom-0 before:left-0 before:top-2 before:w-px before:rounded-full before:bg-white/20 rtl:before:left-auto rtl:before:right-0"
    >
      <div data-chat-scroll className="thin-scroll chat-scroll h-full overflow-y-auto overflow-x-hidden">
      {groups.length === 0 ? (
        <p role="status" className="m-0 ps-[18px] pt-2 text-[13px] text-white/55">{emptyMessage}</p>
      ) : groups.map((group) => (
        <section key={group.id} className="mb-3" aria-labelledby={`group-${group.id}`}>
          <h2
            id={`group-${group.id}`}
            dir="auto"
            className="m-0 ps-[18px] pt-1 text-start text-[12px] font-medium leading-[24px] text-white/50"
          >
            {group.label}
          </h2>
          <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
            {group.chats.map((chat) => (
              <ChatListItem
                key={chat.id}
                id={chat.id}
                title={chat.title}
                pinned={group.id === "pinned"}
                archived={group.id === "archive"}
                active={chat.id === activeId}
                onSelect={() => onSelect?.(chat.id)}
                onAction={onAction}
              />
            ))}
          </ul>
        </section>
      ))}
      </div>
    </nav>
  );
}
