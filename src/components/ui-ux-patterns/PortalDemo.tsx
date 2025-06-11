'use client';

import React, { ReactNode, useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';

// Component Portal cải tiến
function Portal({ children, containerId = 'portal-root' }: { children: ReactNode; containerId?: string }) {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let portalContainer = document.getElementById(containerId);
    
    if (!portalContainer) {
      portalContainer = document.createElement('div');
      portalContainer.id = containerId;
      portalContainer.style.position = 'absolute';
      portalContainer.style.top = '0';
      portalContainer.style.left = '0';
      portalContainer.style.pointerEvents = 'none';
      document.body.appendChild(portalContainer);
    }

    setContainer(portalContainer);

    return () => {
      // Chỉ xóa container nếu nó rỗng và được tạo bởi component này
      if (portalContainer && portalContainer.children.length === 0 && portalContainer.id === containerId) {
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
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ pointerEvents: 'auto' }}
      >
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

// Component Tooltip được cải thiện
interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

function Tooltip({ content, children, position = 'top', delay = 300 }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      if (targetRef.current) {
        const rect = targetRef.current.getBoundingClientRect();
        setTargetRect(rect);
        setIsVisible(true);
      }
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const getTooltipStyle = () => {
    if (!targetRect) return { display: 'none' };

    const padding = 8;
    const positions = {
      top: {
        bottom: window.innerHeight - targetRect.top + padding,
        left: targetRect.left + targetRect.width / 2,
        transform: 'translateX(-50%)',
      },
      bottom: {
        top: targetRect.bottom + padding,
        left: targetRect.left + targetRect.width / 2,
        transform: 'translateX(-50%)',
      },
      left: {
        top: targetRect.top + targetRect.height / 2,
        right: window.innerWidth - targetRect.left + padding,
        transform: 'translateY(-50%)',
      },
      right: {
        top: targetRect.top + targetRect.height / 2,
        left: targetRect.right + padding,
        transform: 'translateY(-50%)',
      },
    };

    return positions[position];
  };

  const getArrowClasses = () => {
    const baseClasses = "absolute w-2 h-2 bg-gray-900 transform rotate-45";
    const positions = {
      top: "top-full left-1/2 -translate-x-1/2 -translate-y-1/2",
      bottom: "bottom-full left-1/2 -translate-x-1/2 translate-y-1/2", 
      left: "left-full top-1/2 -translate-y-1/2 -translate-x-1/2",
      right: "right-full top-1/2 -translate-y-1/2 translate-x-1/2"
    };
    return `${baseClasses} ${positions[position]}`;
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div
        ref={targetRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        className="inline-block"
      >
        {children}
      </div>
      
      {isVisible && targetRect && (
        <Portal containerId="tooltip-root">
          <div
            className="fixed z-[9999] px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap"
            style={{ 
              ...getTooltipStyle(),
              pointerEvents: 'none'
            }}
          >
            {content}
            <div className={getArrowClasses()} />
          </div>
        </Portal>
      )}
    </>
  );
}

// Component Notification Toast (thêm ví dụ mới)
interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: () => void;
}

function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeStyles = {
    success: 'bg-green-500 text-white border-green-600',
    error: 'bg-red-500 text-white border-red-600', 
    warning: 'bg-yellow-500 text-white border-yellow-600',
    info: 'bg-blue-500 text-white border-blue-600'
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  return (
    <Portal containerId="toast-root">
      <div 
        className="fixed top-4 right-4 z-[9999]"
        style={{ pointerEvents: 'auto' }}
      >
        <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${typeStyles[type]} animate-[slideIn_0.3s_ease] max-w-sm`}>
          <span className="text-lg">{icons[type]}</span>
          <span className="flex-1">{message}</span>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </Portal>
  );
}

// Main Demo Component
export default function PortalDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: ToastProps['type'] }>>([]);

  const addToast = (message: string, type: ToastProps['type'] = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

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
          <div className="flex gap-4 flex-wrap justify-center">
            <Tooltip content="Tooltip này xuất hiện ở trên với hiệu ứng mượt mà" position="top">
              <button className="px-4 py-3 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors shadow-md hover:shadow-lg">
                Tooltip Trên
              </button>
            </Tooltip>
            
            <Tooltip content="Tooltip này xuất hiện ở bên phải với độ trễ" position="right" delay={200}>
              <button className="px-4 py-3 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600 transition-colors shadow-md hover:shadow-lg">
                Tooltip Phải
              </button>
            </Tooltip>
            
            <Tooltip content="Tooltip này xuất hiện ở dưới với mũi tên" position="bottom" delay={100}>
              <button className="px-4 py-3 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 transition-colors shadow-md hover:shadow-lg">
                Tooltip Dưới
              </button>
            </Tooltip>
            
            <Tooltip content="Tooltip này xuất hiện ở bên trái với thông tin chi tiết" position="left">
              <button className="px-4 py-3 bg-pink-500 text-white rounded-lg text-sm hover:bg-pink-600 transition-colors shadow-md hover:shadow-lg">
                Tooltip Trái
              </button>
            </Tooltip>
          </div>
        </div>

        {/* Toast Notification Demo */}
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Ví dụ Toast Notifications</h3>
          <p className="text-gray-600 mb-4">
            Nhấp các nút để hiển thị notifications được render thông qua portals.
          </p>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => addToast('Thành công! Dữ liệu đã được lưu.', 'success')}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Thành công
            </button>
            <button
              onClick={() => addToast('Lỗi! Không thể kết nối server.', 'error')}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Lỗi
            </button>
            <button
              onClick={() => addToast('Cảnh báo! Hãy kiểm tra dữ liệu.', 'warning')}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Cảnh báo
            </button>
            <button
              onClick={() => addToast('Thông tin: Có cập nhật mới.', 'info')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Thông tin
            </button>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border-l-4 border-blue-500">
          <h4 className="font-semibold text-blue-800 mb-2">🎯 Lợi ích của Portal:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Render bên ngoài DOM hierarchy (phân cấp DOM) của component cha</li>
            <li>• Tránh các vấn đề về z-index stacking context (ngữ cảnh xếp chồng chỉ số độ sâu)</li>
            <li>• Tốt hơn cho modals, tooltips, notifications và overlays (lớp phủ)</li>
            <li>• Duy trì mối quan hệ React component tree (cây component)</li>
            <li>• Kiểm soát tốt hơn vị trí và styling của overlay elements</li>
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
              <li>• Responsive design (thiết kế đáp ứng)</li>
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

      {/* Toast Notifications */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
} 