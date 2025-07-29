// // src/pages/CleanupPublicDetail.jsx
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// export default function CleanupPublicDetail() {
//   const { id } = useParams();
//   const [cleanup, setCleanup] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch(`${API_URL}/cleanup/${id}`)
//       .then(res => res.json())
//       .then(setCleanup)
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, [id]);

//   const getImageUrl = (path) =>
//     path.startsWith('http') ? path : `${API_URL.replace('/api', '')}/${path.replace(/^\/+/, '')}`;

//   if (loading) return <div className="p-6">Loading...</div>;
//   if (!cleanup) return <div className="p-6 text-red-600">Not Found</div>;

//   return (
//     <div className="p-6 max-w-4xl mx-auto space-y-8">
//       <h1 className="text-3xl font-bold text-green-700">{cleanup.title}</h1>
//       <p className="text-gray-700 text-lg">{cleanup.description}</p>
//       <p className="text-gray-600 text-sm">Location: {cleanup.location}</p>
//       <p className="text-sm text-gray-500">Status: <strong>{cleanup.status}</strong></p>

//       {/* BEFORE Images */}
//       {cleanup.beforeImages?.length > 0 && (
//         <div>
//           <h2 className="text-xl font-semibold text-orange-600 mt-6 mb-2">🟠 This is BEFORE Cleanup</h2>
//           <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//             {cleanup.beforeImages.map((img, i) => (
//               <img
//                 key={i}
//                 src={getImageUrl(img)}
//                 alt={`Before ${i}`}
//                 className="rounded shadow border object-cover h-40 w-full"
//               />
//             ))}
//           </div>
//         </div>
//       )}

//       {/* AFTER Images */}
//       {cleanup.afterImages?.length > 0 && (
//         <div>
//           <h2 className="text-xl font-semibold text-green-600 mt-6 mb-2">🟢 This is AFTER Cleanup</h2>
//           <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//             {cleanup.afterImages.map((img, i) => (
//               <img
//                 key={i}
//                 src={getImageUrl(img)}
//                 alt={`After ${i}`}
//                 className="rounded shadow border object-cover h-40 w-full"
//               />
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }





//sabrin updated the code
// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { format } from 'date-fns';

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// export default function CleanupPublicDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [cleanup, setCleanup] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchCleanup = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`${API_URL}/cleanup-stories/${id}`);
//         if (!res.ok) {
//           throw new Error('Cleanup story not found');
//         }
//         const data = await res.json();
//         setCleanup(data);
//       } catch (err) {
//         setError(err.message);
//         toast.error(err.message);
//         navigate('/');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCleanup();
//   }, [id, navigate]);

//   const getImageUrl = (path) =>
//     path.startsWith('http') ? path : `${API_URL.replace('/api', '')}/${path.replace(/^\/+/, '')}`;

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="text-red-600 text-lg">{error}</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-4xl mx-auto">
//         <div className="bg-white shadow-xl rounded-lg overflow-hidden">
//           {/* Header */}
//           <div className="bg-green-600 px-6 py-4">
//             <div className="flex justify-between items-center">
//               <h1 className="text-3xl font-bold text-white">{cleanup.title}</h1>
//               <button 
//                 onClick={() => navigate(-1)}
//                 className="text-white hover:text-gray-200"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//                 </svg>
//               </button>
//             </div>
//             <p className="text-green-100 mt-1">
//               {cleanup.location} • {format(new Date(cleanup.createdAt), 'MMMM d, yyyy')}
//             </p>
//           </div>

//           {/* Content */}
//           <div className="p-6 space-y-6">
//             <div className="prose max-w-none">
//               <p className="text-gray-700 text-lg">{cleanup.description}</p>
//             </div>

//             {/* BEFORE Images */}
//             {cleanup.beforeImages?.length > 0 && (
//               <div className="space-y-3">
//                 <h2 className="text-xl font-semibold text-orange-600 flex items-center">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd" />
//                   </svg>
//                   Before Cleanup
//                 </h2>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {cleanup.beforeImages.map((img, i) => (
//                     <div key={i} className="rounded-lg overflow-hidden shadow-md">
//                       <img
//                         src={getImageUrl(img)}
//                         alt={`Before cleanup ${i + 1}`}
//                         className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* AFTER Images */}
//             {cleanup.afterImages?.length > 0 && (
//               <div className="space-y-3">
//                 <h2 className="text-xl font-semibold text-green-600 flex items-center">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                   </svg>
//                   After Cleanup
//                 </h2>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {cleanup.afterImages.map((img, i) => (
//                     <div key={i} className="rounded-lg overflow-hidden shadow-md">
//                       <img
//                         src={getImageUrl(img)}
//                         alt={`After cleanup ${i + 1}`}
//                         className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Stats */}
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                 <div className="text-center">
//                   <p className="text-sm text-gray-500">Location</p>
//                   <p className="font-medium">{cleanup.location}</p>
//                 </div>
//                 <div className="text-center">
//                   <p className="text-sm text-gray-500">Posted</p>
//                   <p className="font-medium">{format(new Date(cleanup.createdAt), 'MMM d, yyyy')}</p>
//                 </div>
//                 <div className="text-center">
//                   <p className="text-sm text-gray-500">Status</p>
//                   <p className="font-medium capitalize">{cleanup.status}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }