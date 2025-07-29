import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Charts() {
  const { token, logout } = useAuth();
  const [data, setData] = useState({
    users: 0,
    cleanups: 0,
    completed: 0,
    feedback: 0,
    education: 0,
  });

  useEffect(() => {
    if (!token) return;

    const load = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

        const [
          metricsRes,
          completedRes
        ] = await Promise.all([
          fetch(`${API}/admin/metrics`, { headers }),
          fetch(`${API}/admin/reports/total-cleanups-completed`, { headers }),
        ]);

        if ([metricsRes, completedRes].some(r => r.status === 401)) {
          logout();
          throw new Error('Session expired. Please log in again.');
        }

        const metrics = await metricsRes.json();
        const completed = await completedRes.json();

        setData({
          users: metrics.userCount ?? 0,
          cleanups: metrics.cleanupCount ?? 0,
          completed: completed.totalCompleted ?? 0,
          feedback: metrics.feedbackCount ?? 0,
          education: (metrics.eduTotalCount ?? metrics.eduVideosCount) ?? 0,
        });
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, [token, logout]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Analytics Charts</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">User Distribution</h2>
          <Pie
            data={{
              labels: ['Total Users'],
              datasets: [{
                label: 'Users',
                data: [data.users],
                backgroundColor: ['#22c55e']
              }]
            }}
          />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">Cleanups Overview</h2>
          <Bar
            data={{
              labels: ['Total', 'Completed'],
              datasets: [{
                label: 'Cleanups',
                data: [data.cleanups, data.completed],
                backgroundColor: ['#3b82f6', '#10b981']
              }]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false }
              }
            }}
          />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">Feedback Count</h2>
          <Doughnut
            data={{
              labels: ['Feedback'],
              datasets: [{
                label: 'Feedbacks',
                data: [data.feedback],
                backgroundColor: ['#f59e0b']
              }]
            }}
          />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">Education Content</h2>
          <Pie
            data={{
              labels: ['Education Posts'],
              datasets: [{
                label: 'Posts',
                data: [data.education],
                backgroundColor: ['#8b5cf6']
              }]
            }}
          />
        </div>
      </div>
    </div>
  );
}
