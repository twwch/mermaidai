import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import zh from './locales/zh';
import en from './locales/en';
import ja from './locales/ja';
import ko from './locales/ko';

const resources = {
  zh: { translation: zh },
  en: { translation: en },
  ja: { translation: ja },
  ko: { translation: ko },
};

// 从 localStorage 获取保存的语言，如果没有则使用浏览器语言或默认中文
const getSavedLanguage = () => {
  const saved = localStorage.getItem('mermaid_ai_language');
  if (saved) return saved;

  // 检测浏览器语言
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('zh')) return 'zh';
  if (browserLang.startsWith('en')) return 'en';
  if (browserLang.startsWith('ja')) return 'ja';
  if (browserLang.startsWith('ko')) return 'ko';

  return 'zh'; // 默认中文
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getSavedLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

// 监听语言变化，保存到 localStorage
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('mermaid_ai_language', lng);
});

export default i18n;
