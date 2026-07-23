import React, { useState, useEffect } from 'react';
import { ShoppingBag, Package, Eye, X, AlertCircle, Check, MessageCircle, MapPin } from 'lucide-react';
import AdminProducts from '../components/Admin/AdminProducts';
import AdminTrips from '../components/Admin/AdminTrips';
import { formatNumberWithDots } from '../utils/formatters';

const MOCK_DUMMY_ORDERS = [
  {
    id: 'ORD-1721561234',
    tripTitle: 'Swifties goes to China',
    date: new Date().toISOString(),
    customer: {
      name: 'John Doe',
      phone: '081234567890',
      address: 'Jl. Merdeka 123, Jakarta',
      shippingMethod: 'courier'
    },
    items: [
      { name: 'TS story magnet', quantity: 1, price: 100000 }
    ],
    payment_scheme: 'DP',
    total_amount: 100000,
    paid_amount: 75000, // 75%
    remaining_amount: 25000, // 25%
    payment_status: 'DP_PAID',
    order_status: 'ARRIVED_LOCAL',
    payment_proof_file: 'https://images.unsplash.com/photo-1554162444-cb8859942a78?w=400&q=80',
    ongkir: null,
    resi: null
  },
  {
    id: 'ORD-1721569876',
    tripTitle: 'Japan Snacks & Merch',
    date: new Date().toISOString(),
    customer: {
      name: 'Jane Smith',
      phone: '089998887776',
      address: 'Apartemen Indah, Bandung',
      shippingMethod: 'instant'
    },
    items: [
      { name: 'Tokyo Banana Box', quantity: 2, price: 250000 }
    ],
    payment_scheme: 'DP', // Made it DP so we can test the red alert
    total_amount: 500000,
    paid_amount: 375000,
    remaining_amount: 175000, // 125000 + 50000 ongkir
    payment_status: 'DP_PAID',
    order_status: 'DELIVERING',
    payment_proof_file: 'https://images.unsplash.com/photo-1554162444-cb8859942a78?w=400&q=80',
    ongkir: 50000,
    resi: { courier: 'GoSend', receipt: 'INSTANT123' }
  },
  {
    id: 'ORD-1721569999',
    tripTitle: 'K-Pop Albums',
    date: new Date().toISOString(),
    customer: {
      name: 'Lisa',
      phone: '08111222333',
      address: 'Seoul Tower, Jakarta',
      shippingMethod: 'courier'
    },
    items: [
      { name: 'Album Ver A', quantity: 1, price: 300000 }
    ],
    payment_scheme: 'DP',
    total_amount: 300000,
    paid_amount: 330000, // 225000 (DP) + 75000 (Sisa) + 30000 (Ongkir) = Fully Paid
    remaining_amount: 0, 
    payment_status: 'FULLY_PAID',
    order_status: 'DELIVERING',
    payment_proof_file: 'https://images.unsplash.com/photo-1554162444-cb8859942a78?w=400&q=80',
    ongkir: 30000,
    resi: { courier: 'JNT', receipt: 'JP123456789' }
  }
];

const Admin = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'products'
  
  // Modals state
  const [previewImage, setPreviewImage] = useState(null);
  
  const [shippingBillingModal, setShippingBillingModal] = useState({ 
    isOpen: false, 
    orderId: null, 
    ongkir: '', 
    courier: '', 
    receipt: '' 
  });
  const [verifyModal, setVerifyModal] = useState({ isOpen: false, orderId: null });

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('weshareit_orders') || '[]');
    // Seed dummy data if empty for testing
    if (savedOrders.length === 0) {
      setOrders(MOCK_DUMMY_ORDERS);
      localStorage.setItem('weshareit_orders', JSON.stringify(MOCK_DUMMY_ORDERS));
    } else {
      setOrders(savedOrders);
    }
  }, []);

  const updateOrdersInStateAndStorage = (newOrders) => {
    setOrders(newOrders);
    localStorage.setItem('weshareit_orders', JSON.stringify(newOrders));
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, order_status: newStatus } : o);
    updateOrdersInStateAndStorage(updated);
  };

  const handleVerifyPelunasan = () => {
    if (!verifyModal.orderId) return;
    
    const updated = orders.map(o => {
      if (o.id === verifyModal.orderId) {
        return {
          ...o,
          payment_status: 'FULLY_PAID',
          paid_amount: o.total_amount + (o.ongkir || 0),
          remaining_amount: 0
        };
      }
      return o;
    });
    updateOrdersInStateAndStorage(updated);
    setVerifyModal({ isOpen: false, orderId: null });
  };

  const handleSubmitShippingBilling = (e) => {
    e.preventDefault();
    const amountNum = parseInt(shippingBillingModal.ongkir.replace(/\D/g, ''), 10);
    if (!amountNum || isNaN(amountNum)) return alert('Masukkan nominal ongkir yang valid');
    if (!shippingBillingModal.receipt) return alert('Lengkapi data resi');

    const updated = orders.map(o => {
      if (o.id === shippingBillingModal.orderId) {
        return {
          ...o,
          ongkir: amountNum,
          remaining_amount: (o.remaining_amount || 0) + amountNum,
          resi: { courier: 'Standard', receipt: shippingBillingModal.receipt },
          order_status: 'DELIVERING'
        };
      }
      return o;
    });

    updateOrdersInStateAndStorage(updated);
    setShippingBillingModal({ isOpen: false, orderId: null, ongkir: '', courier: '', receipt: '' });
  };

  const handleCancelOrder = (orderId) => {
    if (window.confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) {
      const updated = orders.map(o => o.id === orderId ? { ...o, order_status: 'CANCELED', payment_status: 'REFUND_REQUIRED' } : o);
      updateOrdersInStateAndStorage(updated);
    }
  };

  const handlePingTagihan = (order) => {
    const sisa = `Rp ${order.remaining_amount.toLocaleString('id-ID')}`;
    const text = `Halo! Pesanan Weshareit kamu sudah siap dikirim. Total ongkir & sisa pelunasan adalah ${sisa}. Silakan cek detail resi dan upload bukti transfer di web ya!`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${order.customer.phone}?text=${encoded}`);
  };

  const getPaymentBadge = (status) => {
    switch(status) {
      case 'FULLY_PAID':
        return <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 border border-emerald-200">FULLY PAID</span>;
      case 'DP_PAID':
        return <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-600 border border-amber-200">DP PAID</span>;
      case 'REFUND_REQUIRED':
        return <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600 border border-red-200">REFUND REQ</span>;
      default:
        return <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600 border border-red-200">AWAITING</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f5f0] font-sans text-slate-900 pt-28 pb-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-6">Admin Dashboard</h1>
          
          {/* Tabs */}
          <div className="flex flex-wrap gap-4">
            <button 
              className={`flex items-center gap-2 rounded-full px-6 py-2 text-sm font-bold transition-all duration-300 cursor-pointer ${activeTab === 'orders' ? 'bg-slate-900 text-white shadow-md' : 'bg-transparent text-gray-500 border border-slate-200 hover:border-slate-300'}`}
              onClick={() => setActiveTab('orders')}
            >
              <ShoppingBag size={18} /> Data Pesanan (PO)
            </button>
            <button 
              className={`flex items-center gap-2 rounded-full px-6 py-2 text-sm font-bold transition-all duration-300 cursor-pointer ${activeTab === 'trips' ? 'bg-slate-900 text-white shadow-md' : 'bg-transparent text-gray-500 border border-slate-200 hover:border-slate-300'}`}
              onClick={() => setActiveTab('trips')}
            >
              <MapPin size={18} /> Manajemen Trip PO
            </button>
            <button 
              className={`flex items-center gap-2 rounded-full px-6 py-2 text-sm font-bold transition-all duration-300 cursor-pointer ${activeTab === 'products' ? 'bg-slate-900 text-white shadow-md' : 'bg-transparent text-gray-500 border border-slate-200 hover:border-slate-300'}`}
              onClick={() => setActiveTab('products')}
            >
              <Package size={18} /> Manajemen Item Trip
            </button>
          </div>
        </div>

        {/* Main Container */}
        <div className="bg-white rounded-3xl shadow-[0_4px_40px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden">
          {activeTab === 'orders' ? (
            <div className="overflow-x-auto p-2">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="text-gray-400 font-bold uppercase tracking-widest text-[10px] border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-5">Order ID & Customer</th>
                    <th className="px-6 py-5">Pesanan</th>
                    <th className="px-6 py-5">Pembayaran</th>
                    <th className="px-6 py-5">Status Payment</th>
                    <th className="px-6 py-5">Status Order</th>
                    <th className="px-6 py-5">Bukti</th>
                    <th className="px-6 py-5">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                      
                      {/* Column 1: Order ID & Customer */}
                      <td className="px-6 py-5">
                        <p className="text-xs text-gray-400 font-mono mb-1">{order.id}</p>
                        <p className="font-bold text-slate-900">{order.customer.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-gray-500">{order.customer.phone}</p>
                          {order.order_status === 'DELIVERING' && order.payment_status === 'DP_PAID' && (
                            <button 
                              onClick={() => handlePingTagihan(order)}
                              className="flex h-5 w-5 items-center justify-center rounded-full bg-green-50 text-green-500 hover:bg-green-100 transition-colors"
                              title="Ping WA Tagihan"
                            >
                              <MessageCircle size={12} />
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5 truncate max-w-37.5" title={order.customer.address}>{order.customer.address}</p>
                        <span className="inline-block mt-2 rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          {order.customer.shippingMethod}
                        </span>
                      </td>

                      {/* Column 2: Pesanan */}
                      <td className="px-6 py-5">
                        <p className="font-bold text-[#B35938] mb-1">{order.tripTitle}</p>
                        {order.items.map((item, idx) => (
                          <p key={idx} className="text-sm text-slate-600 truncate max-w-37.5" title={item.name}>
                            <span className="font-bold">{item.quantity}x</span> {item.name}
                          </p>
                        ))}
                      </td>

                      {/* Column 3: Pembayaran */}
                      <td className="px-6 py-5">
                        <p className="text-xs font-semibold text-gray-500 mb-1">
                          Skema: <span className="text-slate-900">DP 75%</span>
                        </p>
                        <p className="font-bold text-slate-900 mb-1">Rp {order.total_amount?.toLocaleString('id-ID')}</p>
                        <p className="text-xs text-emerald-600 font-medium">Dibayar: Rp {order.paid_amount?.toLocaleString('id-ID')}</p>
                        
                        {order.order_status === 'DELIVERING' && order.payment_status === 'DP_PAID' ? (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <p className="text-xs font-bold text-red-600">Sisa: Rp {order.remaining_amount?.toLocaleString('id-ID')}</p>
                            <AlertCircle size={14} className="text-red-500" />
                          </div>
                        ) : (
                          <p className="text-xs text-[#B35938] font-medium mt-0.5">Sisa: Rp {order.remaining_amount?.toLocaleString('id-ID')}</p>
                        )}
                      </td>

                      {/* Column 4: Status Payment */}
                      <td className="px-6 py-5">
                        {getPaymentBadge(order.payment_status)}
                      </td>

                      {/* Column 5: Status Order */}
                      <td className="px-6 py-5">
                        <span className="inline-block px-3 py-1.5 bg-slate-100 text-slate-700 font-bold text-[10px] rounded-lg tracking-wider uppercase">
                          {order.order_status.replace(/_/g, ' ')}
                        </span>
                      </td>

                      {/* Column 6: Bukti */}
                      <td className="px-6 py-5">
                        {order.payment_proof_file ? (
                          <button 
                            onClick={() => setPreviewImage(order.payment_proof_file)}
                            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#B35938] transition-colors"
                          >
                            <Eye size={16} className="text-gray-400" /> Bukti DP
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400 italic">No Image</span>
                        )}
                      </td>

                      {/* Column 7: Aksi (SEQUENTIAL LOGIC) */}
                      <td className="px-6 py-5">
                        {order.order_status === 'PENDING' && (
                          <div className="flex flex-col items-start">
                            <button 
                              onClick={() => handleUpdateOrderStatus(order.id, 'PURCHASING')}
                              className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition-colors w-full"
                            >
                              Proses Pembelian
                            </button>
                            <button onClick={() => handleCancelOrder(order.id)} className="text-xs text-red-500 hover:underline mt-2 inline-block cursor-pointer">Cancel Order</button>
                          </div>
                        )}
                        
                        {order.order_status === 'PURCHASING' && (
                          <div className="flex flex-col items-start">
                            <button 
                              onClick={() => handleUpdateOrderStatus(order.id, 'ARRIVED_LOCAL')}
                              className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition-colors w-full"
                            >
                              Barang Tiba di Indo
                            </button>
                            <button onClick={() => handleCancelOrder(order.id)} className="text-xs text-red-500 hover:underline mt-2 inline-block cursor-pointer">Cancel Order</button>
                          </div>
                        )}

                        {order.order_status === 'ARRIVED_LOCAL' && (
                          <button 
                            onClick={() => setShippingBillingModal({ isOpen: true, orderId: order.id, ongkir: '', courier: '', receipt: '' })}
                            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition-colors"
                          >
                            Kirim & Tagih
                          </button>
                        )}

                        {order.order_status === 'DELIVERING' && order.payment_status === 'DP_PAID' && (
                          <button 
                            onClick={() => setVerifyModal({ isOpen: true, orderId: order.id })}
                            className="rounded-lg bg-[#B35938] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#99492d] transition-colors"
                          >
                            Verifikasi Pelunasan
                          </button>
                        )}

                        {order.order_status === 'DELIVERING' && order.payment_status === 'FULLY_PAID' && (
                          <button 
                            onClick={() => handleUpdateOrderStatus(order.id, 'COMPLETED')}
                            className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors"
                          >
                            Pesanan Selesai
                          </button>
                        )}

                        {order.order_status === 'COMPLETED' && (
                          <span className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                            <Check size={16} /> Selesai
                          </span>
                        )}

                        {order.order_status === 'CANCELED' && (
                          <span className="flex items-center gap-1.5 text-xs font-bold text-red-500">
                            <X size={16} /> Dibatalkan
                          </span>
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'trips' ? (
            <AdminTrips />
          ) : (
            <div className="p-8">
              <AdminProducts />
            </div>
          )}
        </div>

      </div>

      {/* --- MODALS --- */}

      {/* 1. Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm" onClick={() => setPreviewImage(null)}>
          <div className="relative max-h-[90vh] max-w-3xl overflow-hidden rounded-3xl bg-white p-2 shadow-2xl" onClick={e => e.stopPropagation()}>
            <button className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-900 shadow-md hover:bg-gray-100" onClick={() => setPreviewImage(null)}>
              <X size={16} strokeWidth={3} />
            </button>
            <img src={previewImage} alt="Bukti" className="max-h-[85vh] w-auto rounded-2xl object-contain" />
          </div>
        </div>
      )}

      {/* 2. Pengiriman & Tagihan Modal */}
      {shippingBillingModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm" onClick={() => setShippingBillingModal({ isOpen: false, orderId: null, ongkir: '', courier: '', receipt: '' })}>
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Pengiriman & Tagihan</h3>
            <p className="text-sm text-gray-500 mb-6">Masukkan nominal ongkir dan nomor resi. Ongkir akan otomatis ditambahkan ke sisa tagihan pelanggan.</p>
            <form onSubmit={handleSubmitShippingBilling}>
              
              <div className="mb-4 relative">
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500">Ongkos Kirim</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-500">Rp</span>
                  <input 
                    type="text" 
                    inputMode="numeric"
                    required
                    value={shippingBillingModal.ongkir ? formatNumberWithDots(shippingBillingModal.ongkir) : ''}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, '');
                      const formatted = raw ? Number(raw).toLocaleString('id-ID') : '';
                      setShippingBillingModal({...shippingBillingModal, ongkir: formatted});
                    }}
                    className="w-full rounded-xl border border-gray-200 bg-slate-50 py-3 pl-12 pr-4 text-slate-900 outline-none focus:border-[#B35938] focus:bg-white focus:ring-1 focus:ring-[#B35938]"
                    placeholder="50.000"
                  />
                </div>
              </div>

              <div className="mb-8">
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-gray-500">Nomor Resi</label>
                <input 
                  type="text" 
                  required
                  value={shippingBillingModal.receipt}
                  onChange={(e) => setShippingBillingModal({...shippingBillingModal, receipt: e.target.value})}
                  className="w-full rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-[#B35938] focus:bg-white focus:ring-1 focus:ring-[#B35938]"
                  placeholder="JT1234567890"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setShippingBillingModal({ isOpen: false, orderId: null, ongkir: '', courier: '', receipt: '' })} className="px-5 py-2.5 text-sm font-bold text-gray-500 hover:text-slate-900">Batal</button>
                <button type="submit" className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-slate-800">Kirim & Tagih</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Verification Modal */}
      {verifyModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setVerifyModal({ isOpen: false, orderId: null })}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-500 mb-4">
                <Check size={24} strokeWidth={3} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Konfirmasi Pelunasan</h3>
              <p className="text-sm text-gray-500 mt-2">
                Apakah Anda yakin ingin memverifikasi pelunasan untuk pesanan ini? Status pembayaran akan diubah menjadi FULLY PAID dan tidak dapat dikembalikan.
              </p>
            </div>
            
            <div className="flex flex-row gap-3 mt-6">
              <button 
                onClick={() => setVerifyModal({ isOpen: false, orderId: null })}
                className="border border-gray-200 text-slate-700 hover:bg-gray-50 rounded-lg px-4 py-2 flex-1 font-medium transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleVerifyPelunasan}
                className="bg-[#25D366] text-white hover:bg-[#128C7E] rounded-lg px-4 py-2 flex-1 font-medium transition-colors"
              >
                Ya, Verifikasi
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Admin;
