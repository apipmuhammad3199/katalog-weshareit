import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MessageCircle, CheckCircle, AlertCircle } from 'lucide-react';
import TrackingProgressBar from '../components/TrackingProgressBar';

const TrackingStatusView = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    try {
      const existingOrders = JSON.parse(localStorage.getItem('weshareit_orders') || '[]');
      const foundOrder = existingOrders.find(o => o.id === id);
      if (foundOrder) {
        setOrder(foundOrder);
      }
    } catch (err) {
      console.error('Error loading order from localStorage', err);
    }
  }, [id]);

  const handleWhatsApp = () => {
    if (!order) return;
    const text = `Halo Admin, saya ingin menanyakan pesanan dengan ID: *${order.id}*\n\nNama: ${order.customer.name}\nTotal Pesanan: Rp ${order.total_amount?.toLocaleString('id-ID')}\nStatus Pembayaran: ${order.payment_status}`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/6281234567890?text=${encodedText}`, '_blank');
  };

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f5f0]">
        <div className="text-center">
          <h2 className="text-lg font-bold text-slate-800">Pesanan Tidak Ditemukan</h2>
          <Link to="/" className="mt-4 inline-block rounded-full bg-[#bd6a4d] px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-[#a65d43]">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const isAwaitingPelunasan = order.order_status === 'AWAITING_PELUNASAN';

  return (
    <div className="min-h-screen bg-[#fcfcfc] p-6 md:py-16 font-sans text-slate-900 pb-32">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-[2.5rem] bg-white p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#ebebeb] text-center relative overflow-hidden">
          
          <div className="mb-6 flex justify-center">
            {order.payment_status === 'AWAITING_VERIFICATION' ? (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-500">
                <AlertCircle size={32} />
              </div>
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-500">
                <CheckCircle size={32} />
              </div>
            )}
          </div>
          
          <h1 className="mb-2 text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Detail Pesanan</h1>
          <p className="mb-8 text-sm text-slate-500">
            ID Pesanan: <strong className="font-mono tracking-wider">{order.id}</strong>
          </p>

          <div className="mb-10 flex flex-col items-center gap-3">
            <div className={`rounded-full px-4 py-1.5 text-xs font-semibold ${
              order.payment_status === 'AWAITING_VERIFICATION' 
                ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                : order.payment_status === 'DP_PAID'
                ? 'bg-amber-50 text-amber-600 border border-amber-200'
                : 'bg-green-50 text-green-600 border border-green-200'
            }`}>
              {order.payment_status.replace(/_/g, ' ')}
            </div>

            <div className={`rounded-full px-4 py-1.5 text-xs font-semibold ${
              isAwaitingPelunasan 
                ? 'bg-red-50 text-red-600 border border-red-200' 
                : 'bg-slate-50 text-slate-600 border border-slate-200'
            }`}>
              STATUS: {order.order_status.replace(/_/g, ' ')}
            </div>
          </div>

          <div className="text-left rounded-3xl bg-slate-50 p-6 md:p-8 mb-10 border border-slate-100">
            <h3 className="mb-5 font-bold tracking-widest text-slate-500 text-xs uppercase">Ringkasan</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Trip</span>
                <span className="font-medium text-slate-700">{order.tripTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Skema Pembayaran</span>
                <span className="font-medium text-slate-700">{order.payment_scheme}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="text-slate-500">Total Harga</span>
                <span className="font-medium text-slate-700">Rp {order.total_amount.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Telah Dibayar</span>
                <span className="font-medium text-green-600">Rp {order.paid_amount.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between font-bold pt-3 border-t border-slate-200">
                <span className="text-slate-900">Sisa Tagihan</span>
                <span className="text-[#bd6a4d] text-base">Rp {order.remaining_amount.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

          {/* Order Progress Bar */}
          <TrackingProgressBar order={order} />

          <button onClick={handleWhatsApp} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#ebebeb] bg-white px-6 py-4 text-sm font-bold text-slate-700 shadow-[0_4px_15px_rgb(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgb(0,0,0,0.05)] hover:border-slate-200 mt-6">
            <MessageCircle size={20} className="text-[#25D366]" />
            Tanya Admin via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackingStatusView;
