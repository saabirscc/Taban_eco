// src/components/Hero.jsx
import React, { useEffect, useState, useMemo } from 'react';
import HeroCarousel from './HeroCarousel';
// import { Smartphone } from 'lucide-react'; // optional

const API_BASE =
  process.env.REACT_APP_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'http://localhost:5000/api';

/**
 * @typedef {{ _id:string }} Volunteer
 * @typedef {{ _id:string, status:string, volunteers:Volunteer[] }} Cleanup
 */

const HeroSection = () => {
  const [cleanups, setCleanups] = useState([]);   
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null); 

  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE}/public/cleanups`, {
          signal: ctrl.signal,
        });

        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.msg || `Request failed (${res.status})`);
        }

        const data = await res.json();
        setCleanups(Array.isArray(data) ? data : []);
      } catch (e) {
        if (e.name !== 'AbortError') setError(e.message || 'Network error');
      } finally {
        setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, []);

  const { completedCount, uniqueVolunteers } = useMemo(() => {
    const completed = cleanups.filter(c => c.status === 'completed').length;
    const vols = new Set();
    cleanups.forEach(c => c.volunteers?.forEach(v => vols.add(v._id)));
    return { completedCount: completed, uniqueVolunteers: vols.size };
  }, [cleanups]);

  return (
    <section id="home" className="pt-20 pb-24 bg-gradient-to-r from-green-500 to-green-600 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Left Content */}
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Clean Your City,
              <br />
              <span className="text-yellow-300">Save Your Future</span>
            </h1>

            <p className="text-lg text-white/90 leading-relaxed">
              Join our community-driven platform to transform your neighborhood.
              Together, we can create cleaner, healthier cities for everyone.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* <button className="flex items-center justify-center gap-2 bg-white text-green-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold shadow-lg transition-all">
                <Smartphone size={20} />
                Use Application
              </button> */}
              <button
                className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-6 py-3 rounded-lg font-semibold transition-all"
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
              >
                Learn More
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <StatBox label="Cleanups Done" value={loading ? '…' : String(completedCount)} />
              <StatBox label="Volunteers"    value={loading ? '…' : String(uniqueVolunteers)} />
              {/* <StatBox label="Requests" value={loading ? '…' : String(cleanups.length)} /> */}
            </div>

            {error && (
              <p className="text-sm text-red-100 bg-red-500/30 rounded-md px-3 py-2 mt-4">
                {error}
              </p>
            )}
          </div>

          {/* Right Content - Image Carousel */}
          <div className="md:w-1/2">
            <HeroCarousel />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

function StatBox({ value, label }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-yellow-300">{value}</div>
      <div className="text-white/80">{label}</div>
    </div>
  );
}
