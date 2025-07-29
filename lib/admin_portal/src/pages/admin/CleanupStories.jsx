// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const CleanupStories = () => {
//   const [stories, setStories] = useState([]);

//   useEffect(() => {
//     const fetchStories = async () => {
//       try {
//         const response = await axios.get('/api/cleanup-progress');
//         setStories(response.data);
//       } catch (error) {
//         console.error('Error fetching stories:', error);
//       }
//     };

//     fetchStories();
//   }, []);

//   return (
//     <div>
//       <h2>Cleanup Stories</h2>
//       {stories.length === 0 ? (
//         <p>No stories posted yet.</p>
//       ) : (
//         <div>
//           {stories.map((story) => (
//             <div key={story._id} className="story">
//               <h3>{story.location}</h3>
//               <p>{story.description}</p>
//               <div className="images">
//                 <img src={`/${story.beforeImage}`} alt="Before Cleanup" />
//                 <img src={`/${story.afterImage}`} alt="After Cleanup" />
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CleanupStories;
