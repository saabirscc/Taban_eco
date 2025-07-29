// import React, { useState } from 'react';
// import axios from 'axios';

// const CleanupProgressForm = () => {
//   const [beforeImage, setBeforeImage] = useState(null);
//   const [afterImage, setAfterImage] = useState(null);
//   const [location, setLocation] = useState('');
//   const [description, setDescription] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');

//   const handleBeforeImageChange = (e) => {
//     setBeforeImage(e.target.files[0]);
//   };

//   const handleAfterImageChange = (e) => {
//     setAfterImage(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const formData = new FormData();
//     formData.append('beforeImage', beforeImage);
//     formData.append('afterImage', afterImage);
//     formData.append('location', location);
//     formData.append('description', description);

//     try {
//       const response = await axios.post('/api/cleanup-progress/upload', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       setMessage('Cleanup progress uploaded successfully!');
//     } catch (error) {
//       setMessage('Error uploading cleanup progress.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <h2 className="text-xl font-bold">Upload Cleanup Progress</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label htmlFor="beforeImage" className="block font-semibold">Before Image</label>
//           <input
//             type="file"
//             id="beforeImage"
//             onChange={handleBeforeImageChange}
//             className="mt-2"
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="afterImage" className="block font-semibold">After Image</label>
//           <input
//             type="file"
//             id="afterImage"
//             onChange={handleAfterImageChange}
//             className="mt-2"
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="location" className="block font-semibold">Location</label>
//           <input
//             type="text"
//             id="location"
//             value={location}
//             onChange={(e) => setLocation(e.target.value)}
//             className="mt-2 p-2 w-full border"
//             placeholder="Enter location"
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="description" className="block font-semibold">Description (Optional)</label>
//           <textarea
//             id="description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="mt-2 p-2 w-full border"
//             placeholder="Enter any additional details"
//           />
//         </div>
//         <div className="flex justify-between">
//           <button type="submit" disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded">
//             {loading ? 'Uploading...' : 'Submit'}
//           </button>
//         </div>
//       </form>
//       {message && <p className="mt-4">{message}</p>}
//     </div>
//   );
// };

// export default CleanupProgressForm;


