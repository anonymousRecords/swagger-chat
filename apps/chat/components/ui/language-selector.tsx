'use client';

import { cn } from '@/lib/index';
import { useTranslation } from 'react-i18next';
import '@/i18n';
import { usePathname, useRouter } from 'next/navigation';

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

const languages = [
  { code: 'en', name: 'English' },
  { code: 'ko', name: '한국어' },
  { code: 'ja', name: '日本語' },
  { code: 'zh', name: '中文' },
];

export function LanguageSelector({ currentLanguage, onLanguageChange }: LanguageSelectorProps) {
  const { t, i18n } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();

  const handleLanguageChange = (languageCode: string) => {
    // 현재 URL에서 로케일 부분을 새로운 언어로 교체
    const currentLocale = pathname.split('/')[1];
    const newPath = pathname.replace(`/${currentLocale}`, `/${languageCode}`);
    router.push(newPath);
    i18n.changeLanguage(languageCode);
    onLanguageChange(languageCode);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {t('header.language')}
      </label>
      <div className="grid grid-cols-2 gap-2">
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={cn(
              "flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50",
              currentLanguage === language.code
                ? "bg-gray-900 text-white font-medium"
                : ""
            )}
          >
            {language.name}
          </button>
        ))}
      </div>
    </div>
  );
}
