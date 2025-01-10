import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface WindowPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface WindowState {
  // Window states
  swaggerWindow: WindowPosition;
  chatWindow: WindowPosition;
  isMobile: boolean;
  layoutMode: 'draggable' | 'split';

  // Actions
  setSwaggerWindow: (position: Partial<WindowPosition>) => void;
  setChatWindow: (position: Partial<WindowPosition>) => void;
  setIsMobile: (isMobile: boolean) => void;
  setLayoutMode: (mode: 'draggable' | 'split') => void;
  resetPositions: () => void;
}

const getInitialWindowSizes = () => {
  if (typeof window === 'undefined') {
    return {
      width: 1024,
      height: 768
    };
  }
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
};

const getDefaultPositions = (isMobile: boolean) => {
  const { width, height } = getInitialWindowSizes();
  
  if (isMobile) {
    return {
      swaggerWindow: {
        x: 0,
        y: 0,
        width: width,
        height: height / 2,
      },
      chatWindow: {
        x: 0,
        y: height / 2,
        width: width,
        height: height / 2,
      },
    };
  }

  return {
    swaggerWindow: {
      x: 50,
      y: 50,
      width: 600,
      height: 500,
    },
    chatWindow: {
      x: 700,
      y: 100,
      width: 500,
      height: 500,
    },
  };
};

const getInitialState = () => {
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  const defaultPositions = getDefaultPositions(isMobile);

  return {
    ...defaultPositions,
    isMobile,
    layoutMode: 'draggable' as const,
  };
};

export const useWindowStore = create<WindowState>()(
  devtools(
    (set) => ({
      // Initial states
      ...getInitialState(),

      // Actions
      setSwaggerWindow: (position) =>
        set((state) => ({
          swaggerWindow: { ...state.swaggerWindow, ...position },
        })),

      setChatWindow: (position) =>
        set((state) => ({
          chatWindow: { ...state.chatWindow, ...position },
        })),

      setIsMobile: (isMobile) =>
        set((state) => {
          const defaults = getDefaultPositions(isMobile);
          return {
            isMobile,
            swaggerWindow: {
              ...defaults.swaggerWindow,
              x: state.swaggerWindow.x,
              y: state.swaggerWindow.y,
            },
            chatWindow: {
              ...defaults.chatWindow,
              x: state.chatWindow.x,
              y: state.chatWindow.y,
            },
          };
        }),

      setLayoutMode: (mode) =>
        set(() => ({
          layoutMode: mode,
        })),

      resetPositions: () =>
        set((state) => {
          const defaults = getDefaultPositions(state.isMobile);
          return {
            swaggerWindow: defaults.swaggerWindow,
            chatWindow: defaults.chatWindow,
          };
        }),
    }),
    { name: 'window-store' }
  )
);