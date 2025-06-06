'use client';

import React, { useState } from 'react';
import { 
  Tabs, 
  TabList, 
  Tab, 
  TabContent,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem
} from '@/patterns/component-patterns/compound-components';

export default function CompoundComponentsDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string>('');

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Compound Components Demo</h2>
          <p className="text-gray-600">
            Components chia sẻ state thông qua Context API
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Tabs Demo */}
        <div>
          <h3 className="text-lg font-semibold mb-4">📋 Tabs System</h3>
          <div className="border rounded-lg overflow-hidden">
            <Tabs defaultValue="profile" className="w-full">
              <TabList className="bg-gray-50">
                <Tab value="profile">Hồ sơ</Tab>
                <Tab value="settings">Cài đặt</Tab>
                <Tab value="notifications">Thông báo</Tab>
                <Tab value="security" disabled>Bảo mật (disabled)</Tab>
              </TabList>
              
              <div className="p-6">
                <TabContent value="profile">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800">Thông tin hồ sơ</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tên đầy đủ
                        </label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          defaultValue="Nguyễn Văn A"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input 
                          type="email" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          defaultValue="nguyenvana@example.com"
                        />
                      </div>
                    </div>
                  </div>
                </TabContent>
                
                <TabContent value="settings">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800">Cài đặt tài khoản</h4>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        <span>Nhận email thông báo</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span>Hiển thị hồ sơ công khai</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        <span>Cho phép tin nhắn từ người khác</span>
                      </label>
                    </div>
                  </div>
                </TabContent>
                
                <TabContent value="notifications">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800">Cài đặt thông báo</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Thông báo desktop</span>
                        <button className="px-3 py-1 bg-green-500 text-white rounded text-sm">
                          Bật
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Thông báo SMS</span>
                        <button className="px-3 py-1 bg-gray-500 text-white rounded text-sm">
                          Tắt
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Thông báo email hàng tuần</span>
                        <button className="px-3 py-1 bg-green-500 text-white rounded text-sm">
                          Bật
                        </button>
                      </div>
                    </div>
                  </div>
                </TabContent>
              </div>
            </Tabs>
          </div>
        </div>

        {/* Modal & Dropdown Demo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Modal Demo */}
          <div>
            <h3 className="text-lg font-semibold mb-4">🪟 Modal System</h3>
            <div className="p-4 border rounded-lg">
              <p className="text-gray-700 mb-4 font-medium">
                Modal với compound components cho structure rõ ràng
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Mở Modal
              </button>
              
              <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <ModalContent>
                  <ModalHeader>
                    Xác nhận hành động
                  </ModalHeader>
                  <ModalBody>
                    <p className="text-gray-800 font-medium">Bạn có chắc chắn muốn thực hiện hành động này không?</p>
                    <p className="text-sm text-gray-600 mt-2 font-medium">
                      Hành động này không thể hoàn tác.
                    </p>
                  </ModalBody>
                  <ModalFooter>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={() => {
                        setIsModalOpen(false);
                        alert('Đã xác nhận!');
                      }}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Xác nhận
                    </button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </div>
          </div>

          {/* Dropdown Demo */}
          <div>
            <h3 className="text-lg font-semibold mb-4">📋 Dropdown Menu</h3>
            <div className="p-4 border rounded-lg">
              <p className="text-gray-700 mb-4 font-medium">
                Dropdown linh hoạt với trigger và content tùy chỉnh
              </p>
              
              <div className="space-y-4">
                <div>
                                     <label className="block text-sm font-semibold text-gray-800 mb-2">
                     Hành động đã chọn: {selectedAction || 'Chưa chọn'}
                   </label>
                  
                  <Dropdown>
                    <DropdownTrigger>
                      <button className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 flex items-center">
                        Chọn hành động
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </DropdownTrigger>
                    <DropdownContent>
                      <DropdownItem onClick={() => setSelectedAction('Chỉnh sửa')}>
                        ✏️ Chỉnh sửa
                      </DropdownItem>
                      <DropdownItem onClick={() => setSelectedAction('Sao chép')}>
                        📋 Sao chép
                      </DropdownItem>
                      <DropdownItem onClick={() => setSelectedAction('Chia sẻ')}>
                        🔗 Chia sẻ
                      </DropdownItem>
                      <DropdownItem 
                        onClick={() => setSelectedAction('Xóa')}
                        className="text-red-600 hover:bg-red-50"
                      >
                        🗑️ Xóa
                      </DropdownItem>
                    </DropdownContent>
                  </Dropdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="mt-8 p-4 bg-green-50 border-l-4 border-green-500">
        <h3 className="font-semibold text-green-800 mb-2">🎯 Lợi ích của Compound Components:</h3>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• <strong>Flexibility:</strong> Người dùng tự do sắp xếp components</li>
          <li>• <strong>Separation of Concerns:</strong> Logic và UI tách biệt rõ ràng</li>
          <li>• <strong>Reusability:</strong> Có thể tái sử dụng trong nhiều context</li>
          <li>• <strong>Maintainability:</strong> Dễ maintain và extend functionality</li>
        </ul>
      </div>
    </div>
  );
} 