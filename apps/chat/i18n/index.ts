'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 번역 리소스
const resources = {
  en: {
    translation: {
      common: {
        confirm: 'Confirm',
        cancel: 'Cancel',
        close: 'Close'
      },
      header: {
        documentation: 'Documentation',
        chat: 'Chat',
        settings: 'Settings',
        language: 'Language',
        navigation: 'Navigation',
        layout: {
          draggable: 'Switch to Split View',
          split: 'Switch to Draggable View'
        }
      },
      modal: {
        refresh: {
          title: 'Confirm Page Refresh',
          message: 'Refreshing the page will discard all your current work. Do you want to continue?',
          confirm: 'Continue'
        }
      }
    }
  },
  ko: {
    translation: {
      common: {
        confirm: '확인',
        cancel: '취소',
        close: '닫기'
      },
      header: {
        documentation: '문서',
        chat: '채팅',
        settings: '설정',
        language: '언어',
        navigation: '탐색',
        layout: {
          draggable: '분할 보기로 전환',
          split: '드래그 가능한 보기로 전환'
        }
      },
      modal: {
        refresh: {
          title: '페이지 새로고침 확인',
          message: '페이지를 새로고침하면 현재 작업 중인 내용이 모두 사라집니다. 계속하시겠습니까?',
          confirm: '계속하기'
        }
      }
    }
  },
  ja: {
    translation: {
      common: {
        confirm: '確認',
        cancel: 'キャンセル',
        close: '閉じる'
      },
      header: {
        documentation: 'ドキュメント',
        chat: 'チャット',
        settings: '設定',
        language: '言語',
        navigation: 'ナビゲーション',
        layout: {
          draggable: '分割ビューに切り替え',
          split: 'ドラッグ可能なビューに切り替え'
        }
      },
      modal: {
        refresh: {
          title: 'ページの更新確認',
          message: 'ページを更新すると、現在の作業内容がすべて失われます。続行しますか？',
          confirm: '続行'
        }
      }
    }
  },
  zh: {
    translation: {
      common: {
        confirm: '确认',
        cancel: '取消',
        close: '关闭'
      },
      header: {
        documentation: '文档',
        chat: '聊天',
        settings: '设置',
        language: '语言',
        navigation: '导航',
        layout: {
          draggable: '切换到分割视图',
          split: '切换到可拖动视图'
        }
      },
      modal: {
        refresh: {
          title: '确认页面刷新',
          message: '刷新页面将丢失所有当前工作内容。是否继续？',
          confirm: '继续'
        }
      }
    }
  }
};

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false
      }
    });
}

export default i18n;
