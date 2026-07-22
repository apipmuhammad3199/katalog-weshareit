import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Copy, CheckCircle2, Upload, MapPin, Calendar, Info } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import useProductStore from '../store/useProductStore';
import useCartStore from '../store/useCartStore';

const Home = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const trips = useProductStore((state) => state.trips);
  const trip = trips.find(t => t.id === id);
  const { cart, clearCart } = useCartStore();
  
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    telegram: '',
    notes: '',
    shippingMethod: 'courier',
    address: '',
    paymentScheme: 'DP' // Strictly DP now
  });

  const [paymentProofBase64, setPaymentProofBase64] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleCopyBank = () => {
    navigator.clipboard.writeText('1234567890');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUploadProof = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentProofBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  
  let totalPrice = 0;
  if (trip && trip.items) {
    Object.entries(cart).forEach(([itemId, qty]) => {
      const item = trip.items.find(i => i.id === itemId);
      if (item) {
        totalPrice += item.price * qty;
      }
    });
  }

  const amountToPayNow = totalPrice * 0.75;
  const remainingAmount = totalPrice * 0.25;

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    if (!customerInfo.name || !customerInfo.phone) {
      alert('Mohon lengkapi nama dan WhatsApp.');
      return;
    }
    if (customerInfo.shippingMethod === 'courier' && !customerInfo.address) {
      alert('Mohon isi alamat pengiriman.');
      return;
    }
    if (!paymentProofBase64) {
      alert('Mohon upload bukti pembayaran (screenshot).');
      return;
    }

    const orderId = `ORD-${Date.now()}`;
    
    const orderPayload = {
      id: orderId,
      tripId: trip.id,
      tripTitle: trip.title,
      date: new Date().toISOString(),
      customer: customerInfo,
      items: Object.entries(cart).map(([itemId, qty]) => {
        const item = trip.items.find(i => i.id === itemId);
        return {
          itemId,
          name: item?.name || 'Unknown Item',
          price: item?.price || 0,
          quantity: qty,
          image: item?.image
        };
      }),
      payment_scheme: 'DP',
      total_amount: totalPrice,
      paid_amount: amountToPayNow,
      remaining_amount: remainingAmount,
      payment_proof_file: paymentProofBase64,
      payment_status: 'AWAITING_VERIFICATION',
      order_status: 'PENDING'
    };
    
    const existingOrders = JSON.parse(localStorage.getItem('weshareit_orders') || '[]');
    localStorage.setItem('weshareit_orders', JSON.stringify([orderPayload, ...existingOrders]));

    clearCart();
    navigate(`/track/${orderId}`);
  };

  if (!trip) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f5f0]">
        <p className="text-gray-500 font-medium tracking-wide">Trip tidak ditemukan.</p>
      </div>
    );
  }

  const InputField = ({ label, type = "text", name, value, required, placeholder }) => (
    <div className="relative pt-6">
      <input 
        type={type} name={name} value={value} onChange={handleInputChange} required={required}
        placeholder={placeholder}
        className="w-full border-b border-gray-300 bg-transparent py-2 px-0 text-slate-900 focus:border-[#B35938] focus:outline-none focus:ring-0 transition-colors peer placeholder-transparent"
      />
      <label className="absolute left-0 top-1 text-xs font-bold tracking-widest text-gray-400 uppercase transition-all peer-placeholder-shown:top-8 peer-placeholder-shown:text-base peer-placeholder-shown:normal-case peer-placeholder-shown:font-normal peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-xs peer-focus:font-bold peer-focus:tracking-widest peer-focus:uppercase peer-focus:text-[#B35938]">
        {label} {required && '*'}
      </label>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f7f5f0] font-sans text-slate-900 pb-32 pt-20">
      
      {/* Hero Cover Image */}
      <div className="relative w-full h-[40vh] min-h-75 md:h-[60vh] overflow-hidden">
        <img 
          src={trip.coverImage || 'https://images.unsplash.com/photo-1549405085-5ee66f57de89?auto=format&fit=crop&w=2000&q=80'} 
          alt={trip.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
          <div className="mx-auto max-w-7xl">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold tracking-widest text-white/70 hover:text-white transition-colors mb-6 uppercase">
              <ArrowLeft size={16} /> Back to Discover
            </Link>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4 leading-tight">{trip.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-gray-200 text-sm md:text-base">
              <span className="flex items-center gap-2"><MapPin size={18} /> {trip.destination}</span>
              <span className="flex items-center gap-2"><Calendar size={18} /> Close PO: {trip.deadline}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        
        {/* Product Grid */}
        <div className="mb-24">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-8">Curated Items</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {trip.items.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>

        {/* Split-Screen Checkout Form */}
        {totalItems === 0 ? (
          <div className="py-24 text-center border-t border-gray-100">
            <p className="text-xl text-gray-500 font-medium tracking-wide">Pilih barang di atas untuk mulai memesan.</p>
          </div>
        ) : (
          <div className="lg:flex lg:gap-16 relative" id="checkout-section">
            
            {/* LEFT COLUMN: Scrollable Form */}
            <div className="w-full lg:w-3/5 pb-12">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-12 border-b border-gray-200 pb-4">Checkout Details</h2>
              
              <form id="checkout-form" onSubmit={handleOrderSubmit} className="space-y-16">
                
                {/* User Details */}
                <section>
                  <h3 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-6">1. Your Information</h3>
                  <div className="space-y-6">
                    <InputField label="Full Name" name="name" value={customerInfo.name} required placeholder="John Doe" />
                    <InputField label="WhatsApp Number" type="tel" name="phone" value={customerInfo.phone} required placeholder="81234567890" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField label="Email (Optional)" type="email" name="email" value={customerInfo.email} placeholder="john@example.com" />
                      <InputField label="Telegram (Optional)" name="telegram" value={customerInfo.telegram} placeholder="@username" />
                    </div>
                    <InputField label="Order Notes (Optional)" name="notes" value={customerInfo.notes} placeholder="Size, color, variants..." />
                  </div>
                </section>

                {/* Delivery */}
                <section>
                  <h3 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-6">2. Delivery Method</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <label className={`flex cursor-pointer items-start gap-4 border p-6 transition-all duration-300 ${customerInfo.shippingMethod === 'instant' ? 'border-[#B35938] bg-[#B35938]/5 shadow-sm' : 'border-gray-200 bg-transparent hover:border-gray-300'}`}>
                      <input 
                        type="radio" name="shippingMethod" value="instant" 
                        checked={customerInfo.shippingMethod === 'instant'} onChange={handleInputChange}
                        className="mt-1 h-4 w-4 accent-[#B35938]"
                      />
                      <div>
                        <p className="font-bold text-slate-900">Instant (GoSend/Grab)</p>
                        <p className="text-sm text-gray-500 mt-1">Same-day local delivery</p>
                      </div>
                    </label>
                    <label className={`flex cursor-pointer items-start gap-4 border p-6 transition-all duration-300 ${customerInfo.shippingMethod === 'courier' ? 'border-[#B35938] bg-[#B35938]/5 shadow-sm' : 'border-gray-200 bg-transparent hover:border-gray-300'}`}>
                      <input 
                        type="radio" name="shippingMethod" value="courier" 
                        checked={customerInfo.shippingMethod === 'courier'} onChange={handleInputChange}
                        className="mt-1 h-4 w-4 accent-[#B35938]"
                      />
                      <div>
                        <p className="font-bold text-slate-900">Standard Courier</p>
                        <p className="text-sm text-gray-500 mt-1">JNE, J&T, Sicepat</p>
                      </div>
                    </label>
                  </div>
                  {(customerInfo.shippingMethod === 'courier' || customerInfo.shippingMethod === 'instant') && (
                    <InputField label="Full Address" name="address" value={customerInfo.address} required placeholder="Street name, City, Zip Code" />
                  )}

                  <div className="mt-6 flex items-start gap-3 bg-slate-50 p-5 border border-gray-100 text-slate-700">
                    <Info className="shrink-0 mt-0.5 text-[#B35938]" size={18} />
                    <p className="text-sm leading-relaxed">
                      Ongkos kirim aktual akan dihitung setelah barang tiba di Indonesia dan ditambahkan pada tagihan Pelunasan.
                    </p>
                  </div>
                </section>

                {/* Payment Options */}
                <section>
                  <h3 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-6">3. Payment Plan</h3>
                  <div className="border border-gray-100 p-6 bg-slate-50">
                    <p className="font-bold text-slate-900 mb-1">Down Payment (75%)</p>
                    <p className="text-sm text-gray-500">Settle the remaining 25% balance upon arrival.</p>
                  </div>
                </section>

                {/* Bank Transfer & Proof */}
                <section>
                  <h3 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-6">4. Transfer & Verify</h3>
                  <div className="bg-white p-8 shadow-[0_4px_40px_rgba(0,0,0,0.03)] border border-gray-100 mb-8">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Bank Transfer (BCA)</p>
                    <div className="flex items-center justify-between mt-4 pb-4 border-b border-gray-100">
                      <div>
                        <p className="text-2xl font-bold tracking-widest text-slate-900 font-mono">1234 5678 90</p>
                        <p className="text-sm text-gray-500 mt-1">Weshareit Admin</p>
                      </div>
                      <button 
                        type="button" 
                        onClick={handleCopyBank}
                        className="flex h-12 px-6 items-center gap-2 bg-slate-50 text-slate-900 text-sm font-bold hover:bg-slate-100 transition-colors"
                      >
                        {copied ? <CheckCircle2 size={16} className="text-emerald-600" /> : <Copy size={16} />}
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>

                    <div className="mt-8">
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Upload Receipt *</p>
                      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-200 border-dashed bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative overflow-hidden group">
                        {paymentProofBase64 && (
                          <img src={paymentProofBase64} alt="Proof" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-30 transition-opacity" />
                        )}
                        <div className="flex flex-col items-center justify-center z-10">
                          <Upload className="w-8 h-8 mb-3 text-slate-400 group-hover:text-[#B35938] transition-colors" />
                          <p className="text-sm font-bold text-slate-700">{paymentProofBase64 ? 'Change Image' : 'Select Image File'}</p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleUploadProof} />
                      </label>
                    </div>
                  </div>
                </section>
              </form>
            </div>

            {/* RIGHT COLUMN: Sticky Order Summary */}
            <div className="w-full lg:w-2/5">
              <div className="sticky top-28 bg-white p-6 md:p-8 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col max-h-[calc(100vh-140px)]">
                <h3 className="text-xl font-bold tracking-tight text-slate-900 mb-6">Order Summary</h3>
                
                <div className="flex-1 overflow-y-auto pr-2">
                  {Object.entries(cart).map(([itemId, qty]) => {
                    const item = trip.items.find(i => i.id === itemId);
                    if (!item) return null;
                    return (
                      <div key={itemId} className="flex justify-between items-start gap-4 border-b border-gray-100 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900 text-base leading-tight">{item.name}</span>
                          <span className="text-xs text-gray-500 mt-1">Varian: {item.variant || 'Default'}</span>
                          <span className="text-sm font-medium text-[#B35938] mt-1">Qty: {qty}</span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-bold text-slate-900 whitespace-nowrap">
                            Rp {(item.price * qty).toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <hr className="my-5 border-dashed border-gray-200" />
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Subtotal</span>
                    <span className="text-sm font-medium text-slate-900">Rp {totalPrice.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Sisa Pelunasan 25%</span>
                    <span className="text-sm font-medium text-slate-900">Rp {remainingAmount.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <hr className="my-5 border-gray-100" />
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900">Total DP Sekarang</span>
                    <span className="text-xs text-gray-400">75% dari Subtotal</span>
                  </div>
                  <span className="text-2xl font-bold text-[#B35938]">Rp {amountToPayNow.toLocaleString('id-ID')}</span>
                </div>

                <div className="flex items-start gap-3 mt-6 mb-4">
                  <input 
                    type="checkbox" 
                    id="terms"
                    checked={isAgreed}
                    onChange={(e) => setIsAgreed(e.target.checked)}
                    className="mt-1 shrink-0 w-4 h-4 accent-[#B35938] rounded border-gray-300 cursor-pointer" 
                  />
                  <label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed cursor-pointer select-none">
                    Saya menyetujui bahwa DP 75% tidak dapat dikembalikan jika batal sepihak, dan menyetujui Syarat & Ketentuan Weshareit.
                  </label>
                </div>

                <button 
                  type="submit" 
                  form="checkout-form"
                  disabled={!isAgreed}
                  className={`w-full py-3.5 rounded-xl text-white font-medium flex justify-center items-center gap-2 transition-colors ${
                    !isAgreed 
                      ? 'opacity-50 cursor-not-allowed bg-slate-400' 
                      : 'bg-slate-900 hover:bg-slate-800'
                  }`}
                >
                  Place Order
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
