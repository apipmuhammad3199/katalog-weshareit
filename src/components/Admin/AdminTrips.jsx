import React, { useState } from 'react';
import useProductStore from '../../store/useProductStore';
import { Plus, Edit2, Trash2, MapPin, Calendar, Image as ImageIcon, Save, X } from 'lucide-react';

const AdminTrips = () => {
  const trips = useProductStore((state) => state.trips);
  const updateTrips = useProductStore((state) => state.updateTrips);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    deadline: '',
    estimatedReadyDate: '',
    coverImage: '',
    status: 'open'
  });

  const handleOpenAdd = () => {
    setEditingTrip(null);
    setFormData({
      title: '',
      destination: '',
      deadline: '',
      estimatedReadyDate: '',
      coverImage: '',
      status: 'open'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (trip) => {
    setEditingTrip(trip);
    setFormData({
      title: trip.title || '',
      destination: trip.destination || '',
      deadline: trip.deadline || '',
      estimatedReadyDate: trip.estimatedReadyDate || '',
      coverImage: trip.coverImage || '',
      status: trip.status || 'open'
    });
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, coverImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fallbackImage = 'https://images.unsplash.com/photo-1549405085-5ee66f57de89?auto=format&fit=crop&w=1200&q=80';

    if (editingTrip) {
      // Update existing trip
      const updatedTrips = trips.map(t => t.id === editingTrip.id ? {
        ...t,
        ...formData,
        coverImage: formData.coverImage || fallbackImage
      } : t);
      updateTrips(updatedTrips);
    } else {
      // Add new trip
      const newTrip = {
        id: `trip-${Date.now()}`,
        ...formData,
        coverImage: formData.coverImage || fallbackImage,
        items: []
      };
      updateTrips([newTrip, ...trips]);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (tripId) => {
    if (window.confirm('Yakin ingin menghapus Trip PO ini beserta seluruh item di dalamnya?')) {
      const updatedTrips = trips.filter(t => t.id !== tripId);
      updateTrips(updatedTrips);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Manajemen Trip Pre-Order (PO)</h2>
          <p className="text-sm text-gray-500 mt-1">Tambah trip baru untuk membuka katalog pre-order dari luar negeri.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 rounded-2xl bg-[#bd6a4d] px-6 py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(189,106,77,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(189,106,77,0.4)] cursor-pointer"
        >
          <Plus size={18} /> Tambah Trip Baru
        </button>
      </div>

      {/* Grid of Trips */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map(trip => (
          <div key={trip.id} className="flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
              <img 
                src={trip.coverImage || 'https://images.unsplash.com/photo-1549405085-5ee66f57de89?auto=format&fit=crop&w=1200&q=80'} 
                alt={trip.title} 
                className="h-full w-full object-cover"
              />
              <div className="absolute top-3 right-3">
                <span className={`rounded-full px-3 py-1 text-xs font-bold shadow-sm backdrop-blur-md ${
                  trip.status === 'open' ? 'bg-emerald-500/90 text-white' : 'bg-slate-700/90 text-white'
                }`}>
                  {trip.status === 'open' ? 'BUKA' : 'DITUTUP'}
                </span>
              </div>
            </div>

            <div className="p-6 flex flex-col grow">
              <h3 className="text-xl font-bold text-slate-900 mb-2 leading-snug">{trip.title}</h3>
              
              <div className="space-y-2 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-[#B35938] shrink-0" />
                  <span>{trip.destination}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-[#B35938] shrink-0" />
                  <span>Tutup PO: <strong>{trip.deadline}</strong></span>
                </div>
                <div className="text-xs text-slate-500 pt-1 border-t border-gray-100">
                  Total Item: <strong className="text-slate-900">{trip.items?.length || 0} barang</strong>
                </div>
              </div>

              <div className="mt-auto flex gap-3 border-t border-gray-100 pt-4">
                <button 
                  onClick={() => handleOpenEdit(trip)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-50 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <Edit2 size={14} /> Edit Trip
                </button>
                <button 
                  onClick={() => handleDelete(trip.id)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-red-50 py-2.5 text-xs font-bold text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                >
                  <Trash2 size={14} /> Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Tambah / Edit Trip */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
          <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-slate-900 cursor-pointer"
            >
              <X size={20} />
            </button>

            <h3 className="text-2xl font-bold text-slate-900 mb-6">
              {editingTrip ? 'Edit Trip Pre-Order' : 'Tambah Trip Pre-Order Baru'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Judul Trip PO *</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Japan Snacks & Merch"
                  className="w-full rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#B35938] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Destinasi / Negara *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.destination}
                    onChange={e => setFormData({ ...formData, destination: e.target.value })}
                    placeholder="Contoh: Tokyo, Japan"
                    className="w-full rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#B35938] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Tanggal Tutup PO *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.deadline}
                    onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                    placeholder="Contoh: 15 Ags 2026"
                    className="w-full rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#B35938] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Estimasi Tiba di Indonesia (Opsional)</label>
                <input 
                  type="text" 
                  value={formData.estimatedReadyDate}
                  onChange={e => setFormData({ ...formData, estimatedReadyDate: e.target.value })}
                  placeholder="Contoh: Jakarta: 25 Agustus 2026"
                  className="w-full rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#B35938] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Gambar Cover / Banner</label>
                <div className="space-y-3">
                  <input 
                    type="url" 
                    value={formData.coverImage.startsWith('data:') ? '' : formData.coverImage}
                    onChange={e => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="Masukkan URL Gambar (https://...)"
                    className="w-full rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#B35938] focus:bg-white"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 font-bold uppercase">Atau Upload Gambar:</span>
                    <label className="cursor-pointer text-xs font-bold text-[#B35938] hover:underline flex items-center gap-1">
                      <ImageIcon size={14} /> Pilih File
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  </div>
                </div>
                {formData.coverImage && (
                  <div className="mt-3">
                    <img src={formData.coverImage} alt="Preview" className="h-32 w-full object-cover rounded-xl border border-gray-200" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Status Pre-Order</label>
                <select 
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none"
                >
                  <option value="open">Buka (Open PO)</option>
                  <option value="closed">Ditutup (Closed PO)</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-gray-500 hover:text-slate-900 cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-slate-800 cursor-pointer"
                >
                  <Save size={16} /> Simpan Trip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTrips;
