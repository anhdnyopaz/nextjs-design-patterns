'use client';

import React, { useState, useEffect } from 'react';
import { useUser, User } from '@/patterns/state-management/provider/UserProvider';
import { useUserService } from '@/patterns/state-management/UserService';

export default function UserList() {
  const { state, fetchUsers } = useUser();
  const userService = useUserService();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Chỉ chạy một lần khi component mount

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      try {
        const results = await userService.searchUsers(searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await userService.deleteUser(id);
      fetchUsers(); // Refresh list
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const displayUsers = searchResults.length > 0 ? searchResults : state.users;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Danh sách người dùng</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Tìm kiếm
          </button>
        </div>
      </div>

      {state.loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Đang tải...</span>
        </div>
      ) : (
        <div className="grid gap-4">
          {displayUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    user.role === 'admin' ? 'bg-red-100 text-red-800' :
                    user.role === 'user' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleDelete(user.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
          {displayUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? 'Không tìm thấy kết quả nào' : 'Chưa có người dùng nào'}
            </div>
          )}
        </div>
      )}

      {state.error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {state.error}
        </div>
      )}
    </div>
  );
} 