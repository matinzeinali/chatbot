export interface ChatSummary {
  id: string;
  title: string;
}

export interface ChatGroup {
  id: string;
  label: string;
  chats: ChatSummary[];
}

export interface DemoChat extends ChatSummary {
  groupId: string;
  titleFa: string;
  promptEn: string;
  promptFa: string;
  answerEn: string;
  answerFa: string;
}

export const demoChats: DemoChat[] = [
  {
    id: "demo-1", groupId: "pinned", title: "Plan a weekend in Istanbul", titleFa: "برنامه سفر آخر هفته به استانبول",
    promptEn: "Plan a relaxed three-day trip to Istanbul with food, history, and time by the water.",
    promptFa: "برای یک سفر سه‌روزه و آرام به استانبول برنامه بده؛ با غذا، تاریخ و زمانی کنار آب.",
    answerEn: "Start in Sultanahmet for the old city, set aside a slow afternoon for the Bosphorus, and spend your final day exploring Kadıköy. Keep one meal unplanned each day so you can follow local recommendations.",
    answerFa: "روز اول را در سلطان‌احمد و بافت تاریخی بگذران، یک بعدازظهر آرام را برای بسفر کنار بگذار و روز آخر را در کادیکوی بگرد. هر روز یک وعده را خالی بگذار تا از پیشنهادهای محلی استفاده کنی.",
  },
  {
    id: "demo-2", groupId: "today", title: "Rewrite my CV summary", titleFa: "بازنویسی خلاصه رزومه",
    promptEn: "Help me write a concise CV summary for a product designer with four years of experience.",
    promptFa: "برای یک طراح محصول با چهار سال سابقه، خلاصه‌ای کوتاه و حرفه‌ای برای رزومه بنویس.",
    answerEn: "Product designer with four years of experience turning customer insights into clear, accessible digital experiences. Skilled in research, prototyping, and partnering with engineering teams from concept through launch.",
    answerFa: "طراح محصول با چهار سال تجربه در تبدیل شناخت کاربران به تجربه‌های دیجیتال ساده و دسترس‌پذیر. مسلط به پژوهش، نمونه‌سازی و همکاری با تیم‌های فنی از ایده تا انتشار محصول.",
  },
  {
    id: "demo-3", groupId: "today", title: "A simple weekly meal plan", titleFa: "برنامه غذایی ساده برای هفته",
    promptEn: "Make a practical five-day meal plan with affordable ingredients and quick dinners.",
    promptFa: "یک برنامه غذایی کاربردی پنج‌روزه با مواد اولیه اقتصادی و شام‌های سریع پیشنهاد بده.",
    answerEn: "Try lentil soup, chicken and rice bowls, veggie omelets, bean wraps, and a one-pan pasta. Prep grains and wash vegetables once at the start of the week to make each dinner faster.",
    answerFa: "سوپ عدس، کاسه مرغ و برنج، املت سبزیجات، لقمه لوبیا و پاستای یک‌قابلمه‌ای را امتحان کن. اول هفته غلات را بپز و سبزیجات را بشوی تا آماده‌کردن شام‌ها سریع‌تر شود.",
  },
  {
    id: "demo-4", groupId: "today", title: "Fix a Python API error", titleFa: "رفع خطای API در پایتون",
    promptEn: "My Python request returns a 401 error. What should I check first?",
    promptFa: "درخواست پایتون من خطای ۴۰۱ می‌دهد. اول چه چیزهایی را بررسی کنم؟",
    answerEn: "A 401 usually means the request is not authenticated. Check that the API key is present, unexpired, and sent in the header format required by the service. Avoid printing the key in logs; inspect the response body for a more specific message.",
    answerFa: "خطای ۴۰۱ معمولاً یعنی احراز هویت درخواست انجام نشده است. وجود و اعتبار کلید API و قالب ارسال آن در هدر را بررسی کن. کلید را در گزارش‌ها چاپ نکن و متن پاسخ سرور را برای جزئیات بیشتر ببین.",
  },
  {
    id: "demo-5", groupId: "today", title: "Launch copy for a new app", titleFa: "متن معرفی برای انتشار اپلیکیشن",
    promptEn: "Write a friendly launch announcement for a habit-tracking app that helps people build routines gently.",
    promptFa: "یک متن صمیمی برای معرفی اپ پیگیری عادت‌ها بنویس که به ساختن آرام و پیوسته روتین کمک می‌کند.",
    answerEn: "Small steps count. Meet a calmer way to build habits, track your progress, and make room for routines that fit real life. Your next good day can start with one tiny action.",
    answerFa: "قدم‌های کوچک هم مهم‌اند. با راهی آرام‌تر برای ساختن عادت‌ها، دیدن پیشرفت و پیدا کردن روتین‌های مناسب زندگی واقعی آشنا شو. روز خوب بعدی می‌تواند با یک کار کوچک شروع شود.",
  },
  {
    id: "demo-6", groupId: "week", title: "Prepare for the IELTS speaking test", titleFa: "آمادگی برای بخش گفتاری آیلتس",
    promptEn: "Give me a one-week practice plan for the IELTS speaking test, about 30 minutes a day.",
    promptFa: "برای یک هفته، روزی حدود ۳۰ دقیقه برنامه تمرین بخش گفتاری آیلتس بده.",
    answerEn: "Spend three days recording Part 2 answers, two days practicing follow-up questions, and one day on a timed mock test. Use the last day to review repeated grammar and pronunciation issues, not to memorize scripts.",
    answerFa: "سه روز پاسخ‌های بخش دوم را ضبط کن، دو روز پرسش‌های تکمیلی را تمرین کن و یک روز آزمون زمان‌دار بگیر. روز آخر را به مرور ایرادهای پرتکرار گرامر و تلفظ اختصاص بده، نه حفظ‌کردن متن.",
  },
  {
    id: "demo-7", groupId: "week", title: "Summarize meeting notes", titleFa: "خلاصه‌کردن یادداشت‌های جلسه",
    promptEn: "Turn these meeting notes into decisions, owners, and next steps for the team.",
    promptFa: "این یادداشت‌های جلسه را به تصمیم‌ها، مسئول هر کار و قدم‌های بعدی تبدیل کن.",
    answerEn: "A useful recap separates what the team decided from what still needs discussion. List each action with one owner and a due date, then call out open questions so they do not disappear between meetings.",
    answerFa: "خلاصه خوب، تصمیم‌های قطعی را از موضوعات نیازمند گفت‌وگو جدا می‌کند. برای هر اقدام یک مسئول و مهلت مشخص بنویس و پرسش‌های باز را جداگانه بیاور تا بین جلسه‌ها فراموش نشوند.",
  },
  {
    id: "demo-8", groupId: "week", title: "Create a visual identity brief", titleFa: "نوشتن بریف هویت بصری",
    promptEn: "What should I include in a short visual identity brief for a neighborhood coffee shop?",
    promptFa: "برای یک کافه محلی، در یک بریف کوتاه هویت بصری چه چیزهایی بیاورم؟",
    answerEn: "Describe the café’s story, its regular customers, and the feeling you want people to remember. Add practical uses such as signage, cups, and social posts, plus a few visual references and clear constraints.",
    answerFa: "داستان کافه، مشتریان همیشگی و حسی را که می‌خواهی در ذهن بماند توضیح بده. کاربردها مثل تابلو، لیوان و شبکه‌های اجتماعی را بنویس و چند مرجع تصویری و محدودیت روشن اضافه کن.",
  },
  {
    id: "demo-9", groupId: "archive", title: "Understand my monthly expenses", titleFa: "بررسی هزینه‌های ماهانه",
    promptEn: "How can I organize monthly expenses to spot subscriptions and unnecessary spending?",
    promptFa: "چطور هزینه‌های ماهانه را مرتب کنم تا اشتراک‌ها و خرج‌های غیرضروری را پیدا کنم؟",
    answerEn: "Group transactions into housing, essentials, transport, subscriptions, and flexible spending. Compare the last three months, flag recurring charges you no longer use, and set a small review reminder before each renewal date.",
    answerFa: "تراکنش‌ها را در دسته‌های مسکن، ضروریات، رفت‌وآمد، اشتراک‌ها و هزینه‌های متغیر مرتب کن. سه ماه اخیر را مقایسه کن، پرداخت‌های تکراری بلااستفاده را مشخص کن و پیش از تمدید هر اشتراک یادآوری بگذار.",
  },
  {
    id: "demo-10", groupId: "archive", title: "Write a polite follow-up email", titleFa: "نوشتن ایمیل پیگیری مؤدبانه",
    promptEn: "Draft a polite follow-up email after a job interview when I have not heard back in a week.",
    promptFa: "یک ایمیل پیگیری مؤدبانه برای یک هفته بعد از مصاحبه کاری بنویس؛ هنوز پاسخی نگرفته‌ام.",
    answerEn: "Hello, I hope you’re doing well. I’m following up on my interview for the role last week and remain very interested in the opportunity. Please let me know if I can provide anything else. Thank you for your time.",
    answerFa: "سلام، امیدوارم حالتان خوب باشد. برای پیگیری مصاحبه هفته گذشته درباره این موقعیت پیام می‌دهم و همچنان به فرصت همکاری علاقه‌مندم. اگر اطلاعات دیگری لازم است خوشحال می‌شوم بفرستم. از وقتی که گذاشتید سپاسگزارم.",
  },
];

export const chatGroups: ChatGroup[] = [
  {
    id: "pinned",
    label: "Pinned",
    chats: [{ id: "1", title: "AI dashboard design" }, ...demoChats.filter((chat) => chat.groupId === "pinned")],
  },
  {
    id: "today",
    label: "Today",
    chats: [
      { id: "2", title: "Design ideas review" },
      { id: "3", title: "Website content creation" },
      { id: "4", title: "User data analysis" },
      ...demoChats.filter((chat) => chat.groupId === "today"),
    ],
  },
  {
    id: "week",
    label: "Previous 7 days",
    chats: [{ id: "5", title: "Ad campaign ideas" }, ...demoChats.filter((chat) => chat.groupId === "week")],
  },
  { id: "archive", label: "Archived", chats: demoChats.filter((chat) => chat.groupId === "archive") },
];

export const user = {
  name: "matin zeinali",
  plan: "Free plan",
};
