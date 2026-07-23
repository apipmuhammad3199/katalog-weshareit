import React, { useState } from 'react';
import { Save, Upload } from 'lucide-react';
import { formatNumberWithDots } from '../../utils/formatters';

const ProductForm = ({ item, onSave, onSuccess }) => {
  const [formData, setFormData] = useState(
    item || {
      name: '',
      price: '',
      description: '',
      image: '',
      status: 'available'
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePriceChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    setFormData(prev => ({
      ...prev,
      price: raw ? Number(raw) : ''
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const numericPrice = typeof formData.price === 'number' ? formData.price : (Number(String(formData.price).replace(/\D/g, '')) || 0);
    const itemData = {
      ...formData,
      price: numericPrice,
      id: item?.id
    };
    if (onSave) {
      onSave(itemData);
    }
  };

  return (
    <form className="mx-auto max-w-2xl space-y-8" onSubmit={handleSubmit}>
      <h2 className="mb-8 text-3xl font-bold tracking-tight text-slate-900">{item ? 'Edit Item' : 'Tambah Item Baru'}</h2>
      
      <div>
        <label className="mb-1.5 block text-sm font-bold text-slate-700">Nama Item *</label>
        <input 
          type="text" name="name" value={formData.name} onChange={handleChange}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-colors focus:border-[#bd6a4d] focus:bg-white" 
          placeholder="Masukkan nama produk"
          required 
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-bold text-slate-700">Harga (Rp) *</label>
        <input 
          type="text"
          inputMode="numeric"
          name="price" 
          value={formatNumberWithDots(formData.price)} 
          onChange={handlePriceChange}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-colors focus:border-[#bd6a4d] focus:bg-white" 
          placeholder="Contoh: 150.000"
          required 
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-bold text-slate-700">Upload Gambar Produk {item ? '' : '*'}</label>
        <label className="flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 transition-colors hover:bg-slate-100">
          <Upload className="mb-2 h-8 w-8 text-slate-400" />
          <p className="text-sm font-semibold text-slate-500">Klik untuk memilih gambar</p>
          <input 
            type="file" accept="image/*" onChange={handleImageChange}
            className="hidden" required={!item}
          />
        </label>
        {formData.image && (
          <div className="mt-4">
            <img src={formData.image} alt="Preview" className="max-h-40 rounded-xl border border-slate-200 object-cover shadow-sm" />
          </div>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-bold text-slate-700">Deskripsi *</label>
        <textarea 
          name="description" value={formData.description} onChange={handleChange} rows="4"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-colors focus:border-[#bd6a4d] focus:bg-white" 
          placeholder="Jelaskan detail produk..."
          required 
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-bold text-slate-700">Status</label>
        <select 
          name="status" value={formData.status} onChange={handleChange}
          className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none transition-colors focus:border-[#bd6a4d] focus:bg-white" 
          required
        >
          <option value="available">Tersedia</option>
          <option value="closed">Ditutup</option>
        </select>
      </div>

      <div className="flex gap-4 pt-6">
        <button 
          type="button" 
          className="flex flex-1 items-center justify-center rounded-2xl border border-[#ebebeb] bg-white px-6 py-4 text-sm font-bold text-slate-700 shadow-[0_4px_15px_rgb(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgb(0,0,0,0.05)] hover:border-slate-200" 
          onClick={onSuccess}
        >
          Batal
        </button>
        <button 
          type="submit" 
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#bd6a4d] px-6 py-4 text-sm font-bold text-white shadow-[0_8px_20px_rgba(189,106,77,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(189,106,77,0.4)]"
        >
          <Save size={18} /> Simpan Item
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
