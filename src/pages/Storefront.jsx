import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';
import useProductStore from '../store/useProductStore';

const Storefront = () => {
  const trips = useProductStore((state) => state.trips);
  const [trackId, setTrackId] = useState('');
  const navigate = useNavigate();

  // Clear local storage for dev purposes to get the updated mock images
  useEffect(() => {
    const saved = localStorage.getItem('weshareit_trips');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0 && !parsed[0].coverImage) {
        localStorage.removeItem('weshareit_trips');
        window.location.reload();
      }
    }
  }, []);

  const handleTrack = (e) => {
    e.preventDefault();
    if (trackId.trim()) navigate(`/track/${trackId.trim()}`);
  };

  return (
    <div className="min-h-screen bg-[#f7f5f0] font-sans text-slate-900 pb-32 pt-28">
      
      {/* Hero Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-20 text-center md:text-left md:flex md:items-center md:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
            Shop the World, <br className="hidden md:block"/> Shared with You.
          </h1>
          <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto md:mx-0">
            Discover curated items from global trips and pre-order them directly. Premium quality, transparent tracking.
          </p>
          
          {/* Elevated Search Bar */}
          <form 
            onSubmit={handleTrack}
            className="flex items-center mx-auto md:mx-0 w-full max-w-md bg-white rounded-full p-2 shadow-[0_4px_40px_rgba(0,0,0,0.06)] border border-gray-100 transition-all duration-300 hover:shadow-[0_8px_50px_rgba(0,0,0,0.08)]"
          >
            <div className="pl-4 pr-2 text-gray-400">
              <Search size={20} strokeWidth={2} />
            </div>
            <input 
              type="text" 
              placeholder="Track your order ID..." 
              value={trackId}
              onChange={(e) => setTrackId(e.target.value)}
              className="flex-1 h-12 outline-none text-slate-900 font-medium placeholder:text-gray-400 placeholder:font-normal bg-transparent"
            />
            <button 
              type="submit"
              className="h-12 px-6 rounded-full bg-[#B35938] text-white font-bold text-sm hover:bg-[#99492d] transition-colors shadow-lg shadow-[#B35938]/20"
            >
              Track
            </button>
          </form>
        </div>
      </div>

      {/* PO Discovery - Compact List Layout */}
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Featured Trips</h2>
        </div>

        <div className="flex flex-col gap-3">
          {trips.map((trip) => (
            <Link 
              key={trip.id} 
              to={`/po/${trip.id}`}
              className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 transition-colors duration-200 hover:bg-slate-50 hover:border-gray-200 group"
            >
              <div className="flex flex-col items-start pr-4">
                {trip.status === 'open' && (
                  <span className="mb-2 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                    Buka
                  </span>
                )}
                <h3 className="mb-1 text-lg font-bold tracking-tight text-slate-900">{trip.title}</h3>
                <p className="text-sm text-gray-500">
                  {trip.destination} &middot; Tutup {trip.deadline}
                </p>
              </div>

              <div className="shrink-0 text-gray-300 transition-colors group-hover:text-slate-900">
                <ChevronRight size={20} strokeWidth={2} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Storefront;
