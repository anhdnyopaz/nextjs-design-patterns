'use client';

import React, { useState, useEffect } from 'react';
import { useUserService } from '@/patterns/state-management/UserService';

export default function ObserverStats() {
  const userService = useUserService();
  const [stats, setStats] = useState<{ totalEvents: number; observers: number; eventCounts: Record<string, number> } | null>(null);

  useEffect(() => {
    const updateStats = () => {
      setStats(userService.getStatistics());
    };

    updateStats();
    const interval = setInterval(updateStats, 2000);
    return () => clearInterval(interval);
  }, [userService]);

  if (!stats) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Observer Statistics</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800">Tổng số Events</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.totalEvents}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800">Số Observers</h3>
          <p className="text-2xl font-bold text-green-600">{stats.observers}</p>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="font-semibold text-gray-800 mb-3">Event Types</h3>
        <div className="space-y-2">
          {Object.entries(stats.eventCounts).map(([event, count]) => (
            <div key={event} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
              <span className="text-sm text-gray-700">{event}</span>
              <span className="font-semibold text-gray-800">{count as number}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 