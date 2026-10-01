import React from 'react';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services/admin';
import { useEffect, useState } from 'react';
import { Profile } from '../types/database.types';

export const AdminDashboardPage: React.FC = () => {
  const { profile } = useAuth();
  const [students, setStudents] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStudents() {
      try {
        const data = await adminService.getAllStudents();
        setStudents(data);
      } catch (e) {
        console.error('Failed to load students', e);
      } finally {
        setLoading(false);
      }
    }
    loadStudents();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p>Welcome back, {profile?.display_name} ({profile?.role})</p>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Registered Students: {students.length}</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="divide-y">
            {students.map((student) => (
              <li key={student.id} className="py-2">
                {student.display_name} ({student.id})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
