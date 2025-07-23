import React, { useRef, useState, useEffect } from 'react';

// Base URL for static files (strip off /api suffix)
const STATIC_HOST = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/api$/i, '');
const kGreen = '#3CAC44';

/**
 * ImagePickerGrid supports both new File objects and existing URL strings.
 * Pass an initial array of File instances or URL strings.
 * onChanged returns the mixed array; your upload logic should handle filtering.
 */
export default function ImagePickerGrid({ initial = [], onChanged }) {
  const fileInput = useRef();
  const isInitial = useRef(true);
  const [items, setItems] = useState(initial);

  // Initialize items only on first mount (don't overwrite user edits)
  useEffect(() => {
    if (isInitial.current) {
      setItems(initial);
      isInitial.current = false;
    }
  }, [initial]);

  // Inform parent when items change
  useEffect(() => {
    onChanged(items);
  }, [items, onChanged]);

  // Clean up blob URLs on unmount
  useEffect(() => {
    return () => {
      items.forEach(item => {
        if (item instanceof File) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
    };
  }, [items]);

  // When user selects new files
  function handleAdd(e) {
    const chosenFiles = Array.from(e.target.files).map(file => {
      // attach a previewUrl to each File for revocation
      file.previewUrl = URL.createObjectURL(file);
      return file;
    });
    setItems(curr => [...curr, ...chosenFiles]);
    fileInput.current.value = null;
  }

  // Remove an item by index
  function handleRemove(idx) {
    setItems(curr => {
      const removed = curr[idx];
      if (removed instanceof File) {
        URL.revokeObjectURL(removed.previewUrl);
      }
      return curr.filter((_, i) => i !== idx);
    });
  }

  /**
   * Determine image source:
   *  • if item is a URL string, make sure it’s absolute by prefixing host when needed
   *  • if it's a File object, use its previewUrl
   */
const STATIC_HOST = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/api$/, '');

const getSrc = item => {
  if (typeof item === 'string') {
    // always drop whatever host and re-prefix
    const path = item.replace(/^https?:\/\/[^/]+/, '');
    return `${STATIC_HOST}/${path.replace(/^\/?/, '')}`;
  }
  return item.previewUrl; // for File objects
};


  return (
    <div className="space-y-2">
      {items.length === 0 ? (
        <button
          type="button"
          onClick={() => fileInput.current.click()}
          className="w-full h-36 flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition hover:bg-green-50"
          style={{ borderColor: kGreen }}
        >
          <svg className="h-8 w-8" stroke={kGreen} fill="none" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16V4m0 0l-4 4m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"
            />
          </svg>
          <span className="mt-2 text-lg font-medium" style={{ color: kGreen }}>
            Tap to add photos
          </span>
        </button>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {items.map((item, i) => (
            <div key={i} className="relative rounded-lg overflow-hidden">
              <img src={getSrc(item)} alt="" className="w-full h-24 object-cover" />
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 transition hover:bg-opacity-75"
              >
                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => fileInput.current.click()}
            className="flex items-center justify-center h-24 border-2 rounded-lg transition hover:bg-green-50"
            style={{ borderColor: kGreen }}
          >
            <svg className="h-6 w-6" stroke={kGreen} fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        multiple
        ref={fileInput}
        className="hidden"
        onChange={handleAdd}
      />
    </div>
  );
}