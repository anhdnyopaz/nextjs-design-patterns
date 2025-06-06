'use client';

import React, { useState } from 'react';
import { 
  MouseTracker,
  Toggle,
  FormState,
  WindowSizeTracker,
  LocalStorage
} from '@/patterns/component-patterns/render-props';

export default function RenderPropsDemo() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Render Props Demo</h2>
          <p className="text-gray-600">
            Chia sẻ logic thông qua function props
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Mouse Tracker Demo */}
        <div>
          <h3 className="text-lg font-semibold mb-4">🖱️ Mouse Position Tracker</h3>
          <div className="border rounded-lg p-4 h-40 bg-gray-50 relative overflow-hidden">
            <MouseTracker>
              {({ x, y }) => (
                <div className="space-y-2">
                                     <p className="text-sm text-gray-700 font-medium">
                     Di chuyển chuột để xem tọa độ thay đổi
                   </p>
                  <div className="flex space-x-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded">
                      X: {x}px
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded">
                      Y: {y}px
                    </span>
                  </div>
                  
                  {/* Moving dot */}
                  <div
                    className="absolute w-4 h-4 bg-red-500 rounded-full transform -translate-x-2 -translate-y-2 transition-all duration-100"
                    style={{
                      left: Math.min(Math.max(x - 100, 0), 300),
                      top: Math.min(Math.max(y - 200, 0), 120)
                    }}
                  />
                </div>
              )}
            </MouseTracker>
          </div>
        </div>

        {/* Toggle Demo */}
        <div>
          <h3 className="text-lg font-semibold mb-4">🔄 Toggle State Manager</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
                             <h4 className="font-semibold text-gray-800 mb-3">Basic Toggle</h4>
              <Toggle>
                {({ isToggled, toggle, setToggle }) => (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={toggle}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          isToggled ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                            isToggled ? 'translate-x-6' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                      <span>{isToggled ? 'Bật' : 'Tắt'}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setToggle(true)}
                        className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                      >
                        Force On
                      </button>
                      <button
                        onClick={() => setToggle(false)}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                      >
                        Force Off
                      </button>
                    </div>
                  </div>
                )}
              </Toggle>
            </div>

            <div className="border rounded-lg p-4">
                             <h4 className="font-semibold text-gray-800 mb-3">Toggle với Default State</h4>
              <Toggle defaultToggled={true}>
                {({ isToggled, toggle }) => (
                  <div className="space-y-3">
                    <div 
                      className={`p-4 rounded transition-colors cursor-pointer ${
                        isToggled ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                      }`}
                      onClick={toggle}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">
                          {isToggled ? '🌞' : '🌙'}
                        </div>
                                                 <div className="font-semibold text-gray-800">
                           {isToggled ? 'Light Mode' : 'Dark Mode'}
                         </div>
                         <div className="text-sm font-medium text-gray-700">
                           Click để chuyển đổi
                         </div>
                      </div>
                    </div>
                  </div>
                )}
              </Toggle>
            </div>
          </div>
        </div>

        {/* Form State Demo */}
        <div>
          <h3 className="text-lg font-semibold mb-4">📝 Form State Manager</h3>
          <div className="border rounded-lg p-4">
            <FormState initialValues={{ name: '', email: '', message: '' }}>
              {({ fields, updateField, validateField, resetForm, isValid }) => (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                                             <label className="block text-sm font-semibold text-gray-800 mb-1">
                         Họ tên *
                       </label>
                      <input
                        type="text"
                        value={fields.name?.value || ''}
                        onChange={(e) => updateField('name', e.target.value)}
                        onBlur={() => validateField('name', (value) => 
                          value.trim() === '' ? 'Họ tên là bắt buộc' : undefined
                        )}
                        className={`w-full px-3 py-2 border rounded-md ${
                          fields.name?.error ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Nhập họ tên của bạn"
                      />
                      {fields.name?.error && (
                        <p className="text-red-500 text-sm mt-1">{fields.name.error}</p>
                      )}
                    </div>

                    <div>
                                             <label className="block text-sm font-semibold text-gray-800 mb-1">
                         Email *
                       </label>
                      <input
                        type="email"
                        value={fields.email?.value || ''}
                        onChange={(e) => updateField('email', e.target.value)}
                        onBlur={() => validateField('email', (value) => {
                          if (value.trim() === '') return 'Email là bắt buộc';
                          if (!/\S+@\S+\.\S+/.test(value)) return 'Email không hợp lệ';
                          return undefined;
                        })}
                        className={`w-full px-3 py-2 border rounded-md ${
                          fields.email?.error ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="nhap@email.com"
                      />
                      {fields.email?.error && (
                        <p className="text-red-500 text-sm mt-1">{fields.email.error}</p>
                      )}
                    </div>
                  </div>

                  <div>
                                       <label className="block text-sm font-semibold text-gray-800 mb-1">
                     Tin nhắn
                   </label>
                    <textarea
                      value={fields.message?.value || ''}
                      onChange={(e) => updateField('message', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows={3}
                      placeholder="Tin nhắn của bạn..."
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <button
                      onClick={resetForm}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Reset Form
                    </button>
                    <button
                      onClick={() => {
                        if (isValid) {
                          alert('Form hợp lệ! Đã gửi thành công.');
                        } else {
                          alert('Vui lòng kiểm tra lại form');
                        }
                      }}
                      className={`px-4 py-2 rounded text-white ${
                        isValid ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Gửi tin nhắn
                    </button>
                  </div>

                  {/* Form Debug Info */}
                  <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
                    <strong>Form State Debug:</strong>
                    <pre className="mt-1 text-xs overflow-x-auto">
                      {JSON.stringify({ fields, isValid }, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </FormState>
          </div>
        </div>

        {/* Window Size & Local Storage Demo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Window Size Demo */}
          <div>
            <h3 className="text-lg font-semibold mb-4">📐 Window Size Tracker</h3>
            <div className="border rounded-lg p-4">
              <WindowSizeTracker>
                {({ width, height }) => (
                  <div className="space-y-3">
                                         <p className="text-sm text-gray-700 font-medium">
                       Thay đổi kích thước window để xem số liệu cập nhật
                     </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-blue-50 rounded">
                        <div className="text-2xl font-bold text-blue-600">{width}</div>
                        <div className="text-sm text-blue-600">Width (px)</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded">
                        <div className="text-2xl font-bold text-green-600">{height}</div>
                        <div className="text-sm text-green-600">Height (px)</div>
                      </div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <span className={`px-2 py-1 rounded text-sm ${
                        width < 768 ? 'bg-red-100 text-red-800' :
                        width < 1024 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {width < 768 ? 'Mobile' : width < 1024 ? 'Tablet' : 'Desktop'}
                      </span>
                    </div>
                  </div>
                )}
              </WindowSizeTracker>
            </div>
          </div>

          {/* Local Storage Demo */}
          <div>
            <h3 className="text-lg font-semibold mb-4">💾 Local Storage Manager</h3>
            <div className="border rounded-lg p-4">
              <LocalStorage<string> storageKey="demo-preference" defaultValue="light">
                {({ value, setValue, removeValue }) => (
                  <div className="space-y-3">
                                         <p className="text-sm text-gray-700 font-medium">
                       Giá trị được lưu trong localStorage
                     </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span>Current Value:</span>
                        <span className="font-mono bg-white px-2 py-1 rounded text-sm">
                          {value || 'null'}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setValue('light')}
                          className={`px-3 py-1 rounded text-sm ${
                            value === 'light' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                          }`}
                        >
                          Light
                        </button>
                        <button
                          onClick={() => setValue('dark')}
                          className={`px-3 py-1 rounded text-sm ${
                            value === 'dark' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                          }`}
                        >
                          Dark
                        </button>
                        <button
                          onClick={() => setValue('auto')}
                          className={`px-3 py-1 rounded text-sm ${
                            value === 'auto' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                          }`}
                        >
                          Auto
                        </button>
                        <button
                          onClick={removeValue}
                          className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </LocalStorage>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="mt-8 p-4 bg-teal-50 border-l-4 border-teal-500">
        <h3 className="font-semibold text-teal-800 mb-2">🎯 Lợi ích của Render Props:</h3>
        <ul className="text-sm text-teal-700 space-y-1">
          <li>• <strong>Flexibility:</strong> UI hoàn toàn tùy chỉnh được</li>
          <li>• <strong>Reusability:</strong> Logic có thể dùng lại với nhiều UI khác nhau</li>
          <li>• <strong>Composition:</strong> Dễ dàng compose nhiều render props</li>
          <li>• <strong>Type Safety:</strong> TypeScript support tốt</li>
        </ul>
      </div>
    </div>
  );
} 