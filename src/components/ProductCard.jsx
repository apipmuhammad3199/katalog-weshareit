import React from 'react';
import useCartStore from '../store/useCartStore';
import { Plus, Minus } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { cart, updateQuantity } = useCartStore();
  const quantity = cart[product.id] || 0;
  const isClosed = product.status === 'closed';

  return (
    <div className="group flex flex-col overflow-hidden rounded-[1.5rem] bg-white border border-gray-100 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] h-full">
      {/* Image Container */}
      <div className="relative w-full pb-[120%] overflow-hidden bg-gray-50">
        <img 
          src={product.image} 
          alt={product.name} 
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" 
        />
        {isClosed && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
            <span className="rounded-full bg-red-50 px-4 py-1.5 text-xs font-bold tracking-widest uppercase text-red-600 border border-red-100">Ditutup</span>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="flex grow flex-col p-6">
        <div className="mb-2">
          <h3 className="text-base font-bold tracking-tight text-slate-900 line-clamp-2">{product.name}</h3>
        </div>
        <p className="mb-4 text-sm text-gray-500 line-clamp-2 grow">{product.description}</p>
        
        {/* Footer of card */}
        <div className="mt-auto flex items-end justify-between pt-4 border-t border-gray-50">
          <div className="text-lg font-bold tracking-tight text-slate-900">
            Rp {product.price.toLocaleString('id-ID')}
          </div>
          
          {!isClosed && (
            quantity > 0 ? (
              <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-white p-1 shadow-sm">
                <button 
                  onClick={() => updateQuantity(product.id, -1)} 
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100"
                >
                  <Minus size={14} strokeWidth={2.5} />
                </button>
                <span className="w-4 text-center text-sm font-bold text-slate-900">{quantity}</span>
                <button 
                  onClick={() => updateQuantity(product.id, 1)} 
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#B35938] text-white transition-colors hover:bg-[#99492d]"
                >
                  <Plus size={14} strokeWidth={2.5} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => updateQuantity(product.id, 1)} 
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-all duration-300 md:opacity-0 md:-translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:bg-[#B35938] group-hover:text-white hover:scale-110 active:scale-95"
              >
                <Plus size={20} strokeWidth={2.5} />
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
