import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Locale = "en" | "fa";

const messages: Record<Locale, Record<string, string>> = {
  en: {
    brandName: "Chat bot", workspace: "AI Workspace", searchChats: "Search chats", closeSearch: "Close search", searchPlaceholder: "Search chats",
    noSearchResults: "No chats match your search.", closeSidebar: "Close sidebar", openSidebar: "Open sidebar", openMenu: "Open menu",
    closeHistory: "Close chat history", history: "Chat history", newChat: "New chat", pinned: "Pinned", today: "Today",
    week: "Previous 7 days", archive: "Archived", archived: "Archived", userPlan: "Free plan", welcome: "How can I help you?", message: "Message",
    messagePlaceholder: "Message...", sendMessage: "Send message", attachFiles: "Attach images or PDFs", startVoice: "Start voice input",
    stopVoice: "Stop voice input", voiceUnsupported: "Voice input is not supported in this browser", listening: "Listening...",
    dropFiles: "Drop images or PDFs to attach", attachments: "Attachments", removeFile: "Remove {name}", pdf: "PDF",
    onlyFiles: "Only images and PDF files are supported.", tooLarge: "File is larger than 10 MB.", maxFiles: "You can attach up to 5 files.",
    typing: "Assistant is typing", thinkingLabel: "Thinking", you: "You", assistant: "Assistant", demoReply: "This workspace preview is not connected to an AI service yet. Connect a model API to receive live answers.",
    settings: "Settings", backToChat: "Back to chat", account: "Account", accountDescription: "Contact details, date of birth and profile picture",
    personalization: "Personalization", personalizationDescription: "Background and blur", aiSettings: "AI settings",
    aiDescription: "Default model and custom instructions", privacy: "Data & privacy", privacyDescription: "Manage history and export your data",
    notifications: "Notifications", notificationsDescription: "Manage notification preferences", security: "Security",
    securityDescription: "Password and active sessions", help: "Help & support", helpDescription: "FAQ and contacting support",
    name: "Name", email: "Email", phone: "Mobile number", phonePlaceholder: "+1 555 123 4567", dateOfBirth: "Date of birth",
    selectDate: "Choose a date", previousMonth: "Previous month", nextMonth: "Next month", clearDate: "Clear date",
    changePhoto: "Change photo", removePhoto: "Remove", saveChanges: "Save changes", chooseImage: "Choose an image file.",
    imageTooLarge: "Choose an image smaller than 2 MB.", profilePhotoUpdated: "Profile photo updated", profilePhotoRemoved: "Profile photo removed",
    enterName: "Enter a name before saving", validEmail: "Enter a valid email address", accountSaved: "Account details saved on this device",
    background: "Background", backgroundDescription: "Choose the image behind the interface; its colors tint the UI.",
    backgroundFlowers: "Flowers", backgroundMountains: "Mountains", backgroundStreet: "Street", backgroundFantasy: "Fantasy island",
    backgroundLabel: "Background", blur: "Background blur", blurDescription: "How soft the background image looks.",
    interfaceLanguage: "Interface language", english: "English", persian: "فارسی", languageSaved: "Language preference saved",
    modelStandard: "Standard", modelAdvanced: "Advanced", modelFast: "Fast",
    defaultModel: "Default model", customInstructions: "Custom instructions", instructionsPlaceholder: "Tell the assistant how you would like it to respond...",
    localAiNote: "Preferences are saved on this device. Connect an AI service to use them for live replies.", save: "Save", aiSaved: "AI preferences saved on this device",
    improveProduct: "Improve the product", improveDescription: "Save this preference locally. This preview does not send chat data.",
    exportData: "Export data", exportDescription: "Download a copy of your chats and account data.", export: "Export", dataExported: "Your chat data has been exported",
    clearHistory: "Clear chat history", clearDescription: "Permanently delete all of your chats.", clear: "Clear history", clearHistoryQuestion: "Delete all chat history? This cannot be undone.",
    historyCleared: "Chat history cleared", privacySaved: "Privacy preference saved", notificationsSaved: "Notification preference saved",
    repliesReady: "Response ready", repliesDescription: "Store this notification preference on this device.", productUpdates: "Product updates",
    securityAlerts: "Security alerts", changePassword: "Change password", passwordDescription: "Change the password you use to sign in.",
    passwordUnavailable: "Password changes require a connected sign-in service", activeSessions: "Active sessions", currentSession: "This device · Current session",
    signOutSessions: "Sign out other sessions", sessionsUnavailable: "There are no other connected sessions in this local preview",
    faqStart: "How do I start a new chat?", faqStartAnswer: "Press New chat in the sidebar. Your previous chats stay in the history list.",
    faqRename: "How do I rename or delete a chat?", faqRenameAnswer: "Open the three-dot menu next to a chat in the sidebar.",
    faqExport: "Can I export my data?", faqExportAnswer: "Yes, open Data & privacy and choose Export.", contactSupport: "Contact support",
    supportUnavailable: "Support contact details have not been configured", accountOptions: "Account options", logout: "Log out",
    logoutUnavailable: "Sign-in is not connected in this local preview", renameChat: "Rename chat", pin: "Pin", unpin: "Unpin",
    archiveChat: "Move to archive", restoreChat: "Restore from archive", share: "Share", exportChat: "Export", deleteChat: "Delete chat",
    messageActions: "Message actions", prompt: "Prompt", answer: "Answer", editPrompt: "Edit prompt", regenerateAnswer: "Regenerate answer", regenerating: "Regenerating...",
    previewAnswerFor: "Preview response for: “{prompt}”", regeneratedPreviewFor: "Alternative preview {generation} for: “{prompt}”", promptUpdated: "Prompt updated. Refreshing the preview response.", responseRegenerated: "Response preview updated",
    chatOptions: "Options for {title}", renamePrompt: "Enter a new chat name", chatRenamed: "Chat renamed", chatPinned: "Chat pinned",
    chatUnpinned: "Chat unpinned", chatArchived: "Chat moved to Archived", chatRestored: "Chat restored", chatExported: "Chat exported",
    copiedChat: "Chat copied to clipboard", copiedText: "Text copied to clipboard", downloadedChat: "Chat downloaded as a text file", downloadedText: "Text downloaded as a file", shareCancelled: "Sharing was cancelled",
    deleteQuestion: "Delete “{title}”? This cannot be undone.", chatDeleted: "Chat deleted", chatDataFile: "chatbot-data.json",
    renameDialogTitle: "Rename chat", renameDialogDescription: "Give this chat a name that is easy to recognize.", chatName: "Chat name",
    deleteDialogTitle: "Delete this chat?", chatToDelete: "Conversation to delete", deleteConfirmDescription: "This conversation will be permanently deleted. This action cannot be undone.", confirmDelete: "Delete chat",
    clearDialogTitle: "Clear chat history?", confirmClear: "Clear all chats", shareDialogTitle: "Share chat", sharePreview: "Message preview",
    copyText: "Copy text", downloadText: "Download text file", copyUnavailable: "Clipboard access is unavailable in this browser.", closeDialog: "Close dialog",
    cancel: "Cancel",
    voiceInput: "Voice input", backgroundBlurUnit: "px", languageChanged: "Language changed to Persian", chatDefault1: "AI dashboard design",
    chatDefault2: "Design ideas review", chatDefault3: "Website content creation", chatDefault4: "User data analysis", chatDefault5: "Ad campaign ideas",
  },
  fa: {
    brandName: "چت‌بات", workspace: "فضای کار هوش مصنوعی", searchChats: "جست‌وجوی گفتگوها", closeSearch: "بستن جست‌وجو", searchPlaceholder: "جست‌وجوی گفتگوها",
    noSearchResults: "گفتگویی با این عبارت پیدا نشد.", closeSidebar: "بستن نوار کناری", openSidebar: "باز کردن نوار کناری", openMenu: "باز کردن منو",
    closeHistory: "بستن تاریخچه گفتگوها", history: "تاریخچه گفتگوها", newChat: "گفتگوی جدید", pinned: "سنجاق‌شده", today: "امروز",
    week: "۷ روز گذشته", archive: "بایگانی‌شده", archived: "بایگانی‌شده", userPlan: "طرح رایگان", welcome: "چطور می‌توانم کمک کنم؟", message: "پیام",
    messagePlaceholder: "پیام خود را بنویسید...", sendMessage: "ارسال پیام", attachFiles: "پیوست تصویر یا فایل PDF", startVoice: "شروع ورودی صوتی",
    stopVoice: "توقف ورودی صوتی", voiceUnsupported: "ورودی صوتی در این مرورگر پشتیبانی نمی‌شود", listening: "در حال شنیدن...",
    dropFiles: "تصویر یا فایل PDF را برای پیوست رها کنید", attachments: "پیوست‌ها", removeFile: "حذف {name}", pdf: "فایل PDF",
    onlyFiles: "فقط تصویر و فایل PDF پشتیبانی می‌شود.", tooLarge: "حجم فایل بیشتر از ۱۰ مگابایت است.", maxFiles: "حداکثر می‌توانید ۵ فایل پیوست کنید.",
    typing: "دستیار در حال نوشتن است", thinkingLabel: "در حال فکر کردن", you: "شما", assistant: "دستیار", demoReply: "این پیش‌نمایش هنوز به سرویس هوش مصنوعی وصل نیست. برای دریافت پاسخ زنده، یک API مدل متصل کنید.",
    settings: "تنظیمات", backToChat: "بازگشت به گفتگو", account: "حساب کاربری", accountDescription: "اطلاعات تماس، تاریخ تولد و تصویر پروفایل",
    personalization: "شخصی‌سازی", personalizationDescription: "پس‌زمینه و میزان تاری", aiSettings: "تنظیمات هوش مصنوعی",
    aiDescription: "مدل پیش‌فرض و دستورالعمل‌های اختصاصی", privacy: "داده و حریم خصوصی", privacyDescription: "مدیریت تاریخچه و دریافت نسخه‌ای از داده‌ها",
    notifications: "اعلان‌ها", notificationsDescription: "مدیریت تنظیمات اعلان", security: "امنیت",
    securityDescription: "گذرواژه و نشست‌های فعال", help: "راهنما و پشتیبانی", helpDescription: "پرسش‌های رایج و ارتباط با پشتیبانی",
    name: "نام", email: "ایمیل", phone: "شماره موبایل", phonePlaceholder: "+98 912 345 6789", dateOfBirth: "تاریخ تولد",
    selectDate: "انتخاب تاریخ", previousMonth: "ماه قبل", nextMonth: "ماه بعد", clearDate: "پاک کردن تاریخ",
    changePhoto: "تغییر تصویر", removePhoto: "حذف", saveChanges: "ذخیره تغییرات", chooseImage: "یک فایل تصویری انتخاب کنید.",
    imageTooLarge: "تصویری کوچک‌تر از ۲ مگابایت انتخاب کنید.", profilePhotoUpdated: "تصویر پروفایل به‌روزرسانی شد", profilePhotoRemoved: "تصویر پروفایل حذف شد",
    enterName: "برای ذخیره، نام را وارد کنید", validEmail: "یک نشانی ایمیل معتبر وارد کنید", accountSaved: "اطلاعات حساب در این دستگاه ذخیره شد",
    background: "پس‌زمینه", backgroundDescription: "تصویر پشت رابط را انتخاب کنید؛ رنگ‌های آن روی ظاهر برنامه اثر می‌گذارند.",
    backgroundFlowers: "گل‌ها", backgroundMountains: "کوهستان", backgroundStreet: "خیابان", backgroundFantasy: "جزیره خیال‌انگیز",
    backgroundLabel: "پس‌زمینه", blur: "تاری پس‌زمینه", blurDescription: "میزان وضوح تصویر پس‌زمینه.",
    interfaceLanguage: "زبان رابط کاربری", english: "انگلیسی", persian: "فارسی", languageSaved: "زبان رابط کاربری تغییر کرد",
    modelStandard: "معمولی", modelAdvanced: "پیشرفته", modelFast: "سریع",
    defaultModel: "مدل پیش‌فرض", customInstructions: "دستورالعمل‌های اختصاصی", instructionsPlaceholder: "بگویید دستیار چطور پاسخ دهد...",
    localAiNote: "تنظیمات روی این دستگاه ذخیره می‌شوند. برای استفاده در پاسخ‌های زنده، سرویس هوش مصنوعی را متصل کنید.", save: "ذخیره", aiSaved: "تنظیمات هوش مصنوعی در این دستگاه ذخیره شد",
    improveProduct: "بهبود محصول", improveDescription: "این انتخاب فقط روی دستگاه ذخیره می‌شود؛ این پیش‌نمایش داده گفتگوها را ارسال نمی‌کند.",
    exportData: "خروجی گرفتن از داده‌ها", exportDescription: "نسخه‌ای از گفتگوها و اطلاعات حساب را دانلود کنید.", export: "دریافت خروجی", dataExported: "خروجی داده‌های گفتگو آماده شد",
    clearHistory: "پاک کردن تاریخچه گفتگو", clearDescription: "همه گفتگوها را برای همیشه حذف کنید.", clear: "پاک کردن تاریخچه", clearHistoryQuestion: "همه گفتگوها حذف شوند؟ این کار قابل بازگشت نیست.",
    historyCleared: "تاریخچه گفتگوها پاک شد", privacySaved: "تنظیم حریم خصوصی ذخیره شد", notificationsSaved: "تنظیم اعلان ذخیره شد",
    repliesReady: "آماده شدن پاسخ", repliesDescription: "تنظیم اعلان روی این دستگاه ذخیره شود.", productUpdates: "به‌روزرسانی‌های محصول",
    securityAlerts: "هشدارهای امنیتی", changePassword: "تغییر گذرواژه", passwordDescription: "گذرواژه ورود به حساب را تغییر دهید.",
    passwordUnavailable: "تغییر گذرواژه به سرویس ورود متصل نیاز دارد", activeSessions: "نشست‌های فعال", currentSession: "این دستگاه · نشست فعلی",
    signOutSessions: "خروج از نشست‌های دیگر", sessionsUnavailable: "در این پیش‌نمایش نشست متصل دیگری وجود ندارد",
    faqStart: "چطور گفتگوی جدیدی شروع کنم؟", faqStartAnswer: "از نوار کناری روی گفتگوی جدید بزنید. گفتگوهای قبلی در تاریخچه می‌مانند.",
    faqRename: "چطور نام گفتگو را عوض یا آن را حذف کنم؟", faqRenameAnswer: "منوی سه‌نقطه کنار گفتگو را در نوار کناری باز کنید.",
    faqExport: "می‌توانم از داده‌هایم خروجی بگیرم؟", faqExportAnswer: "بله، بخش داده و حریم خصوصی را باز کنید و دریافت خروجی را بزنید.", contactSupport: "ارتباط با پشتیبانی",
    supportUnavailable: "اطلاعات تماس پشتیبانی هنوز تنظیم نشده است", accountOptions: "گزینه‌های حساب", logout: "خروج",
    logoutUnavailable: "ورود به حساب در این پیش‌نمایش متصل نیست", renameChat: "تغییر نام گفتگو", pin: "سنجاق کردن", unpin: "برداشتن سنجاق",
    archiveChat: "انتقال به بایگانی", restoreChat: "بازگرداندن از بایگانی", share: "اشتراک‌گذاری", exportChat: "دریافت خروجی", deleteChat: "حذف گفتگو",
    messageActions: "عملیات پیام", prompt: "پرامپت", answer: "پاسخ", editPrompt: "ویرایش پرامپت", regenerateAnswer: "بازتولید پاسخ", regenerating: "در حال بازتولید...",
    previewAnswerFor: "پاسخ پیش‌نمایشی برای: «{prompt}»", regeneratedPreviewFor: "پیش‌نمایش جایگزین {generation} بر اساس: «{prompt}»", promptUpdated: "پرامپت ویرایش شد؛ پاسخ پیش‌نمایشی در حال بازتولید است.", responseRegenerated: "پیش‌نمایش پاسخ به‌روز شد",
    chatOptions: "گزینه‌های {title}", renamePrompt: "نام جدید گفتگو را وارد کنید", chatRenamed: "نام گفتگو تغییر کرد", chatPinned: "گفتگو سنجاق شد",
    chatUnpinned: "سنجاق گفتگو برداشته شد", chatArchived: "گفتگو به بایگانی منتقل شد", chatRestored: "گفتگو بازگردانده شد", chatExported: "از گفتگو خروجی گرفته شد",
    copiedChat: "متن گفتگو کپی شد", copiedText: "متن کپی شد", downloadedChat: "گفتگو به‌صورت فایل متنی دانلود شد", downloadedText: "متن به‌صورت فایل دانلود شد", shareCancelled: "اشتراک‌گذاری لغو شد",
    deleteQuestion: "گفتگوی «{title}» حذف شود؟ این کار قابل بازگشت نیست.", chatDeleted: "گفتگو حذف شد", chatDataFile: "داده‌های-chatbot.json",
    renameDialogTitle: "تغییر نام گفتگو", renameDialogDescription: "نامی انتخاب کنید که این گفتگو را راحت‌تر پیدا کنید.", chatName: "نام گفتگو",
    deleteDialogTitle: "این گفتگو حذف شود؟", chatToDelete: "گفتگوی موردنظر", deleteConfirmDescription: "این گفتگو برای همیشه حذف می‌شود و امکان بازگردانی آن وجود ندارد.", confirmDelete: "حذف گفتگو",
    clearDialogTitle: "تاریخچه گفتگو پاک شود؟", confirmClear: "پاک کردن همه گفتگوها", shareDialogTitle: "اشتراک‌گذاری گفتگو", sharePreview: "پیش‌نمایش پیام‌ها",
    copyText: "کپی متن", downloadText: "دانلود فایل متنی", copyUnavailable: "دسترسی به کلیپ‌بورد در این مرورگر ممکن نیست.", closeDialog: "بستن پنجره",
    cancel: "لغو",
    voiceInput: "ورودی صوتی", backgroundBlurUnit: "پیکسل", languageChanged: "زبان رابط به فارسی تغییر کرد", chatDefault1: "طراحی داشبورد هوش مصنوعی",
    chatDefault2: "بررسی ایده‌های طراحی", chatDefault3: "تولید محتوای وب‌سایت", chatDefault4: "تحلیل داده‌های کاربران", chatDefault5: "ایده‌های کمپین تبلیغاتی",
  },
};

export function getTranslation(locale: Locale, key: string): string {
  return messages[locale][key] ?? messages.en[key] ?? key;
}

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function readLocale(): Locale {
  try { return localStorage.getItem("chatbot:locale") === "fa" ? "fa" : "en"; } catch { return "en"; }
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readLocale);
  const setLocale = (next: Locale) => {
    setLocaleState(next);
    try { localStorage.setItem("chatbot:locale", next); } catch { /* This session still uses the selected language. */ }
  };
  const value = useMemo<LocaleContextValue>(() => ({
    locale,
    setLocale,
    t: (key) => getTranslation(locale, key),
  }), [locale]);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "fa" ? "rtl" : "ltr";
    document.title = locale === "fa" ? "چت‌بات — فضای کار هوش مصنوعی" : "Chat bot — AI Workspace";
  }, [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used inside <LocaleProvider>");
  return context;
}
