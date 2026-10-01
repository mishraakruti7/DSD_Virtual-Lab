import React from 'react';
import { useAuth } from '../context/AuthContext';

export const StudentDashboardPage: React.FC = () => {
  const { profile } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Student Dashboard</h1>
      <p>Welcome back, {profile?.display_name}</p>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
        {/* Placeholder for progress components */}
        <p>Progress dashboard coming soon...</p>
      </div>
    </div>
  );
};
