'use client';

import React, { 
  createContext, 
  useContext, 
  useState, 
  ReactNode, 
  ReactElement,
  cloneElement,
  isValidElement
} from 'react';

// Types for Tab System
interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface TabProps {
  value: string;
  children: ReactNode;
  disabled?: boolean;
}

interface TabContentProps {
  value: string;
  children: ReactNode;
}

// Context for Tab System
const TabsContext = createContext<TabsContextType | null>(null);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tab components must be used within a Tabs component');
  }
  return context;
};

// Main Tabs component
interface TabsProps {
  defaultValue: string;
  children: ReactNode;
  className?: string;
}

export const Tabs = ({ defaultValue, children, className = '' }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={`tabs-container ${className}`}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

// Tab List component
interface TabListProps {
  children: ReactNode;
  className?: string;
}

export const TabList = ({ children, className = '' }: TabListProps) => {
  return (
    <div className={`flex border-b border-gray-200 ${className}`} role="tablist">
      {children}
    </div>
  );
};

// Individual Tab component
export const Tab = ({ value, children, disabled = false }: TabProps) => {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      disabled={disabled}
      onClick={() => !disabled && setActiveTab(value)}
      className={`px-4 py-2 font-medium text-sm transition-colors ${
        isActive
          ? 'text-green-600 border-b-2 border-green-600'
          : disabled
          ? 'text-gray-400 cursor-not-allowed'
          : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      {children}
    </button>
  );
};

// Tab Content component
export const TabContent = ({ value, children }: TabContentProps) => {
  const { activeTab } = useTabsContext();
  
  if (activeTab !== value) return null;

  return (
    <div role="tabpanel" className="py-4">
      {children}
    </div>
  );
};

// Modal Compound Components
interface ModalContextType {
  isOpen: boolean;
  onClose: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('Modal components must be used within a Modal component');
  }
  return context;
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <ModalContext.Provider value={{ isOpen, onClose }}>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div 
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />
        {children}
      </div>
    </ModalContext.Provider>
  );
};

export const ModalContent = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  return (
    <div className={`relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 ${className}`}>
      {children}
    </div>
  );
};

export const ModalHeader = ({ children }: { children: ReactNode }) => {
  const { onClose } = useModalContext();
  
  return (
    <div className="flex justify-between items-center p-6 border-b">
      <div className="text-lg font-semibold">{children}</div>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export const ModalBody = ({ children }: { children: ReactNode }) => {
  return <div className="p-6">{children}</div>;
};

export const ModalFooter = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50 rounded-b-lg">
      {children}
    </div>
  );
};

// Dropdown Compound Components
interface DropdownContextType {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

const DropdownContext = createContext<DropdownContextType | null>(null);

const useDropdownContext = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('Dropdown components must be used within a Dropdown component');
  }
  return context;
};

interface DropdownProps {
  children: ReactNode;
  className?: string;
}

export const Dropdown = ({ children, className = '' }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  return (
    <DropdownContext.Provider value={{ isOpen, toggle, close }}>
      <div className={`relative inline-block ${className}`}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

export const DropdownTrigger = ({ children }: { children: ReactNode }) => {
  const { toggle } = useDropdownContext();

  if (isValidElement(children)) {
    return cloneElement(children as ReactElement<Record<string, unknown>>, {
      onClick: toggle
    });
  }

  return (
    <button onClick={toggle} className="dropdown-trigger">
      {children}
    </button>
  );
};

export const DropdownContent = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  const { isOpen, close } = useDropdownContext();

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-10" onClick={close} />
      <div className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border ${className}`}>
        <div className="py-1">
          {children}
        </div>
      </div>
    </>
  );
};

export const DropdownItem = ({ 
  children, 
  onClick,
  className = ''
}: { 
  children: ReactNode; 
  onClick?: () => void;
  className?: string;
}) => {
  const { close } = useDropdownContext();

  const handleClick = () => {
    onClick?.();
    close();
  };

  return (
    <button
      onClick={handleClick}
      className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors ${className}`}
    >
      {children}
    </button>
  );
}; 