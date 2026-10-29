import { useEffect, useMemo, useRef, useState } from "react";
import { Menu, PanelLeft } from "lucide-react";
import { useBackground } from "./context/BackgroundContext";
import ChatPanel from "./components/chat/ChatPanel";
import SettingsPanel from "./components/settings/SettingsPanel";
import Sidebar from "./components/sidebar/Sidebar";
import { chatGroups, demoChats, user, type ChatGroup, type ChatSummary } from "./data/chats";
import { PLACEHOLDER_REPLY, type Attachment, type Message } from "./data/messages";
import type { ChatAction } from "./components/sidebar/ChatItemMenu";
import { getTranslation, useLocale, type Locale } from "./context/LocaleContext";
import ActionDialog, { type ActionDialogState } from "./components/ui/ActionDialog";
import { customInstructions, selectedModel, sendChat, type ChatMessage } from "./lib/paastaApi";

interface Conversation extends ChatSummary {
  groupId: string;
  messages: Message[];
  updatedAt: number;
}

const CHAT_STORAGE_KEY = "chatbot:conversations";
const DEMO_CHATS_SEEDED_KEY = "chatbot:demo-chats-seeded";
const PROFILE_NAME_KEY = "chatbot:account-name";

const starterTitleKeys: Record<string, string> = {
  "1": "chatDefault1", "2": "chatDefault2", "3": "chatDefault3", "4": "chatDefault4", "5": "chatDefault5",
};

function localizedTitle(id: string, title: string, locale: Locale) {
  const original = chatGroups.flatMap((group) => group.chats).find((chat) => chat.id === id);
  const demo = demoChats.find((chat) => chat.id === id);
  if (demo && (title === demo.title || title === demo.titleFa)) return locale === "fa" ? demo.titleFa : demo.title;
  const key = starterTitleKeys[id];
  return original && key && (title === original.title || title === getTranslation("fa", key) || title === getTranslation("en", key))
    ? getTranslation(locale, key)
    : title;
}

function localizedMessages(conversation: Conversation, locale: Locale): Message[] {
  const starter = chatGroups.flatMap((group) => group.chats).find((chat) => chat.id === conversation.id);
  const demo = demoChats.find((chat) => chat.id === conversation.id);
  const key = starterTitleKeys[conversation.id];
  const translatedTitle = localizedTitle(conversation.id, conversation.title, locale);
  return conversation.messages.map((message, index) => ({
    ...message,
    content: message.previewPrompt !== undefined
      ? makePreviewAnswer(locale, message.previewPrompt, message.previewGeneration ?? 0)
      : message.content === PLACEHOLDER_REPLY || message.content === getTranslation("en", "demoReply") || message.content === getTranslation("fa", "demoReply")
      ? getTranslation(locale, "demoReply")
      : demo && message.role === "user" && [demo.promptEn, demo.promptFa].includes(message.content)
        ? locale === "fa" ? demo.promptFa : demo.promptEn
        : demo && message.role === "assistant" && [demo.answerEn, demo.answerFa].includes(message.content)
          ? locale === "fa" ? demo.answerFa : demo.answerEn
      : starter && key && index === 0 && [starter.title, getTranslation("en", key), getTranslation("fa", key)].includes(message.content)
        ? translatedTitle
        : message.content,
  }));
}

function makePreviewAnswer(locale: Locale, prompt: string, generation: number) {
  const intro = getTranslation(locale, generation > 0 ? "regeneratedPreviewFor" : "previewAnswerFor")
    .replace("{prompt}", prompt.trim())
    .replace("{generation}", String(generation));
  return `${intro}\n\n${getTranslation(locale, "demoReply")}`;
}

function replyIndexForPrompt(messages: Message[], promptIndex: number) {
  const promptId = messages[promptIndex]?.id;
  const linkedReply = messages.findIndex((message, index) => index > promptIndex && message.role === "assistant" && message.replyToId === promptId);
  if (linkedReply >= 0) return linkedReply;
  for (let index = promptIndex + 1; index < messages.length; index += 1) {
    if (messages[index].role === "user") return -1;
    if (messages[index].role === "assistant") return index;
  }
  return -1;
}

function makeStarterConversations(locale: Locale): Conversation[] {
  return chatGroups.flatMap((group) => group.chats.map((chat, index) => ({
    ...chat,
    title: localizedTitle(chat.id, chat.title, locale),
    groupId: group.id,
    updatedAt: Date.now() - index * 60_000,
    messages: [
      { id: `${chat.id}-user`, role: "user" as const, content: demoChats.find((demo) => demo.id === chat.id)?.[locale === "fa" ? "promptFa" : "promptEn"] ?? localizedTitle(chat.id, chat.title, locale) },
      { id: `${chat.id}-assistant`, role: "assistant" as const, content: demoChats.find((demo) => demo.id === chat.id)?.[locale === "fa" ? "answerFa" : "answerEn"] ?? getTranslation(locale, "demoReply") },
    ],
  })));
}

function readConversations(locale: Locale): Conversation[] {
  try {
    const raw = localStorage.getItem(CHAT_STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const conversations = parsed.filter((item): item is Conversation =>
          !!item && typeof item.id === "string" && typeof item.title === "string" &&
          typeof item.groupId === "string" && Array.isArray(item.messages),
        ).map((item) => {
          const translated = localizedTitle(item.id, item.title, locale);
          return {
            ...item,
            title: translated,
            messages: localizedMessages(item, locale).map((message) => ({
              ...message,
              // Browser object URLs expire between sessions, so file previews stay session-only.
              attachments: undefined,
            })),
          };
        });

        if (localStorage.getItem(DEMO_CHATS_SEEDED_KEY) !== "true") {
          const existingIds = new Set(conversations.map((conversation) => conversation.id));
          const demoConversations = makeStarterConversations(locale).filter((conversation) =>
            demoChats.some((demo) => demo.id === conversation.id) && !existingIds.has(conversation.id),
          );
          localStorage.setItem(DEMO_CHATS_SEEDED_KEY, "true");
          return [...conversations, ...demoConversations];
        }
        return conversations;
      }
    }
    localStorage.setItem(DEMO_CHATS_SEEDED_KEY, "true");
  } catch {
    // Storage may be disabled or contain an old, invalid value.
  }
  return makeStarterConversations(locale);
}

function downloadFile(name: string, content: string, type = "application/json") {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function safeTitle(value: string) {
  const title = value.trim().replace(/\s+/g, " ");
  return title.length > 48 ? `${title.slice(0, 47).trimEnd()}…` : title;
}

// The glass panel's footprint; shared by the dimming ring, the panel and its positioning.
const panelInset = (collapsed: boolean, rtl: boolean) =>
  `absolute inset-3 sm:inset-4 lg:bottom-[28px] lg:top-[28px] ${
    rtl
      ? collapsed ? "lg:left-[30px] lg:right-[30px]" : "lg:left-[30px] lg:right-[325px]"
      : collapsed ? "lg:left-[30px] lg:right-[30px]" : "lg:left-[325px] lg:right-[30px]"
  }`;

// Whole-UI scale on desktop (1 = the 1920px artboard's own sizes); 0.68 matches viewing it at 80% browser zoom.
const BASE_SCALE = 0.68;
const DESKTOP_MIN = 1024;
// Desktop sidebar is enlarged relative to the artboard (283px × 1.15 ≈ 325px).
const SIDEBAR_ZOOM = 1.15;

function useUiScale() {
  const compute = () =>
    window.innerWidth >= DESKTOP_MIN ? BASE_SCALE * Math.max(1, window.innerWidth / 1920) : 1;
  const [scale, setScale] = useState(compute);
  useEffect(() => {
    const onResize = () => setScale(compute());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return scale;
}

// The backend is text-only, so attachments are mentioned by name.
function toChatHistory(messages: Message[]): ChatMessage[] {
  const instructions = customInstructions();
  return [
    ...(instructions ? [{ role: "system" as const, content: instructions }] : []),
    ...messages.map((message) => ({
      role: message.role,
      content: message.attachments?.length
        ? `${message.content}

[Attached: ${message.attachments.map((attachment) => attachment.name).join(", ")}]`
        : message.content,
    })),
  ];
}

export default function App() {
  const { locale, t } = useLocale();
  const rtl = locale === "fa";
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>();
  const [collapsed, setCollapsed] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>(() => readConversations(locale));
  const [thinkingIds, setThinkingIds] = useState<string[]>([]);
  const [regeneratingMessageIds, setRegeneratingMessageIds] = useState<string[]>([]);
  const [view, setView] = useState<"chat" | "settings">("chat");
  const [dialog, setDialog] = useState<ActionDialogState | null>(null);
  const [toast, setToast] = useState("");
  const [profileName, setProfileName] = useState(() => {
    try { return localStorage.getItem(PROFILE_NAME_KEY) || user.name; } catch { return user.name; }
  });
  const toastTimer = useRef<number | undefined>(undefined);
  const pendingRequests = useRef<AbortController[]>([]);
  const scale = useUiScale();
  const { background, blur } = useBackground();

  const openSettings = () => setView("settings");
  const notify = (message: string) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 3200);
  };

  useEffect(() => {
    try {
      const serializable = conversations.map(({ messages: items, ...conversation }) => ({
        ...conversation,
        messages: items.map(({ attachments: _attachments, ...message }) => message),
      }));
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(serializable));
    } catch {
      // Keep the current session usable when browser storage is full or unavailable.
    }
  }, [conversations]);

  useEffect(() => () => {
    window.clearTimeout(toastTimer.current);
    pendingRequests.current.forEach((request) => request.abort());
  }, []);

  useEffect(() => {
    if (!drawerOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [drawerOpen]);

  const messages = useMemo(() => {
    const conversation = conversations.find((item) => item.id === activeId);
    if (!conversation) return [];
    return localizedMessages(conversation, locale);
  }, [conversations, activeId, locale, t]);
  // Archived chats stay out of the sidebar history.
  const groups: ChatGroup[] = useMemo(() => chatGroups.filter((group) => group.id !== "archive").map((group) => ({
    ...group,
    label: t(group.id),
    chats: conversations.filter((conversation) => conversation.groupId === group.id)
      .map((conversation) => ({ ...conversation, title: localizedTitle(conversation.id, conversation.title, locale) })),
  })), [conversations, locale, t]);

  const send = (content: string, attachments: Attachment[]) => {
    const id = activeId ?? crypto.randomUUID();
    const userMessage: Message = { id: crypto.randomUUID(), role: "user", content, attachments };
    setActiveId(id);
    setView("chat");
    setConversations((current) => {
      const exists = current.some((conversation) => conversation.id === id);
      const next = current.map((conversation) => conversation.id === id
        ? { ...conversation, groupId: conversation.groupId === "archive" ? "today" : conversation.groupId, updatedAt: Date.now(), messages: [...conversation.messages, userMessage] }
        : conversation);
      return exists ? next : [{
        id,
        title: safeTitle(content) || t("newChat"),
        groupId: "today",
        updatedAt: Date.now(),
        messages: [userMessage],
      }, ...next];
    });
    setThinkingIds((current) => current.includes(id) ? current : [...current, id]);
    const existing = conversations.find((conversation) => conversation.id === id);
    const history = [...(existing ? localizedMessages(existing, locale) : []), userMessage];
    const request = new AbortController();
    pendingRequests.current.push(request);
    sendChat(selectedModel(), toChatHistory(history), request.signal)
      .then((reply) => {
        setConversations((current) => current.map((conversation) => conversation.id === id
          ? {
            ...conversation,
            updatedAt: Date.now(),
            messages: [...conversation.messages, {
              id: crypto.randomUUID(),
              role: "assistant",
              content: reply.message,
              replyToId: userMessage.id,
            }],
          }
          : conversation));
      })
      .catch((error: Error) => {
        if (error.name !== "AbortError") notify(`${t("replyFailed")} ${error.message}`);
      })
      .finally(() => {
        setThinkingIds((current) => current.filter((thinkingId) => thinkingId !== id));
        pendingRequests.current = pendingRequests.current.filter((pending) => pending !== request);
      });
  };

  const selectChat = (id: string) => {
    setView("chat");
    setActiveId(id);
  };

  const newChat = () => {
    setView("chat");
    setActiveId(undefined);
  };

  const handleChatAction = (id: string, action: ChatAction) => {
    const conversation = conversations.find((item) => item.id === id);
    if (!conversation) return;
    if (action === "rename") {
      setDialog({ type: "rename", id, title: localizedTitle(id, conversation.title, locale) });
    } else if (action === "pin") {
      const nextGroup = conversation.groupId === "pinned" ? "today" : "pinned";
      setConversations((current) => current.map((item) => item.id === id ? { ...item, groupId: nextGroup } : item));
      notify(t(nextGroup === "pinned" ? "chatPinned" : "chatUnpinned"));
    } else if (action === "archive") {
      const restoring = conversation.groupId === "archive";
      setConversations((current) => current.map((item) => item.id === id ? { ...item, groupId: restoring ? "today" : "archive" } : item));
      notify(t(restoring ? "chatRestored" : "chatArchived"));
    } else if (action === "export") {
      downloadFile(`${safeTitle(conversation.title).replace(/[^a-z0-9-_]+/gi, "-") || "chat"}.json`, JSON.stringify(conversation, null, 2));
      notify(t("chatExported"));
    } else if (action === "share") {
      const body = localizedMessages(conversation, locale).map((message) => `${message.role === "user" ? t("you") : t("assistant")}: ${message.content}`).join("\n\n");
      setDialog({ type: "share", title: localizedTitle(id, conversation.title, locale), content: body });
    } else if (action === "delete") {
      setDialog({ type: "delete", id, title: localizedTitle(id, conversation.title, locale) });
    }
  };

  const renameChat = (id: string, title: string) => {
    setConversations((current) => current.map((item) => item.id === id ? { ...item, title, updatedAt: Date.now() } : item));
    setDialog(null);
    notify(t("chatRenamed"));
  };

  const regenerateAnswer = (messageId: string, promptOverride?: string, conversationId = activeId) => {
    if (!conversationId) return;
    const conversation = conversations.find((item) => item.id === conversationId);
    const replyIndex = conversation?.messages.findIndex((message) => message.id === messageId) ?? -1;
    if (!conversation || replyIndex < 0 || conversation.messages[replyIndex].role !== "assistant") return;
    const reply = conversation.messages[replyIndex];
    const history = localizedMessages(conversation, locale).slice(0, replyIndex);
    if (promptOverride !== undefined) {
      const promptIndex = reply.replyToId
        ? history.findIndex((message) => message.id === reply.replyToId)
        : history.map((message) => message.role).lastIndexOf("user");
      if (promptIndex >= 0) history[promptIndex] = { ...history[promptIndex], content: promptOverride };
    }
    setRegeneratingMessageIds((current) => current.includes(messageId) ? current : [...current, messageId]);
    const request = new AbortController();
    pendingRequests.current.push(request);
    sendChat(selectedModel(), toChatHistory(history), request.signal)
      .then((result) => {
        setConversations((current) => current.map((item) => item.id !== conversationId
          ? item
          : {
            ...item,
            updatedAt: Date.now(),
            messages: item.messages.map((message) => message.id !== messageId
              ? message
              : { ...message, content: result.message, previewPrompt: undefined, previewGeneration: undefined }),
          }));
        notify(t("responseRegenerated"));
      })
      .catch((error: Error) => {
        if (error.name !== "AbortError") notify(`${t("replyFailed")} ${error.message}`);
      })
      .finally(() => {
        setRegeneratingMessageIds((current) => current.filter((id) => id !== messageId));
        pendingRequests.current = pendingRequests.current.filter((pending) => pending !== request);
      });
  };

  const editPrompt = (messageId: string, content: string) => {
    const cleanContent = content.trim();
    if (!activeId || !cleanContent) return;
    const conversation = conversations.find((item) => item.id === activeId);
    const promptIndex = conversation?.messages.findIndex((message) => message.id === messageId) ?? -1;
    if (!conversation || promptIndex < 0 || conversation.messages[promptIndex].role !== "user") return;
    const replyIndex = replyIndexForPrompt(conversation.messages, promptIndex);
    const replyId = replyIndex >= 0 ? conversation.messages[replyIndex].id : undefined;
    setConversations((current) => current.map((item) => item.id !== activeId
      ? item
      : {
        ...item,
        updatedAt: Date.now(),
        messages: item.messages.map((message) => message.id === messageId ? { ...message, content: cleanContent } : message),
      }));
    if (replyId) regenerateAnswer(replyId, cleanContent, activeId);
    notify(t("promptUpdated"));
  };

  const deleteChat = (id: string) => {
    setConversations((current) => current.filter((item) => item.id !== id));
    setThinkingIds((current) => current.filter((thinkingId) => thinkingId !== id));
    if (activeId === id) setActiveId(undefined);
    setDialog(null);
    notify(t("chatDeleted"));
  };

  const exportAll = () => {
    downloadFile(t("chatDataFile"), JSON.stringify({ exportedAt: new Date().toISOString(), conversations }, null, 2));
    notify(t("dataExported"));
  };

  const requestClearHistory = () => setDialog({ type: "clear-history" });

  const clearHistory = () => {
    setConversations([]);
    setThinkingIds([]);
    setActiveId(undefined);
    setDialog(null);
    notify(t("historyCleared"));
  };

  const copyShareText = async (content: string) => {
    if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
    await navigator.clipboard.writeText(content);
    setDialog(null);
    notify(t("copiedText"));
  };

  const copyMessage = async (message: Message) => {
    const content = message.content || message.attachments?.map((attachment) => attachment.name).join(", ") || "";
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(content);
      notify(t("copiedText"));
    } catch {
      notify(t("copyUnavailable"));
    }
  };

  const shareMessage = async (message: Message) => {
    const title = t(message.role === "user" ? "prompt" : "answer");
    const content = message.content || message.attachments?.map((attachment) => attachment.name).join(", ") || "";
    if (navigator.share) {
      try {
        await navigator.share({ title, text: content });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    setDialog({ type: "share", title, content });
  };

  const downloadShareText = (title: string, content: string) => {
    const fileName = `${safeTitle(title).replace(/[^a-z0-9-_]+/gi, "-") || "chat"}.txt`;
    downloadFile(fileName, `${title}\n\n${content}`, "text/plain");
    setDialog(null);
    notify(t("downloadedText"));
  };

  const closeDrawer = () => setDrawerOpen(false);
  const PANEL_INSET = panelInset(collapsed, rtl);

  return (
    <div
      id="app-shell"
      dir={rtl ? "rtl" : "ltr"}
      lang={locale}
      className="relative min-h-[560px] overflow-hidden bg-ink text-white"
      style={{
        zoom: scale,
        width: `${100 / scale}vw`,
        height: `${100 / scale}dvh`,
      }}
    >
      {/* Background image; oversized so the blur doesn't feather at the edges. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-[6%] bg-cover bg-center transition-[filter] duration-300"
        style={{
          backgroundImage: `url(${background.src})`,
          filter: blur ? `blur(${blur}px)` : undefined,
        }}
      />
      {/* Dims everything outside the panel. */}
      <div
        aria-hidden="true"
        className={`${PANEL_INSET} pointer-events-none rounded-[24px] shadow-[0_0_0_200vmax_color-mix(in_srgb,var(--color-ink)_70%,transparent)] lg:rounded-panel`}
      />

      {!collapsed && (
        <aside className={`absolute inset-y-0 z-10 hidden w-[325px] lg:block ${rtl ? "right-0" : "left-0"}`}>
          <div
            className={rtl ? "origin-top-right" : "origin-top-left"}
            style={{
              width: 283,
              height: `${100 / SIDEBAR_ZOOM}%`,
              transform: `scale(${SIDEBAR_ZOOM})`,
            }}
          >
            <Sidebar
              activeId={activeId}
              groups={groups}
              name={profileName}
              onChatAction={handleChatAction}
              onSelect={selectChat}
              onNewChat={newChat}
              onToggleSidebar={() => setCollapsed(true)}
              onOpenSettings={openSettings}
            />
          </div>
        </aside>
      )}

      <main className={`${PANEL_INSET} rounded-[24px] border border-white/10 bg-ink/50 backdrop-blur-[15.6px] lg:rounded-panel`}>
        <button
          id="main-menu-button"
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label={t("openMenu")}
          aria-expanded={drawerOpen}
          aria-controls="chat-history-drawer"
          className={`absolute top-4 z-10 flex size-10 cursor-pointer items-center justify-center rounded-full bg-glass transition hover:bg-white/30 lg:hidden ${rtl ? "right-4" : "left-4"}`}
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
        {collapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            aria-label={t("openSidebar")}
            className={`absolute top-5 z-10 hidden size-10 cursor-pointer items-center justify-center rounded-full bg-glass transition hover:bg-white/30 lg:flex ${rtl ? "right-5" : "left-5"}`}
          >
            <PanelLeft className="size-5" aria-hidden="true" />
          </button>
        )}
        <ChatPanel
          messages={messages}
          thinking={activeId ? thinkingIds.includes(activeId) : false}
          regeneratingMessageIds={regeneratingMessageIds}
          onSend={send}
          onCopyMessage={copyMessage}
          onShareMessage={shareMessage}
          onEditPrompt={editPrompt}
          onRegenerateAnswer={regenerateAnswer}
        />
      </main>

      {/* Mobile / tablet drawer: always mounted, toggled with CSS transitions. */}
      <button
        type="button"
        aria-label={t("closeHistory")}
        aria-hidden={!drawerOpen}
        tabIndex={drawerOpen ? 0 : -1}
        onClick={closeDrawer}
        className={`absolute inset-0 z-20 bg-black/50 transition-opacity duration-200 lg:hidden ${
          drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        id="chat-history-drawer"
        aria-label={t("history")}
        role={drawerOpen ? "dialog" : undefined}
        aria-hidden={!drawerOpen}
        aria-modal={drawerOpen}
        inert={!drawerOpen}
        className={`absolute inset-y-0 z-30 w-[283px] max-w-[85vw] bg-ink/95 backdrop-blur-xl transition-transform duration-250 ease-out lg:hidden ${
          rtl ? `right-0 ${drawerOpen ? "translate-x-0" : "translate-x-full"}` : `left-0 ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`
        }`}
      >
        <Sidebar
          groups={groups}
          name={profileName}
          onChatAction={handleChatAction}
          onToggleSidebar={closeDrawer}
          onOpenSettings={() => {
            openSettings();
            closeDrawer();
          }}
          activeId={activeId}
          onSelect={(id) => {
            selectChat(id);
            closeDrawer();
          }}
          onNewChat={() => {
            newChat();
            closeDrawer();
          }}
        />
      </aside>
      {view === "settings" && (
        <SettingsPanel
          onClose={() => setView("chat")}
          onNotify={notify}
          onExportData={exportAll}
          onClearHistory={requestClearHistory}
          onProfileChange={(name) => setProfileName(name)}
        />
      )}
      {toast && (
        <div role="status" className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-white/15 bg-ink/95 px-4 py-3 text-sm text-white shadow-lg backdrop-blur-xl">
          {toast}
        </div>
      )}
      {dialog && (
        <ActionDialog
          dialog={dialog}
          onClose={() => setDialog(null)}
          onRename={renameChat}
          onDelete={deleteChat}
          onClearHistory={clearHistory}
          onCopy={copyShareText}
          onDownload={downloadShareText}
        />
      )}
    </div>
  );
}
