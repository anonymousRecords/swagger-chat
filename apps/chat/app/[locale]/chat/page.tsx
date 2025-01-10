'use client';

import { DraggableLayout } from '@/components/layouts/desktop/draggable/draggable-layout';
import { Header } from '@/components/ui/header';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { locale } = useParams();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (locale && typeof locale === 'string') {
      i18n.changeLanguage(locale);
    }
  }, [locale, i18n]);

  return (
    <main className="min-h-screen">
      {/* <Header isDefault={true} /> */}
      <DraggableLayout />
    </main>
  );
}
