import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { Attachment, Message } from "../../data/messages";
import Composer from "./Composer";
import MessageBubble, { TypingIndicator } from "./MessageBubble";
import { useLocale } from "../../context/LocaleContext";

interface Props {
  messages: Message[];
  thinking?: boolean;
  regeneratingMessageIds?: string[];
  onSend?: (message: string, attachments: Attachment[]) => void;
  onCopyMessage?: (message: Message) => void;
  onShareMessage?: (message: Message) => void;
  onEditPrompt?: (id: string, content: string) => void;
  onRegenerateAnswer?: (id: string) => void;
}

export default function ChatPanel({
  messages,
  thinking,
  regeneratingMessageIds = [],
  onSend,
  onCopyMessage,
  onShareMessage,
  onEditPrompt,
  onRegenerateAnswer,
}: Props) {
  const endRef = useRef<HTMLDivElement>(null);
  const { t } = useLocale();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, thinking]);

  if (messages.length === 0) {
    return (
      <div className="flex size-full items-center justify-center px-5 md:px-10">
        <div className="flex w-full max-w-[680px] flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-7 text-center text-[32px] font-semibold leading-tight tracking-tight text-white sm:text-[42px] lg:text-[54px]"
          >
            {t("welcome")}
          </motion.h1>
          <Composer thinking={thinking} onSend={onSend} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex size-full flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-16 md:px-10">
        <div className="mx-auto flex w-full max-w-[760px] flex-col gap-6 pb-6">
          {messages.map((m) => (
            <MessageBubble
              key={m.id}
              message={m}
              regenerating={regeneratingMessageIds.includes(m.id)}
              onCopy={onCopyMessage}
              onShare={onShareMessage}
              onEdit={m.role === "user" ? onEditPrompt : undefined}
              onRegenerate={m.role === "assistant" ? onRegenerateAnswer : undefined}
            />
          ))}
          {thinking && <TypingIndicator />}
          <div ref={endRef} />
        </div>
      </div>
      <div className="px-5 pb-5 md:px-10">
        <div className="mx-auto w-full max-w-[760px]">
          <Composer compact thinking={thinking} onSend={onSend} />
        </div>
      </div>
    </div>
  );
}
