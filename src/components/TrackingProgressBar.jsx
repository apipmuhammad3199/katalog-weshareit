import React from 'react';
import { ShoppingBag, Plane, Wallet, Truck, CheckCircle2, MessageCircle } from 'lucide-react';
import useLanguageStore from '../store/useLanguageStore';

const TrackingProgressBar = ({ order }) => {
  const { t } = useLanguageStore();

  const steps = [
    { id: 'PURCHASING', label: t('stepPurchasing'), Icon: ShoppingBag },
    { id: 'ARRIVED_LOCAL', label: t('stepArrivedLocal'), Icon: Plane },
    { id: 'DELIVERING_STEP', label: t('stepDelivering'), Icon: Truck },
    { id: 'PAYMENT_STEP', label: t('stepPayment'), Icon: Wallet },
    { id: 'COMPLETED', label: t('stepCompleted'), Icon: CheckCircle2 },
  ];

  // Determine current index based on status
  let currentIndex = -1;
  if (order?.order_status === 'PURCHASING') {
    currentIndex = 0;
  } else if (order?.order_status === 'ARRIVED_LOCAL') {
    currentIndex = 1;
  } else if (order?.order_status === 'DELIVERING') {
    if (order?.payment_status === 'DP_PAID') {
      currentIndex = 3; // Menunggu Pelunasan is active
    } else {
      currentIndex = 4; // Menunggu Selesai (Payment done)
    }
  } else if (order?.order_status === 'COMPLETED') {
    currentIndex = 5; // All completed
  }

  return (
    <div className="w-full">
      {/* Container: Clean white card with soft shadow */}
      <div className="rounded-3xl bg-white p-8 shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-gray-100">
        <h3 className="mb-8 text-center text-lg font-bold text-slate-900">{t('orderProgressTitle')}</h3>
        
        <div className="relative flex justify-between items-center w-full z-0">
          {/* Continuous horizontal line (background) */}
          <div className="absolute top-7 left-0 right-0 h-0.5 bg-gray-100 -z-10"></div>
          
          {/* Filled progress line */}
          {currentIndex > 0 && (
            <div 
              className="absolute top-7 left-0 h-0.5 bg-[#B35938] -z-10 transition-all duration-500"
              style={{ width: `${Math.min((currentIndex / (steps.length - 1)) * 100, 100)}%` }}
            ></div>
          )}

          {steps.map((step, index) => {
            const isCompleted = index < currentIndex;
            const isActive = index === currentIndex;
            const Icon = step.Icon;

            // Determine circle styling
            let circleClasses = "flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300 ";
            let iconColor = "";

            if (isCompleted) {
              circleClasses += "bg-[#B35938] border-2 border-[#B35938]";
              iconColor = "text-white";
            } else if (isActive) {
              circleClasses += "bg-white border-4 border-[#B35938]/30 ring-2 ring-[#B35938] ring-inset";
              iconColor = "text-[#B35938]";
            } else {
              circleClasses += "bg-white border-2 border-gray-100";
              iconColor = "text-gray-300";
            }

            return (
              <div key={step.id} className="relative flex flex-col items-center group w-20">
                <div className={circleClasses}>
                  <Icon size={24} strokeWidth={isCompleted || isActive ? 2.5 : 2} className={iconColor} />
                </div>
                
                {/* Step Label */}
                <div className={`mt-4 text-center text-sm ${
                  isCompleted || isActive ? 'font-bold text-slate-900' : 'font-medium text-gray-400'
                }`}>
                  {step.label.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i !== step.label.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CONDITIONAL RENDERING: Action Card for "Menunggu Pelunasan" */}
      {currentIndex === 3 && order && (
        <div className="mt-6 rounded-3xl bg-white p-8 shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-[#B35938]/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#B35938]"></div>
          <h4 className="text-xl font-bold text-[#B35938] mb-4">{t('timeForFinalPayment')}</h4>
          
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            {t('finalPaymentDesc')}
          </p>

          {/* Tracking Info & Balance Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="rounded-2xl border border-gray-100 bg-slate-50 p-4">
              <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">{t('shippingInfo')}</p>
              <p className="font-bold text-slate-900 mb-0.5">{order.resi?.courier || t('courier')}</p>
              <p className="font-mono text-slate-600 text-sm tracking-wider">{order.resi?.receipt || t('receiptNotAvailable')}</p>
            </div>
            
            <div className="rounded-2xl border border-gray-100 bg-slate-50 p-4 flex flex-col justify-center">
              <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">{t('totalRemainingBalance')}</p>
              <p className="text-3xl font-bold text-[#B35938]">
                Rp {order.remaining_amount?.toLocaleString('id-ID')}
              </p>
              <p className="text-xs text-gray-500 mt-1">{t('includesShipping')}</p>
            </div>
          </div>

          <a 
            href={`https://wa.me/6281234567890?text=${encodeURIComponent(`Halo Admin Weshareit, ini bukti transfer pelunasan untuk pesanan dengan ID: ${order.id}. Terima kasih!`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle size={20} />
            {t('sendProofWA')}
          </a>
        </div>
      )}
    </div>
  );
};

export default TrackingProgressBar;
