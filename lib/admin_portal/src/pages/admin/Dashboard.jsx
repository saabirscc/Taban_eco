// // src/pages/admin/Dashboard.jsx
// import React, { useEffect, useState } from 'react';
// import { useAuth } from '../../contexts/AuthContext';
// import {
//   UserGroupIcon,
//   ClipboardDocumentListIcon,
//   ClockIcon,
//   PhotoIcon,
//   GiftIcon,
//   UsersIcon,
//   ChatBubbleBottomCenterTextIcon,
// } from '@heroicons/react/24/outline';

// function StatCard({ title, value, Icon, borderColor = 'border-gray-200' }) {
//   const iconColorClass = borderColor.startsWith('border-')
//     ? borderColor.replace('border-', 'text-')
//     : 'text-gray-500';

//   return (
//     <div
//       className={`
//         flex flex-col justify-between
//         w-64 h-32
//         bg-white
//         rounded-2xl
//         shadow-md
//         border-l-4
//         ${borderColor}
//         p-6
//       `}
//     >
//       <div className="flex items-center justify-between">
//         <span className="text-sm font-medium text-gray-500">{title}</span>
//         {Icon && <Icon className={`h-6 w-6 ${iconColorClass}`} />}
//       </div>
//       <span className="mt-4 text-3xl font-bold text-gray-800">{value}</span>
//     </div>
//   );
// }

// export default function Dashboard() {
//   const { token, logout } = useAuth();
//   const [loading, setLoading] = useState(false);
//   const [metrics, setMetrics] = useState({
//     userCount: 0,
//     cleanupCount: 0,
//     pendingCount: 0,
//     eduTotalCount: 0,      // all edu posts (video+image)
//     authorsCount: 0,
//     rewardsCount: 0,
//     feedbackCount: 0,
//   });
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!token) return;

//     const load = () => {
//       setLoading(true);
//       setError(null);

//       fetch(
//         `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/admin/metrics`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       )
//         .then((res) => {
//           if (res.status === 401) {
//             logout();
//             throw new Error('Session expired, please log in again');
//           }
//           return res.json();
//         })
//         .then((body) => {
//           setMetrics({
//             userCount:     body.userCount     ?? 0,
//             cleanupCount:  body.cleanupCount  ?? 0,
//             pendingCount:  body.pendingCount  ?? 0,
//             eduTotalCount: (body.eduTotalCount ?? body.eduVideosCount) ?? 0,
//             authorsCount:  body.authorsCount  ?? 0,
//             rewardsCount:  body.rewardsCount  ?? 0,
//             feedbackCount: body.feedbackCount ?? 0,
//           });
//         })
//         .catch((e) => setError(e.message))
//         .finally(() => setLoading(false));
//     };

//     load();
//     const id = setInterval(load, 30000); // optional auto-refresh
//     return () => clearInterval(id);
//   }, [token, logout]);

//   if (error) {
//     return (
//       <div className="p-6 text-red-600">
//         <p>Error loading dashboard: {error}</p>
//       </div>
//     );
//   }

//   if (loading || !token) {
//     return (
//       <div className="flex items-center justify-center h-full">
//         <svg className="animate-spin h-8 w-8 text-green-600" viewBox="0 0 24 24">
//           <circle
//             className="opacity-25"
//             cx="12"
//             cy="12"
//             r="10"
//             stroke="currentColor"
//             strokeWidth="4"
//             fill="none"
//           />
//           <path
//             className="opacity-75"
//             fill="currentColor"
//             d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//           />
//         </svg>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         <StatCard
//           title="Total Users"
//           value={metrics.userCount}
//           Icon={UserGroupIcon}
//           borderColor="border-green-500"
//         />
//         <StatCard
//           title="Total Cleanups"
//           value={metrics.cleanupCount}
//           Icon={ClipboardDocumentListIcon}
//           borderColor="border-blue-500"
//         />
//         <StatCard
//           title="Pending Requests"
//           value={metrics.pendingCount}
//           Icon={ClockIcon}
//           borderColor="border-yellow-500"
//         />

//         <StatCard
//           title="Education Posts"
//           value={metrics.eduTotalCount}
//           Icon={PhotoIcon}
//           borderColor="border-purple-500"
//         />
//         <StatCard
//           title="Authors"
//           value={metrics.authorsCount}
//           Icon={UsersIcon}
//           borderColor="border-indigo-500"
//         />
//         <StatCard
//           title="Rewards Claimed"
//           value={metrics.rewardsCount}
//           Icon={GiftIcon}
//           borderColor="border-pink-500"
//         />
//         <StatCard
//           title="Feedback Count"
//           value={metrics.feedbackCount}
//           Icon={ChatBubbleBottomCenterTextIcon}
//           borderColor="border-teal-500"
//         />
//       </div>
//     </div>
//   );
// }






//sabirin
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  UserGroupIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  PhotoIcon,
  GiftIcon,
  UsersIcon,
  ChatBubbleBottomCenterTextIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import { Pie, Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function StatCard({ title, value, Icon, borderColor = 'border-gray-200' }) {
  const iconColorClass = borderColor.startsWith('border-')
    ? borderColor.replace('border-', 'text-')
    : 'text-gray-500';

  return (
    <div
      className={`
        flex flex-col justify-between
        w-64 h-32
        bg-white
        rounded-2xl
        shadow-md
        border-l-4
        ${borderColor}
        p-6
      `}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        {Icon && <Icon className={`h-6 w-6 ${iconColorClass}`} />}
      </div>
      <span className="mt-4 text-3xl font-bold text-gray-800">{value}</span>
    </div>
  );
}

export default function Dashboard() {
  const { token, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [metrics, setMetrics] = useState({
    userCount: 0,
    cleanupCount: 0,
    completedCleanupCount: 0,
    pendingCount: 0,
    eduTotalCount: 0,
    authorsCount: 0,
    rewardsCount: 0,
    feedbackCount: 0,
  });

  const [charts, setCharts] = useState({
    statusDistribution: {
      labels: [],
      datasets: [{ data: [] }]
    },
    monthlyTrends: {
      labels: [],
      datasets: [{ data: [] }]
    },
    wasteTypes: {
      labels: [],
      datasets: [{ data: [] }]
    }
  });

  useEffect(() => {
    if (!token) return;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const headers = { Authorization: `Bearer ${token}` };
        const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

        const [
          metricsRes,
          completedRes,
          chart1Res,
          chart2Res,
          chart3Res
        ] = await Promise.all([
          fetch(`${API}/admin/metrics`, { headers }),
          fetch(`${API}/admin/reports/total-cleanups-completed`, { headers }),
          fetch(`${API}/admin/charts/cleanup-status`, { headers }),
          fetch(`${API}/admin/charts/monthly-cleanups`, { headers }),
          fetch(`${API}/admin/charts/waste-types`, { headers }),
        ]);

        if ([metricsRes, completedRes].some(r => r.status === 401)) {
          logout();
          throw new Error('Session expired, please log in again');
        }

        const metricsData = await metricsRes.json();
        const completedData = await completedRes.json();

        const chart1 = await chart1Res.json();
        const chart2 = await chart2Res.json();
        const chart3 = await chart3Res.json();

        setMetrics({
          userCount: metricsData.userCount ?? 0,
          cleanupCount: metricsData.cleanupCount ?? 0,
          completedCleanupCount: completedData.totalCompleted ?? 0,
          pendingCount: metricsData.pendingCount ?? 0,
          eduTotalCount: (metricsData.eduTotalCount ?? metricsData.eduVideosCount) ?? 0,
          authorsCount: metricsData.authorsCount ?? 0,
          rewardsCount: metricsData.rewardsCount ?? 0,
          feedbackCount: metricsData.feedbackCount ?? 0,
        });

        setCharts({
          statusDistribution: {
            labels: chart1.labels ?? [],
            datasets: [
              {
                label: 'Cleanups by Status',
                backgroundColor: ['#22c55e', '#facc15', '#ef4444', '#60a5fa'],
                data: chart1.data ?? []
              }
            ]
          },
          monthlyTrends: {
            labels: chart2.labels ?? [],
            datasets: [
              {
                label: 'Cleanups Per Month',
                backgroundColor: '#3b82f6',
                data: chart2.data ?? []
              }
            ]
          },
          wasteTypes: {
            labels: chart3.labels ?? [],
            datasets: [
              {
                label: 'Waste Types',
                backgroundColor: ['#06b6d4', '#10b981', '#8b5cf6', '#f59e0b'],
                data: chart3.data ?? []
              }
            ]
          }
        });

      } catch (e) {
        console.error(e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    load();
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, [token, logout]);

  if (error) {
    return <div className="p-6 text-red-600">Error loading dashboard: {error}</div>;
  }

  if (loading || !token) {
    return (
      <div className="flex items-center justify-center h-full">
        <svg className="animate-spin h-8 w-8 text-green-600" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <StatCard title="Total Users" value={metrics.userCount} Icon={UserGroupIcon} borderColor="border-green-500" />
        <StatCard title="Total Cleanups" value={metrics.cleanupCount} Icon={ClipboardDocumentListIcon} borderColor="border-blue-500" />
        <StatCard title="Completed Cleanups" value={metrics.completedCleanupCount} Icon={CheckCircleIcon} borderColor="border-indigo-500" />
        <StatCard title="Pending Requests" value={metrics.pendingCount} Icon={ClockIcon} borderColor="border-yellow-500" />
        <StatCard title="Education Posts" value={metrics.eduTotalCount} Icon={PhotoIcon} borderColor="border-purple-500" />
        <StatCard title="Authors" value={metrics.authorsCount} Icon={UsersIcon} borderColor="border-pink-500" />
        <StatCard title="Rewards Claimed" value={metrics.rewardsCount} Icon={GiftIcon} borderColor="border-orange-500" />
        <StatCard title="Feedback Count" value={metrics.feedbackCount} Icon={ChatBubbleBottomCenterTextIcon} borderColor="border-teal-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {charts.statusDistribution.labels.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Cleanups by Status</h2>
            <Pie data={charts.statusDistribution} />
          </div>
        )}

        {charts.monthlyTrends.labels.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Monthly Cleanup Trends</h2>
            <Bar data={charts.monthlyTrends} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>
        )}

        {charts.wasteTypes.labels.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Waste Type Distribution</h2>
            <Doughnut data={charts.wasteTypes} />
          </div>
        )}
      </div>
    </div>
  );
}
