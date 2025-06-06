'use client';

import React, { useState } from 'react';
import { useUser } from '@/patterns/state-management/provider/UserProvider';
import { useUserService } from '@/patterns/state-management/UserService';

export default function CurrentUserDisplay() {
  const { state, login, logout } = useUser();
  const [loginEmail, setLoginEmail] = useState('a@example.com');
  const userService = useUserService();

  const handleLogin = async () => {
    try {
      const user = await userService.login(loginEmail, 'password');
      if (user) {
        login(user);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Người dùng hiện tại</h2>
      
      {state.currentUser ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {state.currentUser.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{state.currentUser.name}</h3>
              <p className="text-sm text-gray-600">{state.currentUser.email}</p>
              <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                state.currentUser.role === 'admin' ? 'bg-red-100 text-red-800' :
                state.currentUser.role === 'user' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {state.currentUser.role}
              </span>
            </div>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Đăng xuất
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email để đăng nhập
            </label>
            <select
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="a@example.com">a@example.com (Admin)</option>
              <option value="b@example.com">b@example.com (User)</option>
              <option value="c@example.com">c@example.com (Guest)</option>
            </select>
          </div>
          <button
            onClick={handleLogin}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Đăng nhập
          </button>
        </div>
      )}
    </div>
  );
} 