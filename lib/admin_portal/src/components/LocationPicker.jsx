// lib/admin/src/components/LocationPicker.jsx
import React, { useState, useCallback } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const kGreen         = '#3CAC44';
const containerStyle = { width: '100%', height: '250px' };
const defaultCenter  = { lat: 2.0371, lng: 45.3438 };

export default function LocationPicker({ initial, onPicked }) {
  const [marker, setMarker] = useState(initial || null);

  // Load Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const handleClick = useCallback((e) => {
    const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    setMarker(pos);
    onPicked({ lat: pos.lat, lng: pos.lng, address: null });
  }, [onPicked]);

  if (loadError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
        ⚠️ Error loading map. Check API key & billing.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="p-4 text-gray-600 text-sm">Loading map…</div>
    );
  }

  return (
    <div
      className="rounded-lg overflow-hidden shadow-sm"
      style={{ border: `2px solid ${kGreen}` }}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={marker || defaultCenter}
        zoom={marker ? 15 : 12}
        onClick={handleClick}
        options={{
          streetViewControl: false,
          mapTypeControl:    false,
          fullscreenControl: false,
          zoomControl:       true,
        }}
      >
        {marker && (
          <Marker
            position={marker}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: kGreen,
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: '#fff',
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
}
