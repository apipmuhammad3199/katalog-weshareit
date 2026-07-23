import React, { useState } from 'react';
import useProductStore from '../../store/useProductStore';
import ProductForm from './ProductForm';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const AdminProducts = () => {
  const trips = useProductStore((state) => state.trips);
  const updateTrips = useProductStore((state) => state.updateTrips);

  const [selectedTripId, setSelectedTripId] = useState(trips[0]?.id || '');
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const currentTrip = trips.find(t => t.id === selectedTripId) || trips[0];

  const handleAdd = () => {
    setEditingItem(null);
    setIsEditing(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsEditing(true);
  };

  const handleSaveItem = (itemData) => {
    if (!currentTrip) return;

    let updatedItems = [];
    if (itemData.id) {
      updatedItems = (currentTrip.items || []).map(i => i.id === itemData.id ? { ...itemData } : i);
    } else {
      const newItem = { ...itemData, id: `item-${Date.now()}` };
      updatedItems = [newItem, ...(currentTrip.items || [])];
    }

    const updatedTrips = trips.map(t => t.id === currentTrip.id ? { ...t, items: updatedItems } : t);
    updateTrips(updatedTrips);
    setIsEditing(false);
  };

  const handleDelete = (id) => {
    if (!currentTrip) return;
    if (window.confirm('Yakin ingin menghapus item ini?')) {
      const updatedItems = (currentTrip.items || []).filter(item => item.id !== id);
      const updatedTrips = trips.map(t => t.id === currentTrip.id ? { ...t, items: updatedItems } : t);
      updateTrips(updatedTrips);
    }
  };

  if (isEditing) {
    return (
      <div className="rounded-3xl bg-white p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#ebebeb]">
        <button 
          className="mb-8 flex items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-slate-800 cursor-pointer" 
          onClick={() => setIsEditing(false)}
        >
          &larr; Kembali ke Daftar Item
        </button>
        <ProductForm 
          item={editingItem} 
          onSave={handleSaveItem}
          onSuccess={() => setIsEditing(false)} 
        />
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#ebebeb]">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Daftar Item Trip</h2>
          {trips.length > 1 && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase">Pilih Trip:</span>
              <select 
                value={currentTrip?.id || ''} 
                onChange={(e) => setSelectedTripId(e.target.value)}
                className="rounded-xl border border-gray-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 outline-none"
              >
                {trips.map(t => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        <button 
          className="flex items-center gap-2 rounded-2xl bg-[#bd6a4d] px-6 py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(189,106,77,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(189,106,77,0.4)] cursor-pointer" 
          onClick={handleAdd}
        >
          <Plus size={18} /> Tambah Item
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {currentTrip?.items?.map(item => (
          <div key={item.id} className="flex flex-col overflow-hidden rounded-3xl border border-[#ebebeb] bg-white shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] h-full">
            <div className="relative w-full pb-[100%] bg-slate-50">
              <img 
                src={item.image || 'https://via.placeholder.com/150'} 
                alt={item.name} 
                className="absolute inset-0 h-full w-full object-cover" 
              />
              <div className="absolute right-3 top-3">
                <span className={`rounded-full px-3 py-1 text-xs font-bold shadow-sm backdrop-blur-sm ${
                  item.status === 'available' ? 'bg-green-100/90 text-green-700' : 'bg-red-100/90 text-red-700'
                }`}>
                  {item.status === 'available' ? 'Tersedia' : 'Ditutup'}
                </span>
              </div>
            </div>
            
            <div className="flex grow flex-col p-5">
              <h3 className="mb-1 text-base font-bold tracking-tight text-slate-900 line-clamp-2">{item.name}</h3>
              <p className="mb-5 text-lg font-bold text-[#bd6a4d]">Rp {item.price?.toLocaleString('id-ID')}</p>
              
              <div className="mt-auto flex gap-3 border-t border-slate-100 pt-4">
                <button 
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-50 py-2.5 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-100 cursor-pointer" 
                  onClick={() => handleEdit(item)}
                >
                  <Edit2 size={14} /> Edit
                </button>
                <button 
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-red-50 py-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-100 cursor-pointer" 
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 size={14} /> Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;
