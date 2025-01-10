'use client';

import { ArrowLeftIcon, Cog6ToothIcon, ViewColumnsIcon, WindowIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { cn } from '@/lib/index';
import { LanguageSelector } from './language-selector';
import { useTranslation } from 'react-i18next';
import { useWindowStore } from '@/store/useWindowStore';
import { useRouter } from 'next/navigation';
import '@/i18n';

interface HeaderProps {
  isDefault?: boolean;
  title?: string;
  onBackClick?: () => void;
}

export function Header({
  isDefault = true,
  title = 'SWAGGER CHAT',
  onBackClick,
}: HeaderProps) {
  const { t } = useTranslation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const { layoutMode, setLayoutMode, isMobile } = useWindowStore();
  const router = useRouter();

  const toggleLayout = () => {
    setLayoutMode(layoutMode === 'draggable' ? 'split' : 'draggable');
  };

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsSettingsOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 w-full z-20 h-[48px] bg-white border-b">
        <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!isDefault && (
              <button
                className="p-2 hover:bg-gray-100 rounded-lg"
                aria-label="Go back"
                onClick={onBackClick}
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
            )}
            <h1 className="text-lg font-semibold">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            {!isMobile && !isDefault && (
              <button
                className="p-2 hover:bg-gray-100 rounded-lg"
                aria-label="Toggle layout"
                onClick={toggleLayout}
                title={layoutMode === 'draggable' ? t('header.layout.split') : t('header.layout.draggable')}
              >
                {layoutMode === 'draggable' ? (
                  <ViewColumnsIcon className="w-5 h-5" />
                ) : (
                  <WindowIcon className="w-5 h-5" />
                )}
              </button>
            )}
            <button
              className={cn(
                "p-2 hover:bg-gray-100 rounded-lg transition-transform",
                isSettingsOpen && "rotate-180"
              )}
              aria-label="Settings"
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            >
              <Cog6ToothIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Settings Panel */}
      <div
        className={cn(
          "fixed top-[48px] left-0 right-0 z-20 bg-white border-b shadow-sm transition-all duration-200",
          isSettingsOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex items-center justify-between">
            <LanguageSelector
              currentLanguage={currentLanguage}
              onLanguageChange={handleLanguageChange}
            />
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isSettingsOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-10"
          onClick={() => setIsSettingsOpen(false)}
        />
      )}

      {/* Spacer */}
      <div className="h-[48px]" />
    </>
  );
}