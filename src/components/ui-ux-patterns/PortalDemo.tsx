'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

// Component Portal
function Portal({ children, containerId = 'portal-root' }: { children: ReactNode; containerId?: string }) {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let portalContainer = document.getElementById(containerId);
    
    if (!portalContainer) {
      portalContainer = document.createElement('div');
      portalContainer.id = containerId;
      document.body.appendChild(portalContainer);
    }

    setContainer(portalContainer);

    return () => {
      if (portalContainer && portalContainer.children.length === 0) {
        document.body.removeChild(portalContainer);
      }
    };
  }, [containerId]);

  if (!container) return null;

  return createPortal(children, container);
}

// Component Modal
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <Portal containerId="modal-root">
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
          {title && (
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">{title}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </Portal>
  );
}

// Component Tooltip
interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTargetRect(rect);
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const getTooltipStyle = () => {
    if (!targetRect) return {};

    const positions = {
      top: {
        bottom: window.innerHeight - targetRect.top + 8,
        left: targetRect.left + targetRect.width / 2,
        transform: 'translateX(-50%)',
      },
      bottom: {
        top: targetRect.bottom + 8,
        left: targetRect.left + targetRect.width / 2,
        transform: 'translateX(-50%)',
      },
      left: {
        top: targetRect.top + targetRect.height / 2,
        right: window.innerWidth - targetRect.left + 8,
        transform: 'translateY(-50%)',
      },
      right: {
        top: targetRect.top + targetRect.height / 2,
        left: targetRect.right + 8,
        transform: 'translateY(-50%)',
      },
    };

    return positions[position];
  };

  return (
    <>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        {children}
      </div>
      
      {isVisible && (
        <Portal containerId="tooltip-root">
          <div
            className="absolute z-50 px-2 py-1 text-sm text-white bg-gray-900 rounded shadow-lg pointer-events-none"
            style={getTooltipStyle()}
          >
            {content}
          </div>
        </Portal>
      )}
    </>
  );
}

// Main Demo Component
export default function PortalDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl">
          <span className="text-2xl">🌀</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Portal Pattern Demo (Demo mẫu cổng)</h2>
          <p className="text-gray-600">Minh họa tương tác của portals</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Modal Demo */}
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Ví dụ Modal</h3>
          <p className="text-gray-600 mb-4">
            Nhấp vào nút để mở modal được render (hiển thị) bên ngoài DOM hierarchy (phân cấp DOM) thông thường.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Mở Modal
          </button>
        </div>

        {/* Tooltip Demo */}
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Các ví dụ Tooltip</h3>
          <p className="text-gray-600 mb-4">
            Di chuột qua các nút bên dưới để xem tooltips được render thông qua portals.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Tooltip content="Tooltip này xuất hiện ở trên" position="top">
              <button className="px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors">
                Tooltip Trên
              </button>
            </Tooltip>
            
            <Tooltip content="Tooltip này xuất hiện ở bên phải" position="right">
              <button className="px-3 py-2 bg-purple-500 text-white rounded text-sm hover:bg-purple-600 transition-colors">
                Tooltip Phải
              </button>
            </Tooltip>
            
            <Tooltip content="Tooltip này xuất hiện ở dưới" position="bottom">
              <button className="px-3 py-2 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 transition-colors">
                Tooltip Dưới
              </button>
            </Tooltip>
            
            <Tooltip content="Tooltip này xuất hiện ở bên trái" position="left">
              <button className="px-3 py-2 bg-pink-500 text-white rounded text-sm hover:bg-pink-600 transition-colors">
                Tooltip Trái
              </button>
            </Tooltip>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border-l-4 border-blue-500">
          <h4 className="font-semibold text-blue-800 mb-2">🎯 Lợi ích của Portal:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Render bên ngoài DOM hierarchy (phân cấp DOM) của component cha</li>
            <li>• Tránh các vấn đề về z-index stacking context (ngữ cảnh xếp chồng chỉ số độ sâu)</li>
            <li>• Tốt hơn cho modals, tooltips và overlays (lớp phủ)</li>
            <li>• Duy trì mối quan hệ React component tree (cây component)</li>
          </ul>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Ví dụ Portal Modal"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Modal này được render sử dụng React Portal, có nghĩa là nó tồn tại bên ngoài 
            DOM hierarchy thông thường nhưng vẫn duy trì mối quan hệ React component.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Tính năng chính:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Phím Escape để đóng</li>
              <li>• Nhấp backdrop (nền mờ) để đóng</li>
              <li>• Ngăn cuộn body</li>
              <li>• Focus management (quản lý tiêu điểm)</li>
            </ul>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Đóng Modal
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
} 