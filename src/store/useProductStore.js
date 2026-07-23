import { create } from 'zustand';
import { trips as initialMockTrips } from '../utils/mockData';

// Initialize from localStorage or mockData
const getInitialTrips = () => {
  const saved = localStorage.getItem('weshareit_trips');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.error('Failed to parse saved trips', e);
    }
  }
  localStorage.setItem('weshareit_trips', JSON.stringify(initialMockTrips));
  return initialMockTrips;
};

const useProductStore = create((set) => ({
  trips: getInitialTrips(),

  updateTrips: (updatedTrips) => {
    localStorage.setItem('weshareit_trips', JSON.stringify(updatedTrips));
    set({ trips: updatedTrips });
  },
}));

export default useProductStore;
