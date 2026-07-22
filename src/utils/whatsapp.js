export const generateWhatsAppLink = (cart, customer, total) => {
  const adminPhone = '6281234567890'; // Replace with actual admin number
  
  let message = `*HALO ADMIN WESHAREIT, SAYA INGIN ORDER*%0A%0A`;
  
  message += `*DATA PEMESAN*%0A`;
  message += `- Nama: ${customer.name}%0A`;
  message += `- No. WA: ${customer.phone}%0A`;
  message += `- Alamat: ${customer.address}%0A%0A`;
  
  message += `*DETAIL PESANAN*%0A`;
  cart.forEach((item, index) => {
    message += `${index + 1}. *${item.product.name}*%0A`;
    
    // Format variants
    const variantsText = Object.entries(item.variantOptions)
      .map(([key, value]) => `${key}: ${value}`)
      .join(' | ');
      
    message += `   Varian: ${variantsText}%0A`;
    message += `   Jumlah: ${item.quantity} pcs%0A`;
    message += `   Subtotal: Rp ${(item.product.price * item.quantity).toLocaleString('id-ID')}%0A%0A`;
  });
  
  message += `*TOTAL KESELURUHAN: Rp ${total.toLocaleString('id-ID')}*%0A%0A`;
  message += `Mohon info ongkir dan nomor rekening untuk pembayaran. Terima kasih.`;
  
  return `https://wa.me/${adminPhone}?text=${message}`;
};
