import type { LanguagePreference } from "@/types/finance";

export interface UserGuideSection {
  id: string;
  stage: string;
  title: string;
  summary: string;
  steps: string[];
  ctaLabel: string;
  ctaHref: string;
}

export interface UserGuideContent {
  eyebrow: string;
  title: string;
  description: string;
  languageLabel: string;
  progressLabel: string;
  checklistTitle: string;
  checklistDescription: string;
  checklistItems: string[];
  lockedTitle: string;
  lockedDescription: string;
  sections: UserGuideSection[];
}

const guideContent: Record<LanguagePreference, UserGuideContent> = {
  en: {
    eyebrow: "User guide",
    title: "Learn Moneger step by step",
    description:
      "Follow this guided path to complete your setup, understand the dashboard, record transactions, manage obligations, and keep your workspace private.",
    languageLabel: "Guide language",
    progressLabel: "Learning path",
    checklistTitle: "What you will learn",
    checklistDescription: "These are the five areas every new user should understand before using the full workspace daily.",
    checklistItems: [
      "Complete your required profile and choose your preferences.",
      "Read dashboard totals, reminders, and the live exchange-rate card.",
      "Capture income and expenses with the right currency.",
      "Track debts, money owed, and bank accounts in one place.",
      "Use settings, privacy controls, and local-first storage correctly."
    ],
    lockedTitle: "Finish profile setup to unlock the full workspace",
    lockedDescription: "You can read this guide now, but the rest of the app stays locked until your required profile fields are completed.",
    sections: [
      {
        id: "setup",
        stage: "Step 1",
        title: "Set up your profile and preferences",
        summary: "Start by completing your profile, then confirm language and currency preferences so the rest of the workspace matches you.",
        steps: [
          "Open Complete Profile and fill in your name, contact number, occupation, gender, marital status, and location.",
          "Upload a profile photo if you want a personalized workspace identity in the sidebar.",
          "Choose your base currency and optional comparing currency in Settings after onboarding."
        ],
        ctaLabel: "Complete profile",
        ctaHref: "/welcome"
      },
      {
        id: "dashboard",
        stage: "Step 2",
        title: "Understand the dashboard",
        summary: "The dashboard is your financial command center. Core totals are calculated in USD, then projected into your base currency.",
        steps: [
          "Review total income, expenses, debt, money owed, and net balance cards at the top.",
          "Use the live FX card in the top-right to compare your base currency against the comparing currency.",
          "Scroll down to read monthly trends, expense categories, liability charts, reminders, and recent activity."
        ],
        ctaLabel: "Open dashboard",
        ctaHref: "/dashboard"
      },
      {
        id: "records",
        stage: "Step 3",
        title: "Add income and expenses correctly",
        summary: "Income and expense entries power the dashboard, charts, and budget understanding, so enter them consistently.",
        steps: [
          "Create income records for salary, business, freelance, rental, or one-time money you receive.",
          "Create expense records with a merchant or source, category, amount, date, and note.",
          "Use the correct record currency. Moneger converts everything through USD for reliable totals."
        ],
        ctaLabel: "Add income",
        ctaHref: "/income"
      },
      {
        id: "obligations",
        stage: "Step 4",
        title: "Manage debts, money owed, and banks",
        summary: "These sections keep obligations visible so you do not lose track of what you owe or what others owe you.",
        steps: [
          "Use Debts to track creditors, settlement dates, statuses, and overdue exposure.",
          "Use Money Owed to record amounts others must return to you, with follow-up visibility.",
          "Add bank accounts to represent the institutions or wallets you actively use."
        ],
        ctaLabel: "Open debts",
        ctaHref: "/debts"
      },
      {
        id: "settings",
        stage: "Step 5",
        title: "Control language, privacy, and workspace behavior",
        summary: "Settings is where you decide how the app looks, what language it uses, and how local storage behaves.",
        steps: [
          "Profile Settings lets you update your identity details and photo later.",
          "Currency, language, app, privacy, and workspace sections control how the app behaves for your account.",
          "Remember that finance records stay local-first in IndexedDB unless you explicitly enable optional sync."
        ],
        ctaLabel: "Open settings",
        ctaHref: "/settings"
      }
    ]
  },
  bn: {
    eyebrow: "ব্যবহার নির্দেশিকা",
    title: "ধাপে ধাপে Moneger শিখুন",
    description:
      "এই গাইড অনুসরণ করে প্রোফাইল সম্পন্ন করুন, ড্যাশবোর্ড বুঝুন, লেনদেন যোগ করুন, দেনা-পাওনা পরিচালনা করুন এবং আপনার ডেটা সুরক্ষিত রাখুন।",
    languageLabel: "গাইডের ভাষা",
    progressLabel: "শেখার ধাপ",
    checklistTitle: "আপনি যা শিখবেন",
    checklistDescription: "নিয়মিত ব্যবহারের আগে প্রতিটি নতুন ব্যবহারকারীর এই পাঁচটি অংশ জানা দরকার।",
    checklistItems: [
      "প্রয়োজনীয় প্রোফাইল পূরণ করে নিজের পছন্দ ঠিক করুন।",
      "ড্যাশবোর্ডের মোট হিসাব, রিমাইন্ডার এবং লাইভ এক্সচেঞ্জ কার্ড বুঝুন।",
      "সঠিক মুদ্রায় আয় ও খরচ সংরক্ষণ করুন।",
      "দেনা, পাওনা এবং ব্যাংক হিসাব এক জায়গায় ট্র্যাক করুন।",
      "সেটিংস, প্রাইভেসি কন্ট্রোল এবং লোকাল-ফার্স্ট স্টোরেজ সঠিকভাবে ব্যবহার করুন।"
    ],
    lockedTitle: "পুরো অ্যাপ আনলক করতে আগে প্রোফাইল সম্পূর্ণ করুন",
    lockedDescription: "আপনি এখন গাইডটি পড়তে পারবেন, কিন্তু প্রোফাইলের প্রয়োজনীয় তথ্য পূরণ না করা পর্যন্ত বাকি অংশ লক থাকবে।",
    sections: [
      {
        id: "setup",
        stage: "ধাপ ১",
        title: "প্রোফাইল ও পছন্দ সেট করুন",
        summary: "প্রথমে প্রোফাইল পূরণ করুন, তারপর ভাষা ও মুদ্রার পছন্দ ঠিক করুন যাতে পুরো ওয়ার্কস্পেস আপনার মতো কাজ করে।",
        steps: [
          "Complete Profile খুলে নাম, ফোন নম্বর, পেশা, লিঙ্গ, বৈবাহিক অবস্থা এবং অবস্থান লিখুন।",
          "চাইলে প্রোফাইল ছবি আপলোড করুন, যাতে সাইডবারে আপনার পরিচয় স্পষ্ট দেখা যায়।",
          "অনবোর্ডিং শেষ হলে Settings থেকে Base Currency এবং Comparing Currency ঠিক করুন।"
        ],
        ctaLabel: "প্রোফাইল সম্পূর্ণ করুন",
        ctaHref: "/welcome"
      },
      {
        id: "dashboard",
        stage: "ধাপ ২",
        title: "ড্যাশবোর্ড বুঝে নিন",
        summary: "ড্যাশবোর্ড হলো আপনার আর্থিক কমান্ড সেন্টার। মূল হিসাব USD-তে হয়, পরে আপনার বেস কারেন্সিতে দেখানো হয়।",
        steps: [
          "উপরে থাকা মোট আয়, মোট খরচ, দেনা, পাওনা এবং নেট ব্যালেন্স কার্ড দেখুন।",
          "ডান উপরের লাইভ FX কার্ডে বেস ও কম্পেয়ারিং কারেন্সির তুলনা দেখুন।",
          "নিচে স্ক্রল করে ট্রেন্ড, ক্যাটাগরি চার্ট, দায়, রিমাইন্ডার এবং সাম্প্রতিক কার্যক্রম দেখুন।"
        ],
        ctaLabel: "ড্যাশবোর্ড খুলুন",
        ctaHref: "/dashboard"
      },
      {
        id: "records",
        stage: "ধাপ ৩",
        title: "সঠিকভাবে আয় ও খরচ যোগ করুন",
        summary: "আয় ও খরচের এন্ট্রি ড্যাশবোর্ড ও চার্ট তৈরি করে, তাই নিয়মিত ও সঠিক তথ্য দিন।",
        steps: [
          "Salary, Business, Freelance, Rental অথবা One-time আয়ের জন্য income record তৈরি করুন।",
          "খরচ যোগ করার সময় merchant বা source, category, amount, date এবং note লিখুন।",
          "সঠিক মুদ্রা নির্বাচন করুন। নির্ভুল মোটের জন্য Moneger সব হিসাব USD হয়ে রূপান্তর করে।"
        ],
        ctaLabel: "আয় যোগ করুন",
        ctaHref: "/income"
      },
      {
        id: "obligations",
        stage: "ধাপ ৪",
        title: "দেনা, পাওনা ও ব্যাংক ম্যানেজ করুন",
        summary: "এই অংশগুলো আপনাকে কী দিতে হবে এবং কে আপনাকে কত দেবে তা পরিষ্কারভাবে দেখায়।",
        steps: [
          "Debts সেকশনে creditor, settlement date, status এবং overdue অবস্থা ট্র্যাক করুন।",
          "Money Owed সেকশনে অন্যরা আপনাকে যে টাকা ফেরত দেবে তা লিখে রাখুন।",
          "ব্যবহৃত ব্যাংক বা ওয়ালেট অ্যাকাউন্টগুলো Banks সেকশনে যোগ করুন।"
        ],
        ctaLabel: "দেনা দেখুন",
        ctaHref: "/debts"
      },
      {
        id: "settings",
        stage: "ধাপ ৫",
        title: "ভাষা, প্রাইভেসি ও অ্যাপ আচরণ নিয়ন্ত্রণ করুন",
        summary: "Settings থেকেই আপনি ঠিক করবেন অ্যাপ কেমন দেখাবে, কোন ভাষায় চলবে এবং ডেটা কীভাবে থাকবে।",
        steps: [
          "Profile Settings থেকে পরে আপনার তথ্য ও ছবি বদলাতে পারবেন।",
          "Currency, Language, App, Privacy ও Workspace সেকশন দিয়ে অ্যাকাউন্টভিত্তিক আচরণ নিয়ন্ত্রণ করুন।",
          "মনে রাখবেন, আপনি আলাদা করে sync চালু না করা পর্যন্ত আর্থিক রেকর্ড লোকাল IndexedDB-তেই থাকে।"
        ],
        ctaLabel: "সেটিংস খুলুন",
        ctaHref: "/settings"
      }
    ]
  },
  hi: {
    eyebrow: "उपयोगकर्ता गाइड",
    title: "Moneger को चरण दर चरण सीखें",
    description:
      "इस गाइड का पालन करके प्रोफ़ाइल पूरा करें, डैशबोर्ड समझें, रिकॉर्ड जोड़ें, देनदारियां संभालें और अपने डेटा को सुरक्षित रखें।",
    languageLabel: "गाइड भाषा",
    progressLabel: "सीखने का मार्ग",
    checklistTitle: "आप क्या सीखेंगे",
    checklistDescription: "पूरे ऐप का नियमित उपयोग शुरू करने से पहले हर नए उपयोगकर्ता को इन पाँच हिस्सों को समझना चाहिए।",
    checklistItems: [
      "ज़रूरी प्रोफ़ाइल पूरा करें और अपनी प्राथमिकताएँ सेट करें।",
      "डैशबोर्ड के कुल, रिमाइंडर और लाइव एक्सचेंज कार्ड को समझें।",
      "सही मुद्रा के साथ आय और खर्च दर्ज करें।",
      "कर्ज, आप पर बकाया और बैंक खातों को एक जगह ट्रैक करें।",
      "सेटिंग्स, प्राइवेसी नियंत्रण और लोकल-फर्स्ट स्टोरेज का सही उपयोग करें।"
    ],
    lockedTitle: "पूरा वर्कस्पेस खोलने के लिए पहले प्रोफ़ाइल पूरा करें",
    lockedDescription: "आप यह गाइड अभी पढ़ सकते हैं, लेकिन आवश्यक प्रोफ़ाइल फ़ील्ड पूरे होने तक बाकी ऐप लॉक रहेगा।",
    sections: [
      {
        id: "setup",
        stage: "चरण 1",
        title: "प्रोफ़ाइल और प्राथमिकताएँ सेट करें",
        summary: "सबसे पहले प्रोफ़ाइल पूरा करें, फिर भाषा और मुद्रा चुनें ताकि पूरा वर्कस्पेस आपकी पसंद के अनुसार चले।",
        steps: [
          "Complete Profile खोलें और नाम, संपर्क नंबर, पेशा, लिंग, वैवाहिक स्थिति और स्थान भरें।",
          "यदि चाहें तो प्रोफ़ाइल फोटो अपलोड करें ताकि साइडबार में आपकी पहचान स्पष्ट दिखे।",
          "ऑनबोर्डिंग के बाद Settings में Base Currency और Comparing Currency चुनें।"
        ],
        ctaLabel: "प्रोफ़ाइल पूरा करें",
        ctaHref: "/welcome"
      },
      {
        id: "dashboard",
        stage: "चरण 2",
        title: "डैशबोर्ड को समझें",
        summary: "डैशबोर्ड आपका वित्तीय कंट्रोल सेंटर है। मुख्य गणनाएँ USD में होती हैं, फिर आपकी बेस करेंसी में दिखाई जाती हैं।",
        steps: [
          "ऊपर कुल आय, कुल खर्च, कर्ज, बकाया राशि और नेट बैलेंस कार्ड देखें।",
          "ऊपर दाईं ओर लाइव FX कार्ड में बेस और तुलना करेंसी का रेट देखें।",
          "नीचे जाकर ट्रेंड, श्रेणियाँ, देनदारी, रिमाइंडर और हाल की गतिविधि देखें।"
        ],
        ctaLabel: "डैशबोर्ड खोलें",
        ctaHref: "/dashboard"
      },
      {
        id: "records",
        stage: "चरण 3",
        title: "आय और खर्च सही तरह से जोड़ें",
        summary: "आय और खर्च की एंट्रियाँ डैशबोर्ड और चार्ट बनाती हैं, इसलिए इन्हें लगातार और सही तरीके से दर्ज करें।",
        steps: [
          "Salary, Business, Freelance, Rental या One-time रकम के लिए income record बनाएं।",
          "खर्च दर्ज करते समय merchant या source, category, amount, date और note भरें।",
          "सही मुद्रा चुनें। भरोसेमंद कुल के लिए Moneger हर रिकॉर्ड को पहले USD में सामान्यीकृत करता है।"
        ],
        ctaLabel: "आय जोड़ें",
        ctaHref: "/income"
      },
      {
        id: "obligations",
        stage: "चरण 4",
        title: "कर्ज, आप पर बकाया और बैंक संभालें",
        summary: "ये सेक्शन आपको साफ दिखाते हैं कि आपको क्या चुकाना है और कौन आपको कितना लौटाएगा।",
        steps: [
          "Debts में creditor, settlement date, status और overdue स्थिति ट्रैक करें।",
          "Money Owed में वे रकम दर्ज करें जो दूसरे लोग आपको लौटाने वाले हैं।",
          "Banks में अपने सक्रिय बैंक या वॉलेट खाते जोड़ें।"
        ],
        ctaLabel: "कर्ज देखें",
        ctaHref: "/debts"
      },
      {
        id: "settings",
        stage: "चरण 5",
        title: "भाषा, प्राइवेसी और ऐप व्यवहार नियंत्रित करें",
        summary: "Settings में आप तय करते हैं कि ऐप कैसा दिखेगा, कौन सी भाषा उपयोग करेगा और आपका डेटा कैसे रहेगा।",
        steps: [
          "Profile Settings से बाद में अपनी पहचान संबंधी जानकारी और फोटो अपडेट कर सकते हैं।",
          "Currency, Language, App, Privacy और Workspace सेक्शन आपके अकाउंट का व्यवहार नियंत्रित करते हैं।",
          "याद रखें, जब तक आप स्वयं sync चालू नहीं करते, वित्तीय रिकॉर्ड IndexedDB में लोकल ही रहते हैं।"
        ],
        ctaLabel: "सेटिंग्स खोलें",
        ctaHref: "/settings"
      }
    ]
  },
  ur: {
    eyebrow: "یوزر گائیڈ",
    title: "Moneger کو مرحلہ وار سیکھیں",
    description:
      "اس گائیڈ کے ذریعے پروفائل مکمل کریں، ڈیش بورڈ سمجھیں، ریکارڈ شامل کریں، قرض اور واجبات سنبھالیں، اور اپنے ڈیٹا کو محفوظ رکھیں۔",
    languageLabel: "گائیڈ کی زبان",
    progressLabel: "سیکھنے کا راستہ",
    checklistTitle: "آپ کیا سیکھیں گے",
    checklistDescription: "روزمرہ استعمال شروع کرنے سے پہلے ہر نئے صارف کو یہ پانچ حصے سمجھ لینے چاہئیں۔",
    checklistItems: [
      "ضروری پروفائل مکمل کریں اور اپنی ترجیحات سیٹ کریں۔",
      "ڈیش بورڈ کے مجموعی اعداد، یاد دہانیاں اور لائیو ایکسچینج کارڈ سمجھیں۔",
      "درست کرنسی کے ساتھ آمدن اور خرچ درج کریں۔",
      "قرض، وصولی اور بینک اکاؤنٹس ایک جگہ ٹریک کریں۔",
      "سیٹنگز، پرائیویسی کنٹرولز اور لوکل فرسٹ اسٹوریج صحیح طرح استعمال کریں۔"
    ],
    lockedTitle: "پورا ورک اسپیس کھولنے کے لئے پہلے پروفائل مکمل کریں",
    lockedDescription: "آپ یہ گائیڈ ابھی پڑھ سکتے ہیں، لیکن ضروری پروفائل معلومات مکمل ہونے تک باقی ایپ بند رہے گی۔",
    sections: [
      {
        id: "setup",
        stage: "مرحلہ 1",
        title: "پروفائل اور ترجیحات سیٹ کریں",
        summary: "سب سے پہلے پروفائل مکمل کریں، پھر زبان اور کرنسی کا انتخاب کریں تاکہ پورا ورک اسپیس آپ کے مطابق ہو۔",
        steps: [
          "Complete Profile میں نام، رابطہ نمبر، پیشہ، جنس، ازدواجی حیثیت اور مقام درج کریں۔",
          "اگر چاہیں تو پروفائل تصویر اپ لوڈ کریں تاکہ سائیڈبار میں آپ کی شناخت واضح ہو۔",
          "آن بورڈنگ کے بعد Settings میں Base Currency اور Comparing Currency منتخب کریں۔"
        ],
        ctaLabel: "پروفائل مکمل کریں",
        ctaHref: "/welcome"
      },
      {
        id: "dashboard",
        stage: "مرحلہ 2",
        title: "ڈیش بورڈ کو سمجھیں",
        summary: "ڈیش بورڈ آپ کا مالی کنٹرول سینٹر ہے۔ بنیادی حساب USD میں ہوتا ہے، پھر آپ کی base currency میں دکھایا جاتا ہے۔",
        steps: [
          "اوپر total income، expenses، debt، money owed اور net balance cards دیکھیں۔",
          "اوپر دائیں جانب live FX card میں base اور comparison currency کا ریٹ دیکھیں۔",
          "نیچے trends، category charts، liabilities، reminders اور recent activity دیکھیں۔"
        ],
        ctaLabel: "ڈیش بورڈ کھولیں",
        ctaHref: "/dashboard"
      },
      {
        id: "records",
        stage: "مرحلہ 3",
        title: "آمدن اور خرچ درست طریقے سے شامل کریں",
        summary: "آمدن اور خرچ کی entries ڈیش بورڈ اور charts بناتی ہیں، اس لئے انہیں باقاعدگی اور درستگی سے درج کریں۔",
        steps: [
          "Salary، Business، Freelance، Rental یا One-time رقم کے لئے income record بنائیں۔",
          "Expense شامل کرتے وقت merchant یا source، category، amount، date اور note درج کریں۔",
          "صحیح کرنسی منتخب کریں۔ درست totals کے لئے Moneger ہر record کو پہلے USD میں normalise کرتا ہے۔"
        ],
        ctaLabel: "آمدن شامل کریں",
        ctaHref: "/income"
      },
      {
        id: "obligations",
        stage: "مرحلہ 4",
        title: "قرض، وصولی اور بینک سنبھالیں",
        summary: "یہ حصے صاف دکھاتے ہیں کہ آپ کو کیا ادا کرنا ہے اور کون آپ کو کیا واپس کرے گا۔",
        steps: [
          "Debts میں creditor، settlement date، status اور overdue exposure ٹریک کریں۔",
          "Money Owed میں وہ رقوم درج کریں جو دوسروں نے آپ کو واپس کرنی ہیں۔",
          "Banks میں اپنے active bank یا wallet accounts شامل کریں۔"
        ],
        ctaLabel: "قرض دیکھیں",
        ctaHref: "/debts"
      },
      {
        id: "settings",
        stage: "مرحلہ 5",
        title: "زبان، پرائیویسی اور ایپ رویہ کنٹرول کریں",
        summary: "Settings میں آپ طے کرتے ہیں کہ ایپ کی زبان کیا ہوگی، شکل کیسی ہوگی، اور ڈیٹا کیسے محفوظ ہوگا۔",
        steps: [
          "Profile Settings سے بعد میں اپنی معلومات اور تصویر اپ ڈیٹ کر سکتے ہیں۔",
          "Currency، Language، App، Privacy اور Workspace sections آپ کے اکاؤنٹ کا رویہ کنٹرول کرتے ہیں۔",
          "یاد رکھیں، جب تک آپ خود sync آن نہیں کرتے، مالی records IndexedDB میں local رہتے ہیں۔"
        ],
        ctaLabel: "سیٹنگز کھولیں",
        ctaHref: "/settings"
      }
    ]
  },
  ar: {
    eyebrow: "دليل الاستخدام",
    title: "تعلّم Moneger خطوة بخطوة",
    description:
      "اتبع هذا الدليل لإكمال الملف الشخصي وفهم لوحة التحكم وإضافة السجلات وإدارة الديون وحماية بياناتك.",
    languageLabel: "لغة الدليل",
    progressLabel: "مسار التعلّم",
    checklistTitle: "ماذا ستتعلّم",
    checklistDescription: "هذه هي الأجزاء الخمسة التي يجب أن يفهمها كل مستخدم جديد قبل استخدام التطبيق بشكل يومي.",
    checklistItems: [
      "أكمل الملف الشخصي الإلزامي واضبط تفضيلاتك.",
      "افهم الإجماليات والتنبيهات وبطاقة سعر الصرف المباشر في لوحة التحكم.",
      "أضف الدخل والمصروفات بالعملة الصحيحة.",
      "تابع الديون والمبالغ المستحقة لك والحسابات البنكية في مكان واحد.",
      "استخدم الإعدادات والخصوصية والتخزين المحلي بشكل صحيح."
    ],
    lockedTitle: "أكمل ملفك الشخصي أولاً لفتح كامل مساحة العمل",
    lockedDescription: "يمكنك قراءة هذا الدليل الآن، لكن بقية التطبيق ستظل مقفلة حتى تُكمل حقول الملف الشخصي المطلوبة.",
    sections: [
      {
        id: "setup",
        stage: "الخطوة 1",
        title: "إعداد الملف الشخصي والتفضيلات",
        summary: "ابدأ بإكمال ملفك الشخصي، ثم اختر اللغة والعملات حتى تتوافق مساحة العمل مع تفضيلاتك.",
        steps: [
          "افتح Complete Profile وأدخل الاسم ورقم الاتصال والمهنة والجنس والحالة الاجتماعية والموقع.",
          "ارفع صورة شخصية إذا أردت هوية مرئية داخل الشريط الجانبي.",
          "بعد إنهاء الإعداد الأولي اختر العملة الأساسية وعملة المقارنة من الإعدادات."
        ],
        ctaLabel: "أكمل الملف الشخصي",
        ctaHref: "/welcome"
      },
      {
        id: "dashboard",
        stage: "الخطوة 2",
        title: "فهم لوحة التحكم",
        summary: "لوحة التحكم هي مركز القيادة المالي لديك. الحسابات الأساسية تتم بالدولار الأمريكي ثم تُعرض بعملتك الأساسية.",
        steps: [
          "راجع بطاقات إجمالي الدخل والمصروفات والديون والمبالغ المستحقة لك وصافي الرصيد.",
          "استخدم بطاقة FX المباشرة في أعلى اليمين لمقارنة عملتك الأساسية بعملة المقارنة.",
          "مرر لأسفل لرؤية الاتجاهات والرسوم والفئات والتنبيهات والنشاط الأخير."
        ],
        ctaLabel: "افتح لوحة التحكم",
        ctaHref: "/dashboard"
      },
      {
        id: "records",
        stage: "الخطوة 3",
        title: "إضافة الدخل والمصروفات بشكل صحيح",
        summary: "سجلات الدخل والمصروفات تبني الرسوم والإجماليات، لذلك يجب إدخالها بشكل منظم ودقيق.",
        steps: [
          "أنشئ سجل دخل للراتب أو العمل أو المشاريع الحرة أو الإيجار أو أي مبلغ لمرة واحدة.",
          "أنشئ سجل مصروف مع التاجر أو المصدر والفئة والمبلغ والتاريخ والملاحظة.",
          "اختر العملة الصحيحة لأن Moneger يحول كل شيء عبر الدولار للحصول على نتائج موثوقة."
        ],
        ctaLabel: "أضف دخلاً",
        ctaHref: "/income"
      },
      {
        id: "obligations",
        stage: "الخطوة 4",
        title: "إدارة الديون والمبالغ المستحقة والبنوك",
        summary: "هذه الأقسام تجعل الالتزامات واضحة حتى لا تفقد رؤية ما عليك وما لك.",
        steps: [
          "استخدم قسم Debts لتتبع الدائنين وتواريخ السداد والحالة والتأخير.",
          "استخدم قسم Money Owed لتسجيل الأموال التي يجب أن تعود إليك.",
          "أضف حساباتك البنكية أو المحافظ التي تستخدمها فعلياً."
        ],
        ctaLabel: "افتح الديون",
        ctaHref: "/debts"
      },
      {
        id: "settings",
        stage: "الخطوة 5",
        title: "التحكم في اللغة والخصوصية وسلوك التطبيق",
        summary: "في Settings تحدد شكل التطبيق ولغته وكيفية حفظ بياناتك.",
        steps: [
          "يمكنك لاحقاً تعديل بياناتك وصورتك من Profile Settings.",
          "أقسام Currency وLanguage وApp وPrivacy وWorkspace تتحكم في إعدادات حسابك.",
          "تذكّر أن البيانات المالية تبقى محلية في IndexedDB ما لم تفعل المزامنة اختيارياً."
        ],
        ctaLabel: "افتح الإعدادات",
        ctaHref: "/settings"
      }
    ]
  },
  ru: {
    eyebrow: "Руководство",
    title: "Изучите Moneger шаг за шагом",
    description:
      "Следуйте этому руководству, чтобы завершить профиль, понять панель управления, добавить записи, управлять долгами и сохранить данные под контролем.",
    languageLabel: "Язык руководства",
    progressLabel: "Маршрут обучения",
    checklistTitle: "Что вы изучите",
    checklistDescription: "Эти пять областей должен понять каждый новый пользователь перед регулярной работой в приложении.",
    checklistItems: [
      "Заполните обязательный профиль и настройте предпочтения.",
      "Поймите итоги, напоминания и карточку живого курса на панели.",
      "Добавляйте доходы и расходы в нужной валюте.",
      "Следите за долгами, суммами к возврату и банковскими счетами в одном месте.",
      "Правильно используйте настройки, приватность и локальное хранение."
    ],
    lockedTitle: "Сначала завершите профиль, чтобы открыть весь рабочий раздел",
    lockedDescription: "Вы можете читать это руководство уже сейчас, но остальная часть приложения будет закрыта, пока обязательный профиль не завершён.",
    sections: [
      {
        id: "setup",
        stage: "Шаг 1",
        title: "Настройте профиль и предпочтения",
        summary: "Сначала заполните профиль, затем выберите язык и валюты, чтобы рабочее пространство соответствовало вам.",
        steps: [
          "Откройте Complete Profile и заполните имя, контактный номер, профессию, пол, семейное положение и местоположение.",
          "При желании загрузите фото профиля для более персонализированного интерфейса.",
          "После онбординга выберите базовую валюту и валюту сравнения в Settings."
        ],
        ctaLabel: "Заполнить профиль",
        ctaHref: "/welcome"
      },
      {
        id: "dashboard",
        stage: "Шаг 2",
        title: "Поймите панель управления",
        summary: "Панель управления - это ваш финансовый центр. Основные расчёты идут в USD, затем отображаются в вашей базовой валюте.",
        steps: [
          "Просмотрите карточки дохода, расходов, долгов, сумм к возврату и чистого баланса.",
          "Используйте живую FX-карточку справа сверху для сравнения базовой и второй валюты.",
          "Ниже изучите тренды, категории, обязательства, напоминания и недавнюю активность."
        ],
        ctaLabel: "Открыть панель",
        ctaHref: "/dashboard"
      },
      {
        id: "records",
        stage: "Шаг 3",
        title: "Корректно добавляйте доходы и расходы",
        summary: "Доходы и расходы формируют графики и итоги, поэтому вводите их регулярно и аккуратно.",
        steps: [
          "Создавайте доходы для зарплаты, бизнеса, фриланса, аренды или разовых поступлений.",
          "Добавляйте расходы с указанием источника, категории, суммы, даты и заметки.",
          "Выбирайте правильную валюту. Moneger сначала нормализует всё через USD."
        ],
        ctaLabel: "Добавить доход",
        ctaHref: "/income"
      },
      {
        id: "obligations",
        stage: "Шаг 4",
        title: "Управляйте долгами, суммами к возврату и банками",
        summary: "Эти разделы помогают не терять из виду, что должны вы и что должны вам.",
        steps: [
          "Используйте Debts для кредиторов, сроков, статусов и просрочек.",
          "Используйте Money Owed для сумм, которые другие должны вернуть вам.",
          "Добавляйте банки и кошельки, которыми вы реально пользуетесь."
        ],
        ctaLabel: "Открыть долги",
        ctaHref: "/debts"
      },
      {
        id: "settings",
        stage: "Шаг 5",
        title: "Управляйте языком, приватностью и поведением приложения",
        summary: "В Settings вы определяете внешний вид приложения, язык и способ работы с данными.",
        steps: [
          "Позже вы сможете обновить данные профиля и фото в Profile Settings.",
          "Разделы Currency, Language, App, Privacy и Workspace управляют поведением вашего аккаунта.",
          "Помните: финансовые записи остаются локальными в IndexedDB, пока вы сами не включите синхронизацию."
        ],
        ctaLabel: "Открыть настройки",
        ctaHref: "/settings"
      }
    ]
  },
  ky: {
    eyebrow: "Колдонмо жол көрсөткүчү",
    title: "Moneger'ди кадам сайын үйрөнүңүз",
    description:
      "Бул жол көрсөткүч аркылуу профилди бүтүрүп, панелди түшүнүп, жазууларды кошуп, карыздарды башкарып жана маалыматты коопсуз сактаңыз.",
    languageLabel: "Жол көрсөткүч тили",
    progressLabel: "Үйрөнүү жолу",
    checklistTitle: "Эмнени үйрөнөсүз",
    checklistDescription: "Колдонмону күн сайын колдонордон мурун ар бир жаңы колдонуучу ушул беш бөлүктү түшүнүшү керек.",
    checklistItems: [
      "Милдеттүү профилди бүтүрүп, каалоолоруңузду тандаңыз.",
      "Панелдеги жалпы көрсөткүчтөрдү, эскертмелерди жана жандуу курс картасын түшүнүңүз.",
      "Киреше жана чыгашаны туура валюта менен киргизиңиз.",
      "Карыздарды, сизге карыз акчаларды жана банк эсептерин бир жерден көзөмөлдөңүз.",
      "Орнотууларды, купуялуулукту жана жергиликтүү сактоону туура колдонуңуз."
    ],
    lockedTitle: "Толук иш мейкиндигин ачуу үчүн адегенде профилди бүтүрүңүз",
    lockedDescription: "Бул жол көрсөткүчтү азыр окуй аласыз, бирок милдеттүү профиль талаалары толмоюнча калган бөлүк кулпуланып турат.",
    sections: [
      {
        id: "setup",
        stage: "1-кадам",
        title: "Профилди жана каалоолорду орнотуңуз",
        summary: "Алгач профилди бүтүрүңүз, андан кийин тилди жана валюталарды тандаңыз.",
        steps: [
          "Complete Profile бөлүгүндө атыңызды, байланыш номериңизди, кесибиңизди, жынысыңызды, үй-бүлөлүк абалыңызды жана жайгашкан жериңизди толтуруңуз.",
          "Кааласаңыз профиль сүрөтүн жүктөп, каптал тилкени жекелештириңиз.",
          "Онбординг бүткөндөн кийин Settings ичинде base currency жана comparing currency тандаңыз."
        ],
        ctaLabel: "Профилди бүтүрүү",
        ctaHref: "/welcome"
      },
      {
        id: "dashboard",
        stage: "2-кадам",
        title: "Панелди түшүнүңүз",
        summary: "Бул сиздин каржы башкаруу борборуңуз. Негизги эсептөөлөр USD менен жүрүп, кийин base currency'де көрсөтүлөт.",
        steps: [
          "Жогорудагы total income, total expenses, debt, money owed жана net balance карталарын караңыз.",
          "Оң жогорку жактагы FX картасынан base жана comparing currency курсун көрүңүз.",
          "Төмөндө тренддерди, категорияларды, милдеттенмелерди, эскертмелерди жана акыркы аракеттерди текшериңиз."
        ],
        ctaLabel: "Панелди ачуу",
        ctaHref: "/dashboard"
      },
      {
        id: "records",
        stage: "3-кадам",
        title: "Киреше жана чыгашаны туура кошуңуз",
        summary: "Киреше жана чыгаша жазуулары панелди жана графиктерди түзөт, ошондуктан аларды так киргизиңиз.",
        steps: [
          "Salary, Business, Freelance, Rental же One-time акча үчүн income record түзүңүз.",
          "Expense кошкондо source, category, amount, date жана note толтуруңуз.",
          "Туура валютаны тандаңыз. Moneger ишенимдүү жыйынтык үчүн баарын USD аркылуу эсептейт."
        ],
        ctaLabel: "Киреше кошуу",
        ctaHref: "/income"
      },
      {
        id: "obligations",
        stage: "4-кадам",
        title: "Карызды, сизге тиешелүү акчаны жана банктарды башкарыңыз",
        summary: "Бул бөлүмдөр кимге төлөй турганыңызды жана ким сизге төлөшү керек экенин так көрсөтөт.",
        steps: [
          "Debts бөлүмүндө кредиторду, төлөө күнүн, статусун жана кечиктирүүнү көзөмөлдөңүз.",
          "Money Owed бөлүмүндө башкалар кайтарып бериши керек болгон акчаларды жазыңыз.",
          "Banks бөлүмүнө колдонгон банк же капчыктарды кошуңуз."
        ],
        ctaLabel: "Карыздарды ачуу",
        ctaHref: "/debts"
      },
      {
        id: "settings",
        stage: "5-кадам",
        title: "Тилди, купуялуулукту жана колдонмонун жүрүмүн башкарыңыз",
        summary: "Settings бөлүмүндө колдонмонун көрүнүшүн, тилин жана маалыматтын сакталуусун башкарасыз.",
        steps: [
          "Profile Settings аркылуу кийин жеке маалыматты жана сүрөттү өзгөртө аласыз.",
          "Currency, Language, App, Privacy жана Workspace бөлүмдөрү аккаунтуңузду башкарат.",
          "Эсиңизде болсун, sync'ти өзүңүз иштетмейинче финансылык жазуулар IndexedDB ичинде жергиликтүү калат."
        ],
        ctaLabel: "Орнотууларды ачуу",
        ctaHref: "/settings"
      }
    ]
  },
  fr: {
    eyebrow: "Guide utilisateur",
    title: "Apprenez Moneger pas a pas",
    description:
      "Suivez ce guide pour terminer votre profil, comprendre le tableau de bord, ajouter des enregistrements, gerer les obligations et garder vos donnees sous controle.",
    languageLabel: "Langue du guide",
    progressLabel: "Parcours d'apprentissage",
    checklistTitle: "Ce que vous allez apprendre",
    checklistDescription: "Ces cinq domaines doivent etre compris par chaque nouvel utilisateur avant une utilisation quotidienne complete.",
    checklistItems: [
      "Terminer le profil obligatoire et definir vos preferences.",
      "Comprendre les totaux, les rappels et la carte de taux en direct.",
      "Ajouter revenus et depenses dans la bonne devise.",
      "Suivre dettes, sommes a recevoir et comptes bancaires au meme endroit.",
      "Utiliser correctement les reglages, la confidentialite et le stockage local."
    ],
    lockedTitle: "Terminez d'abord votre profil pour debloquer tout l'espace de travail",
    lockedDescription: "Vous pouvez lire ce guide maintenant, mais le reste de l'application reste verrouille tant que le profil obligatoire n'est pas complete.",
    sections: [
      {
        id: "setup",
        stage: "Etape 1",
        title: "Configurez votre profil et vos preferences",
        summary: "Commencez par completer votre profil, puis choisissez la langue et les devises pour adapter l'espace de travail.",
        steps: [
          "Ouvrez Complete Profile et renseignez nom, numero de contact, profession, genre, situation familiale et lieu.",
          "Ajoutez une photo si vous voulez une identite visuelle dans la barre laterale.",
          "Apres l'onboarding, choisissez la devise de base et la devise de comparaison dans Settings."
        ],
        ctaLabel: "Completer le profil",
        ctaHref: "/welcome"
      },
      {
        id: "dashboard",
        stage: "Etape 2",
        title: "Comprendre le tableau de bord",
        summary: "Le tableau de bord est votre centre financier. Les calculs principaux se font en USD puis s'affichent dans votre devise de base.",
        steps: [
          "Consultez les cartes de revenu total, depenses, dettes, sommes dues et solde net.",
          "Utilisez la carte FX en haut a droite pour comparer votre devise de base a la devise de comparaison.",
          "Descendez pour voir tendances, categories, responsabilites, rappels et activite recente."
        ],
        ctaLabel: "Ouvrir le tableau de bord",
        ctaHref: "/dashboard"
      },
      {
        id: "records",
        stage: "Etape 3",
        title: "Ajouter correctement revenus et depenses",
        summary: "Les enregistrements de revenus et depenses alimentent les graphiques et totaux, donc saisissez-les avec rigueur.",
        steps: [
          "Creez des revenus pour salaire, activite, freelance, location ou rentree unique.",
          "Ajoutez des depenses avec source, categorie, montant, date et note.",
          "Choisissez la bonne devise. Moneger normalise tout via l'USD pour des totaux fiables."
        ],
        ctaLabel: "Ajouter un revenu",
        ctaHref: "/income"
      },
      {
        id: "obligations",
        stage: "Etape 4",
        title: "Gerer dettes, sommes a recevoir et banques",
        summary: "Ces sections vous aident a voir clairement ce que vous devez et ce que l'on vous doit.",
        steps: [
          "Utilisez Debts pour suivre creanciers, echeances, statuts et retards.",
          "Utilisez Money Owed pour enregistrer les montants que d'autres doivent vous rendre.",
          "Ajoutez les banques ou portefeuilles que vous utilisez reellement."
        ],
        ctaLabel: "Ouvrir les dettes",
        ctaHref: "/debts"
      },
      {
        id: "settings",
        stage: "Etape 5",
        title: "Controler langue, confidentialite et comportement",
        summary: "Dans Settings, vous reglez l'apparence, la langue et la maniere dont les donnees restent stockees.",
        steps: [
          "Profile Settings vous permet plus tard de modifier vos informations et votre photo.",
          "Les sections Currency, Language, App, Privacy et Workspace pilotent votre compte.",
          "Rappelez-vous que les donnees financieres restent locales dans IndexedDB tant que vous n'activez pas la synchronisation."
        ],
        ctaLabel: "Ouvrir les reglages",
        ctaHref: "/settings"
      }
    ]
  },
  de: {
    eyebrow: "Benutzerhandbuch",
    title: "Lerne Moneger Schritt fur Schritt",
    description:
      "Folge diesem Leitfaden, um dein Profil abzuschliessen, das Dashboard zu verstehen, Eintrage zu erfassen, Verpflichtungen zu verwalten und deine Daten unter Kontrolle zu behalten.",
    languageLabel: "Sprache des Leitfadens",
    progressLabel: "Lernpfad",
    checklistTitle: "Was du lernen wirst",
    checklistDescription: "Diese funf Bereiche sollte jeder neue Nutzer verstehen, bevor er die App regelmassig verwendet.",
    checklistItems: [
      "Pflichtprofil abschliessen und eigene Einstellungen setzen.",
      "Gesamtsummen, Erinnerungen und die Live-Wechselkurskarte verstehen.",
      "Einnahmen und Ausgaben in der richtigen Wahrung erfassen.",
      "Schulden, Forderungen und Bankkonten zentral verfolgen.",
      "Einstellungen, Datenschutz und lokale Speicherung richtig nutzen."
    ],
    lockedTitle: "Schliesse zuerst dein Profil ab, um den gesamten Arbeitsbereich freizuschalten",
    lockedDescription: "Du kannst diesen Leitfaden jetzt lesen, aber der restliche App-Bereich bleibt gesperrt, bis dein Pflichtprofil abgeschlossen ist.",
    sections: [
      {
        id: "setup",
        stage: "Schritt 1",
        title: "Profil und Einstellungen einrichten",
        summary: "Vervollstandige zuerst dein Profil und wähle dann Sprache und Wahrungen, damit der Arbeitsbereich zu dir passt.",
        steps: [
          "Offne Complete Profile und trage Name, Kontakt, Beruf, Geschlecht, Familienstand und Ort ein.",
          "Lade bei Bedarf ein Profilbild hoch, damit die Seitenleiste personlicher wirkt.",
          "Nach dem Onboarding wahlst du in Settings die Basiswahrung und Vergleichswahrung."
        ],
        ctaLabel: "Profil abschliessen",
        ctaHref: "/welcome"
      },
      {
        id: "dashboard",
        stage: "Schritt 2",
        title: "Das Dashboard verstehen",
        summary: "Das Dashboard ist dein Finanzzentrum. Kernberechnungen laufen in USD und werden dann in deine Basiswahrung ubertragen.",
        steps: [
          "Prufe Karten fur Gesamteinnahmen, Ausgaben, Schulden, Forderungen und Nettostand.",
          "Nutze die Live-FX-Karte oben rechts fur den Vergleich zwischen Basis- und Vergleichswahrung.",
          "Weiter unten findest du Trends, Kategorien, Verbindlichkeiten, Erinnerungen und letzte Aktivitaten."
        ],
        ctaLabel: "Dashboard offnen",
        ctaHref: "/dashboard"
      },
      {
        id: "records",
        stage: "Schritt 3",
        title: "Einnahmen und Ausgaben korrekt erfassen",
        summary: "Diese Eintrage steuern Diagramme und Summen. Erfasse sie daher sauber und konsistent.",
        steps: [
          "Lege Einkommen fur Gehalt, Geschaft, Freelance, Miete oder einmalige Einnahmen an.",
          "Erfasse Ausgaben mit Quelle, Kategorie, Betrag, Datum und Notiz.",
          "Wahle die richtige Wahrung. Moneger normalisiert alles uber USD fur belastbare Summen."
        ],
        ctaLabel: "Einnahmen erfassen",
        ctaHref: "/income"
      },
      {
        id: "obligations",
        stage: "Schritt 4",
        title: "Schulden, Forderungen und Banken verwalten",
        summary: "Diese Bereiche helfen dir zu sehen, was du schuldest und was dir zusteht.",
        steps: [
          "Nutze Debts fur Glaubiger, Falligkeiten, Status und Uberfalligkeiten.",
          "Nutze Money Owed fur Betrage, die andere dir zuruckzahlen mussen.",
          "Fuge Banken oder Wallets hinzu, die du aktiv verwendest."
        ],
        ctaLabel: "Schulden offnen",
        ctaHref: "/debts"
      },
      {
        id: "settings",
        stage: "Schritt 5",
        title: "Sprache, Datenschutz und App-Verhalten steuern",
        summary: "In Settings legst du fest, wie die App aussieht, welche Sprache sie nutzt und wie Daten gespeichert werden.",
        steps: [
          "In Profile Settings kannst du spater deine Angaben und dein Bild aktualisieren.",
          "Die Bereiche Currency, Language, App, Privacy und Workspace steuern dein Konto.",
          "Finanzdaten bleiben lokal in IndexedDB, solange du die Synchronisierung nicht selbst aktivierst."
        ],
        ctaLabel: "Einstellungen offnen",
        ctaHref: "/settings"
      }
    ]
  },
  ne: {
    eyebrow: "प्रयोगकर्ता मार्गदर्शिका",
    title: "Moneger लाई चरणबद्ध रूपमा सिक्नुहोस्",
    description:
      "यो मार्गदर्शिका पछ्याएर प्रोफाइल पूरा गर्नुहोस्, ड्यासबोर्ड बुझ्नुहोस्, रेकर्ड थप्नुहोस्, दायित्व व्यवस्थापन गर्नुहोस् र आफ्ना डाटा सुरक्षित राख्नुहोस्।",
    languageLabel: "मार्गदर्शिकाको भाषा",
    progressLabel: "सिकाइ मार्ग",
    checklistTitle: "तपाईंले के सिक्नुहुनेछ",
    checklistDescription: "नियमित रूपमा एप प्रयोग गर्नुअघि प्रत्येक नयाँ प्रयोगकर्ताले यी पाँच क्षेत्र बुझ्नुपर्छ।",
    checklistItems: [
      "अनिवार्य प्रोफाइल पूरा गर्नुहोस् र आफ्नो प्राथमिकता सेट गर्नुहोस्।",
      "ड्यासबोर्डको कुल हिसाब, रिमाइन्डर र लाइभ विनिमय कार्ड बुझ्नुहोस्।",
      "सही मुद्रामा आम्दानी र खर्च प्रविष्ट गर्नुहोस्।",
      "ऋण, पाउनुपर्ने रकम र बैंक खाताहरू एकै ठाउँमा ट्र्याक गर्नुहोस्।",
      "सेटिङ्स, गोपनीयता र लोकल-फर्स्ट स्टोरेज सही रूपमा प्रयोग गर्नुहोस्।"
    ],
    lockedTitle: "पूरै कार्यक्षेत्र खोल्न पहिले प्रोफाइल पूरा गर्नुहोस्",
    lockedDescription: "तपाईं अहिले यो गाइड पढ्न सक्नुहुन्छ, तर आवश्यक प्रोफाइल पूरा नभएसम्म बाँकी एप लक हुन्छ।",
    sections: [
      {
        id: "setup",
        stage: "चरण १",
        title: "प्रोफाइल र प्राथमिकता सेट गर्नुहोस्",
        summary: "पहिले प्रोफाइल पूरा गर्नुहोस्, त्यसपछि भाषा र मुद्रा छान्नुहोस् ताकि कार्यक्षेत्र तपाईंअनुसार चलोस्।",
        steps: [
          "Complete Profile मा गई नाम, सम्पर्क नम्बर, पेशा, लिंग, वैवाहिक स्थिति र स्थान भर्नुहोस्।",
          "चाहनुहुन्छ भने साइडबारमा देखिने प्रोफाइल फोटो अपलोड गर्नुहोस्।",
          "अनबोर्डिङ पछि Settings बाट base currency र comparing currency छान्नुहोस्।"
        ],
        ctaLabel: "प्रोफाइल पूरा गर्नुहोस्",
        ctaHref: "/welcome"
      },
      {
        id: "dashboard",
        stage: "चरण २",
        title: "ड्यासबोर्ड बुझ्नुहोस्",
        summary: "ड्यासबोर्ड तपाईंको वित्तीय नियन्त्रण केन्द्र हो। मुख्य गणना USD मा हुन्छ र त्यसपछि तपाईंको base currency मा देखाइन्छ।",
        steps: [
          "माथिका total income, expenses, debt, money owed र net balance कार्ड हेर्नुहोस्।",
          "दायाँ माथिको live FX card बाट base र comparison currency को दर हेर्नुहोस्।",
          "तल स्क्रोल गरेर trends, category charts, liabilities, reminders र recent activity हेर्नुहोस्।"
        ],
        ctaLabel: "ड्यासबोर्ड खोल्नुहोस्",
        ctaHref: "/dashboard"
      },
      {
        id: "records",
        stage: "चरण ३",
        title: "आम्दानी र खर्च सही तरिकाले थप्नुहोस्",
        summary: "आम्दानी र खर्चका रेकर्डहरूले ड्यासबोर्ड र चार्ट बनाउँछन्, त्यसैले तिनीहरूलाई सही र नियमित रूपमा प्रविष्ट गर्नुहोस्।",
        steps: [
          "Salary, Business, Freelance, Rental वा One-time रकमका लागि income record बनाउनुहोस्।",
          "Expense थप्दा source, category, amount, date र note उल्लेख गर्नुहोस्।",
          "सही मुद्रा छान्नुहोस्। विश्वसनीय कुलका लागि Moneger ले सबैलाई USD मार्फत normalise गर्छ।"
        ],
        ctaLabel: "आम्दानी थप्नुहोस्",
        ctaHref: "/income"
      },
      {
        id: "obligations",
        stage: "चरण ४",
        title: "ऋण, पाउनुपर्ने रकम र बैंक व्यवस्थापन गर्नुहोस्",
        summary: "यी खण्डहरूले तपाईंले तिर्नुपर्ने र तपाईंले पाउनुपर्ने रकम स्पष्ट राख्छन्।",
        steps: [
          "Debts मा creditor, settlement date, status र overdue अवस्था ट्र्याक गर्नुहोस्।",
          "Money Owed मा अरूले तपाईंलाई फिर्ता दिनुपर्ने रकम राख्नुहोस्।",
          "Banks मा तपाईंले प्रयोग गर्ने बैंक वा वालेटहरू थप्नुहोस्।"
        ],
        ctaLabel: "ऋण खोल्नुहोस्",
        ctaHref: "/debts"
      },
      {
        id: "settings",
        stage: "चरण ५",
        title: "भाषा, गोपनीयता र एप व्यवहार नियन्त्रण गर्नुहोस्",
        summary: "Settings मा तपाईंले एपको भाषा, रूप र डाटा कसरी राखिन्छ भन्ने तय गर्नुहुन्छ।",
        steps: [
          "पछि Profile Settings बाट व्यक्तिगत विवरण र फोटो अद्यावधिक गर्न सक्नुहुन्छ।",
          "Currency, Language, App, Privacy र Workspace खण्डहरूले तपाईंको खाता नियन्त्रण गर्छन्।",
          "तपाईंले sync आफैं चालु नगरेसम्म वित्तीय रेकर्डहरू IndexedDB मा स्थानीय रूपमा रहन्छन्।"
        ],
        ctaLabel: "सेटिङ्स खोल्नुहोस्",
        ctaHref: "/settings"
      }
    ]
  }
};

export function getUserGuideContent(language: LanguagePreference) {
  return guideContent[language] || guideContent.en;
}
