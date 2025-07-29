// import React, { useState } from 'react';
// import axios from 'axios';
// import { CloudArrowUpIcon, MapPinIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

// const PostCleanupStory = () => {
//   const [beforeImage, setBeforeImage] = useState(null);
//   const [afterImage, setAfterImage] = useState(null);
//   const [location, setLocation] = useState('');
//   const [description, setDescription] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ text: '', type: '' });

//   const handleBeforeImageChange = (e) => {
//     setBeforeImage(e.target.files[0]);
//   };

//   const handleAfterImageChange = (e) => {
//     setAfterImage(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage({ text: '', type: '' });

//     // Prepare the form data
//     const formData = new FormData();
//     formData.append('beforeImage', beforeImage);
//     formData.append('afterImage', afterImage);
//     formData.append('location', location);
//     formData.append('description', description);

//     try {
//       // Update the URL here to match your backend server
//       const response = await axios.post('http://localhost:5000/api/cleanup-progress/post', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data', // Important header for file uploads
//         },
//       });

//       // On success
//       setMessage({ text: 'Cleanup story posted successfully!', type: 'success' });

//       // Reset form after successful submission
//       setBeforeImage(null);
//       setAfterImage(null);
//       setLocation('');
//       setDescription('');
//     } catch (error) {
//       // Handle error
//       setMessage({ text: 'Error posting cleanup story. Please try again.', type: 'error' });
//       console.error(error); // Log the error to understand the issue
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6">Share Your Cleanup Story</h2>
      
//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Image Upload Section */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">
//               Before Image
//             </label>
//             <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
//               <div className="space-y-1 text-center">
//                 <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
//                 <div className="flex text-sm text-gray-600">
//                   <label className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none">
//                     <span>Upload a file</span>
//                     <input 
//                       type="file" 
//                       onChange={handleBeforeImageChange} 
//                       className="sr-only" 
//                       required 
//                       accept="image/*"
//                     />
//                   </label>
//                   <p className="pl-1">or drag and drop</p>
//                 </div>
//                 <p className="text-xs text-gray-500">
//                   PNG, JPG up to 5MB
//                 </p>
//                 {beforeImage && (
//                   <p className="text-sm text-green-600 mt-2">
//                     {beforeImage.name} selected
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">
//               After Image
//             </label>
//             <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
//               <div className="space-y-1 text-center">
//                 <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
//                 <div className="flex text-sm text-gray-600">
//                   <label className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none">
//                     <span>Upload a file</span>
//                     <input 
//                       type="file" 
//                       onChange={handleAfterImageChange} 
//                       className="sr-only" 
//                       required 
//                       accept="image/*"
//                     />
//                   </label>
//                   <p className="pl-1">or drag and drop</p>
//                 </div>
//                 <p className="text-xs text-gray-500">
//                   PNG, JPG up to 5MB
//                 </p>
//                 {afterImage && (
//                   <p className="text-sm text-green-600 mt-2">
//                     {afterImage.name} selected
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Location Field */}
//         <div className="space-y-2">
//           <label htmlFor="location" className="block text-sm font-medium text-gray-700">
//             Location
//           </label>
//           <div className="mt-1 relative rounded-md shadow-sm">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <MapPinIcon className="h-5 w-5 text-gray-400" />
//             </div>
//             <input
//               type="text"
//               id="location"
//               value={location}
//               onChange={(e) => setLocation(e.target.value)}
//               className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2 border"
//               placeholder="Where did the cleanup happen?"
//               required
//             />
//           </div>
//         </div>

//         {/* Description Field */}
//         <div className="space-y-2">
//           <label htmlFor="description" className="block text-sm font-medium text-gray-700">
//             Description (Optional)
//           </label>
//           <div className="mt-1 relative rounded-md shadow-sm">
//             <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
//               <PencilSquareIcon className="h-5 w-5 text-gray-400" />
//             </div>
//             <textarea
//               id="description"
//               rows={4}
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2 border"
//               placeholder="Tell us about your cleanup experience..."
//             />
//           </div>
//         </div>

//         {/* Submit Button */}
//         <div className="flex justify-end">
//           <button
//             type="submit"
//             disabled={loading}
//             className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
//           >
//             {loading ? (
//               <>
//                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Posting...
//               </>
//             ) : (
//               'Post Your Story'
//             )}
//           </button>
//         </div>

//         {/* Message Display */}
//         {message.text && (
//           <div className={`mt-4 p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
//             {message.text}
//           </div>
//         )}
//       </form>
//     </div>
//   );
// };

// export default PostCleanupStory;




//last update 
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CloudArrowUpIcon,
  MapPinIcon,
  PencilSquareIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const API_URL = 'http://localhost:5000/api/cleanup-progress';

const PostCleanupStory = () => {
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [stories, setStories] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editLocation, setEditLocation] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Fetch all cleanup stories
  const fetchStories = async () => {
    try {
      const response = await axios.get(API_URL);
      setStories(response.data);
    } catch (error) {
      console.error("Error fetching stories:", error);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  // Clear message when user starts typing or uploading
  const handleBeforeImageChange = (e) => {
    setBeforeImage(e.target.files[0]);
    setMessage(null);
  };
  const handleAfterImageChange = (e) => {
    setAfterImage(e.target.files[0]);
    setMessage(null);
  };
  const handleLocationChange = (e) => {
    setLocation(e.target.value);
    setMessage(null);
  };
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('beforeImage', beforeImage);
    formData.append('afterImage', afterImage);
    formData.append('location', location);
    formData.append('description', description);

    try {
      await axios.post(`${API_URL}/post`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage({ text: 'Cleanup story posted successfully!', type: 'success' });
      setBeforeImage(null);
      setAfterImage(null);
      setLocation('');
      setDescription('');
      fetchStories();
    } catch (error) {
      setMessage({ text: 'Error posting cleanup story. Please try again.', type: 'error' });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/delete/${id}`);
      setMessage({ text: 'Cleanup story deleted successfully!', type: 'success' });
      fetchStories();
    } catch (error) {
      setMessage({ text: 'Error deleting cleanup story.', type: 'error' });
      console.error(error);
    }
  };

  const handleEdit = (story) => {
    setEditId(story._id);
    setEditLocation(story.location);
    setEditDescription(story.description);
    setMessage(null);
  };

  const handleUpdate = async (id) => {
    try {
      const updatedData = { location: editLocation, description: editDescription };
      await axios.put(`${API_URL}/update/${id}`, updatedData);
      setMessage({ text: 'Cleanup story updated successfully!', type: 'success' });
      setEditId(null);
      setEditLocation('');
      setEditDescription('');
      fetchStories();
    } catch (error) {
      setMessage({ text: 'Error updating cleanup story.', type: 'error' });
      console.error(error);
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditLocation('');
    setEditDescription('');
    setMessage(null);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Share Your Cleanup Story</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Before Image</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none">
                    <span>Upload a file</span>
                    <input type="file" onChange={handleBeforeImageChange} className="sr-only" required accept="image/*" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                {beforeImage && <p className="text-sm text-green-600 mt-2">{beforeImage.name} selected</p>}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">After Image</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none">
                    <span>Upload a file</span>
                    <input type="file" onChange={handleAfterImageChange} className="sr-only" required accept="image/*" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                {afterImage && <p className="text-sm text-green-600 mt-2">{afterImage.name} selected</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Location Field */}
        <div className="space-y-2">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPinIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="location"
              value={location}
              onChange={handleLocationChange}
              className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2 border"
              placeholder="Where did the cleanup happen?"
              required
            />
          </div>
        </div>

        {/* Description Field */}
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description (Optional)</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
              <PencilSquareIcon className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={handleDescriptionChange}
              className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2 border"
              placeholder="Tell us about your cleanup experience..."
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Posting...
              </>
            ) : (
              'Post Your Story'
            )}
          </button>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mt-4 p-4 rounded-md flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message.type === 'success' ? (
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
            ) : (
              <XCircleIcon className="h-5 w-5 text-red-500" />
            )}
            <span>{message.text}</span>
          </div>
        )}
      </form>

      {/* Display all submitted stories */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Cleanup Stories</h3>
        {stories.length === 0 && <p className="text-gray-500">No stories yet.</p>}
        {stories.map(story => (
          <div key={story._id} className="mb-8 p-6 bg-gray-50 rounded-xl shadow-md transition-shadow hover:shadow-lg">
            <div className="md:flex md:space-x-8 space-y-4 md:space-y-0">
              {/* Before Image */}
              <div className="flex-1">
                <span className="block font-semibold text-gray-700 mb-2 text-center">Before Cleanup</span>
                <div className="flex justify-center">
                  <img
                    src={`http://localhost:5000/${story.beforeImage}`}
                    alt="Before Cleanup"
                    className="rounded-lg shadow max-h-56 object-cover object-center border border-gray-200"
                    style={{ maxWidth: '100%', width: '320px' }}
                  />
                </div>
              </div>
              {/* After Image */}
              <div className="flex-1">
                <span className="block font-semibold text-gray-700 mb-2 text-center">After Cleanup</span>
                <div className="flex justify-center">
                  <img
                    src={`http://localhost:5000/${story.afterImage}`}
                    alt="After Cleanup"
                    className="rounded-lg shadow max-h-56 object-cover object-center border border-gray-200"
                    style={{ maxWidth: '100%', width: '320px' }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-6">
              {editId === story._id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editLocation}
                    onChange={e => setEditLocation(e.target.value)}
                    className="border px-2 py-1 rounded w-full mb-2"
                  />
                  <textarea
                    value={editDescription}
                    onChange={e => setEditDescription(e.target.value)}
                    className="border px-2 py-1 rounded w-full mb-2"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleUpdate(story._id)}
                      className="flex items-center gap-1 text-green-600 hover:underline"
                      type="button"
                    >
                      <CheckCircleIcon className="h-5 w-5" /> Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center gap-1 text-gray-600 hover:underline"
                      type="button"
                    >
                      <XCircleIcon className="h-5 w-5" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-2">
                    <span className="font-semibold text-gray-800">Location:</span>
                    <span className="ml-2 text-gray-700">{story.location}</span>
                  </div>
                  <div className="mb-4">
                    <span className="font-semibold text-gray-800">Description:</span>
                    <span className="ml-2 text-gray-700">{story.description}</span>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleEdit(story)}
                      className="flex items-center gap-1 text-blue-600 hover:underline"
                      type="button"
                    >
                      <PencilSquareIcon className="h-5 w-5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(story._id)}
                      className="flex items-center gap-1 text-red-600 hover:underline"
                      type="button"
                    >
                      <TrashIcon className="h-5 w-5" /> Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostCleanupStory;