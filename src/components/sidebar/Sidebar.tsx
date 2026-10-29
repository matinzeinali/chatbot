import { useMemo, useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import { Search, X } from "lucide-react";
import { chatGroups, user, type ChatGroup } from "../../data/chats";
import Brand from "./Brand";
import ChatList from "./ChatList";
import NewChatButton from "./NewChatButton";
import UserCard from "./UserCard";
import type { ChatAction } from "./ChatItemMenu";
import { useLocale } from "../../context/LocaleContext";

interface Props {
  activeId?: string;
  onSelect?: (id: string) => void;
  onNewChat?: () => void;
  onToggleSidebar?: () => void;
  onOpenSettings?: () => void;
  groups?: ChatGroup[];
  onChatAction?: (id: string, action: ChatAction) => void;
  name?: string;
}

export default function Sidebar({
  activeId,
  onSelect,
  onNewChat,
  onToggleSidebar,
  onOpenSettings,
  groups = chatGroups,
  onChatAction,
  name = user.name,
}: Props) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const { t } = useLocale();
  const visibleGroups = useMemo(() => groups.map((group) => ({
    ...group,
    chats: group.chats.filter((chat) => chat.title.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())),
  })).filter((group) => group.chats.length > 0 || !query.trim()), [groups, query]);

  const openSearch = () => {
    setSearchOpen(true);
    requestAnimationFrame(() => searchRef.current?.focus());
  };
  const closeSearch = () => {
    setQuery("");
    setSearchOpen(false);
  };
  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") closeSearch();
  };

  return (
    <div className="flex h-full flex-col py-[28px] ps-[29px]">
      <Brand onToggleSidebar={onToggleSidebar} onSearch={openSearch} />
      {searchOpen && (
        <div className="mt-3 flex h-10 w-[232.75px] items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3">
          <Search className="size-4 shrink-0 text-white/55" aria-hidden="true" />
          <input
            ref={searchRef}
            type="text"
            autoComplete="off"
            aria-label={t("searchChats")}
            placeholder={t("searchPlaceholder")}
            value={query}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/45"
          />
          <button type="button" aria-label={t("closeSearch")} onClick={closeSearch} className="rounded p-0.5 text-white/55 hover:text-white">
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      )}
      <div className="mt-[28px]">
        <NewChatButton onClick={onNewChat} />
      </div>
      <ChatList
        groups={visibleGroups}
        activeId={activeId}
        onSelect={onSelect}
        onAction={onChatAction}
        emptyMessage={t("noSearchResults")}
      />
      <div className="mt-[28.5px]">
        <UserCard name={name} plan={t("userPlan")} onOpenSettings={onOpenSettings} />
      </div>
    </div>
  );
}
