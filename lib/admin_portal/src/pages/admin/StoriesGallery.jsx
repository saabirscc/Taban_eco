import React, { useEffect, useState } from 'react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function StoriesGallery() {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    fetch(`${API}/public/stories`)
      .then(res => res.json())
      .then(setStories)
      .catch(err => console.error('Failed to load stories:', err));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center mb-10 text-green-700">Before & After Cleanup Stories</h2>

      {stories.length === 0 ? (
        <p className="text-center text-gray-600">No stories posted yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {stories.map(story => (
            <div key={story._id} className="border rounded-lg overflow-hidden shadow-md bg-white">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold text-green-600">{story.title}</h3>
                <p className="text-sm text-gray-500">{story.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 p-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Before</p>
                  {story.beforeImages?.map((url, idx) => (
                    <img
                      key={idx}
                      src={`${API.replace('/api', '')}/${url}`}
                      alt="Before"
                      className="w-full h-40 object-cover rounded mb-2"
                    />
                  ))}
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">After</p>
                  {story.afterImages?.map((url, idx) => (
                    <img
                      key={idx}
                      src={`${API.replace('/api', '')}/${url}`}
                      alt="After"
                      className="w-full h-40 object-cover rounded mb-2"
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
