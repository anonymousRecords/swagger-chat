import { XMarkIcon } from '@heroicons/react/24/solid';

import SwaggerPanel from '../swagger/swagger-pannel';

interface MobileDrawerProps {
  isDrawerOpen: boolean;
  toggleDrawer: (open: boolean) => void;
}

const MobileDrawer = ({ isDrawerOpen, toggleDrawer }: MobileDrawerProps) => (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
    <div
      className={`absolute right-0 top-0 h-full w-[90%] max-w-[400px] transform bg-[#121212] transition-transform duration-300 ease-in-out ${
        isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-[#2E2E2E] p-4">
          <h2 className="text-lg font-bold text-white">API Documentation</h2>
          <button
            onClick={() => toggleDrawer(false)}
            className="text-white hover:text-gray-300"
          >
            <XMarkIcon className="text-white w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-auto">
          <SwaggerPanel />
        </div>
      </div>
    </div>
  </div>
);

export default MobileDrawer;