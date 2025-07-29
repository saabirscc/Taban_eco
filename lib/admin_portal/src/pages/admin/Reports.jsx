// // lib/admin/src/pages/admin/Reports.jsx
// import React, { useEffect, useState } from 'react';
// import { Bar } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   Legend,
//   Title,
//   Tooltip
// } from 'chart.js';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const API_ROOT = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// export default function Reports() {
//   const [loading, setLoading] = useState(true);
//   const [error,   setError]   = useState(null);
//   const [unauth,  setUnauth]  = useState(false);

//   const [participation, setParticipation] = useState({
//     cleanupsByMonth: [],
//     feedbackByMonth: [],
//   });
//   const [wasteData, setWasteData] = useState([]);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       setUnauth(true);
//       setLoading(false);
//       return;
//     }

//     async function fetchReports() {
//       try {
//         const headers = {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         };

//         const [p, w] = await Promise.all([
//           fetch(`${API_ROOT}/api/admin/reports/participation`, { headers, cache: 'no-store' }),
//           fetch(`${API_ROOT}/api/admin/reports/waste-analysis`,    { headers, cache: 'no-store' })
//         ]);

//         if (p.status === 401 || w.status === 401) {
//           setUnauth(true);
//           return;
//         }
//         if (!p.ok || !w.ok) throw new Error('Failed to load report data.');

//         const [participationData, wasteAnalysisData] = await Promise.all([p.json(), w.json()]);

//         setParticipation(participationData);
//         setWasteData(wasteAnalysisData);
//       } catch (err) {
//         console.error(err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchReports();
//   }, []);

//   const handleExport = (section, format) => {
//     const token = localStorage.getItem('token');
//     if (!token) return;
//     window.open(`${API_ROOT}/api/admin/reports/${section}/${format}`, '_blank');
//   };

//   // Loading / auth / error states
//   if (loading) {
//     return (
//       <div className="p-6 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-gray-600 mr-3" />
//         <span className="text-gray-600 text-lg">Loading reports…</span>
//       </div>
//     );
//   }
//   if (unauth) {
//     return <div className="p-6 text-red-600">Not authorized. Please log in as an admin.</div>;
//   }
//   if (error) {
//     return <div className="p-6 text-red-600">Error: {error}</div>;
//   }

//   // Prepare charts
//   const partLabels   = participation.cleanupsByMonth.map(c => c._id);
//   const partCleanups = participation.cleanupsByMonth.map(c => c.count);
//   const partFeedback = partLabels.map(label => {
//     const f = participation.feedbackByMonth.find(fb => fb._id === label);
//     return f ? f.count : 0;
//   });
//   const participationChartData = {
//     labels: partLabels,
//     datasets: [
//       { label: 'Cleanups', data: partCleanups, backgroundColor: 'rgba(75,192,192,0.6)' },
//       { label: 'Feedback', data: partFeedback, backgroundColor: 'rgba(153,102,255,0.6)' },
//     ]
//   };

//   const wasteLabels  = wasteData.map(w => w._id);
//   const wasteCounts  = wasteData.map(w => w.count);
//   const wasteChartData = {
//     labels: wasteLabels,
//     datasets: [
//       { label: 'Count', data: wasteCounts, backgroundColor: 'rgba(255,159,64,0.6)' }
//     ]
//   };

//   const chartOptions = { 
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { position: 'top' },
//       title:  { display: true, text: '' }
//     }
//   };

//   return (
//     <div className="p-6 grid gap-8 sm:grid-cols-1 lg:grid-cols-2">
//       {/* Participation Card */}
//       <div className="bg-white rounded-xl shadow-md p-6 flex flex-col">
//         <h2 className="text-2xl font-semibold mb-4">Participation (Monthly)</h2>
//         <div className="h-64 mb-4">
//           <Bar 
//             data={participationChartData} 
//             options={{
//               ...chartOptions,
//               plugins: { 
//                 ...chartOptions.plugins,
//                 title: { display: true, text: 'Cleanups vs Feedback' }
//               }
//             }} 
//           />
//         </div>
//         <div className="mt-auto flex flex-col sm:flex-row gap-3">
//           <button
//             onClick={() => handleExport('participation', 'pdf')}
//             className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
//           >
//             Export PDF
//           </button>
//           <button
//             onClick={() => handleExport('participation', 'excel')}
//             className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//           >
//             Export Excel
//           </button>
//         </div>
//       </div>

//       {/* Waste Analysis Card */}
//       <div className="bg-white rounded-xl shadow-md p-6 flex flex-col">
//         <h2 className="text-2xl font-semibold mb-4">Waste Type Analysis</h2>
//         <div className="h-64 mb-4">
//           <Bar 
//             data={wasteChartData} 
//             options={{
//               ...chartOptions,
//               plugins: { 
//                 ...chartOptions.plugins,
//                 title: { display: true, text: 'Waste Counts by Type' }
//               }
//             }} 
//           />
//         </div>
//         <div className="mt-auto flex flex-col sm:flex-row gap-3">
//           <button
//             onClick={() => handleExport('waste-analysis', 'pdf')}
//             className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
//           >
//             Export PDF
//           </button>
//           <button
//             onClick={() => handleExport('waste-analysis', 'excel')}
//             className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//           >
//             Export Excel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }








// lib/admin/src/pages/admin/Reports.jsx
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Title,
  Tooltip
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const API_ROOT = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unauth, setUnauth] = useState(false);

  const [participation, setParticipation] = useState({
    cleanupsByMonth: [],
    feedbackByMonth: [],
  });
  const [wasteData, setWasteData] = useState([]);
  const [totalCleanups, setTotalCleanups] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUnauth(true);
      setLoading(false);
      return;
    }

    async function fetchReports() {
      try {
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        };

        const [p, w, t] = await Promise.all([
          fetch(`${API_ROOT}/api/admin/reports/participation`, { headers, cache: 'no-store' }),
          fetch(`${API_ROOT}/api/admin/reports/waste-analysis`, { headers, cache: 'no-store' }),
          fetch(`${API_ROOT}/api/admin/reports/total-cleanups-completed`, { headers, cache: 'no-store' })
        ]);

        if (p.status === 401 || w.status === 401 || t.status === 401) {
          setUnauth(true);
          return;
        }
        if (!p.ok || !w.ok || !t.ok) throw new Error('Failed to load report data.');

        const [participationData, wasteAnalysisData, totalCleanupsData] = await Promise.all([
          p.json(), w.json(), t.json()
        ]);

        setParticipation(participationData);
        setWasteData(wasteAnalysisData);
        setTotalCleanups(totalCleanupsData.totalCompleted || 0);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
  }, []);

  const handleExport = (section, format) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    window.open(`${API_ROOT}/api/admin/reports/${section}/${format}`, '_blank');
  };

  // Loading / auth / error states
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-gray-600 mr-3" />
        <span className="text-gray-600 text-lg">Loading reports…</span>
      </div>
    );
  }
  if (unauth) {
    return <div className="p-6 text-red-600">Not authorized. Please log in as an admin.</div>;
  }
  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }

  // Prepare charts
  const partLabels = participation.cleanupsByMonth.map(c => c._id);
  const partCleanups = participation.cleanupsByMonth.map(c => c.count);
  const partFeedback = partLabels.map(label => {
    const f = participation.feedbackByMonth.find(fb => fb._id === label);
    return f ? f.count : 0;
  });
  const participationChartData = {
    labels: partLabels,
    datasets: [
      { label: 'Cleanups', data: partCleanups, backgroundColor: 'rgba(75,192,192,0.6)' },
      { label: 'Feedback', data: partFeedback, backgroundColor: 'rgba(153,102,255,0.6)' },
    ]
  };

  const wasteLabels = wasteData.map(w => w._id);
  const wasteCounts = wasteData.map(w => w.count);
  const wasteChartData = {
    labels: wasteLabels,
    datasets: [
      { label: 'Count', data: wasteCounts, backgroundColor: 'rgba(255,159,64,0.6)' }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: '' }
    }
  };

  return (
    <div className="p-6 grid gap-8 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      {/* Participation Card */}
      <div className="bg-white rounded-xl shadow-md p-6 flex flex-col">
        <h2 className="text-2xl font-semibold mb-4">Participation (Monthly)</h2>
        <div className="h-64 mb-4">
          <Bar
            data={participationChartData}
            options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                title: { display: true, text: 'Cleanups vs Feedback' }
              }
            }}
          />
        </div>
        <div className="mt-auto flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => handleExport('participation', 'pdf')}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Export PDF
          </button>
          <button
            onClick={() => handleExport('participation', 'excel')}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Export Excel
          </button>
        </div>
      </div>

      {/* Waste Analysis Card */}
      <div className="bg-white rounded-xl shadow-md p-6 flex flex-col">
        <h2 className="text-2xl font-semibold mb-4">Waste Type Analysis</h2>
        <div className="h-64 mb-4">
          <Bar
            data={wasteChartData}
            options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                title: { display: true, text: 'Waste Counts by Type' }
              }
            }}
          />
        </div>
        <div className="mt-auto flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => handleExport('waste-analysis', 'pdf')}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Export PDF
          </button>
          <button
            onClick={() => handleExport('waste-analysis', 'excel')}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Export Excel
          </button>
        </div>
      </div>

      {/* Total Cleanups Completed Card */}
      <div className="bg-white rounded-xl shadow-md p-6 flex flex-col">
        <h2 className="text-2xl font-semibold mb-4">Total Cleanups Completed</h2>
        <div className="flex-1 flex items-center justify-center text-4xl font-bold text-blue-600">
          {totalCleanups}
        </div>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => handleExport('total-cleanups-completed', 'pdf')}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Export PDF
          </button>
          <button
            onClick={() => handleExport('total-cleanups-completed', 'excel')}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Export Excel
          </button>
        </div>
      </div>
    </div>
  );
}
