import { create } from 'zustand';
import { trips as initialMockTrips } from '../utils/mockData';

// Initialize from localStorage or mockData
const getInitialTrips = () => {
  // Force reset to apply the new products for the user
  localStorage.setItem('weshareit_trips', JSON.stringify(initialMockTrips));
  return initialMockTrips;
};

const useProductStore = create((set) => ({
  trips: getInitialTrips(),

  updateTrips: (updatedTrips) => set((state) => {
    localStorage.setItem('weshareit_trips', JSON.stringify(updatedTrips));
    return { trips: updatedTrips };
  }),
}));

export default useProductStore;
