'use client'

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart/cart-context';
import { useToast } from '@/lib/toast/toast-context';
import { useState } from 'react';

function CartItemImage({ src, alt }: { src?: string; alt: string }) {
  const [imgError, setImgError] = useState(false);
  const imageSrc = imgError || !src ? '/placeholder-product.svg' : src;

  return (
    <div className="relative w-24 h-24 md:w-32 md:h-32 bg-white dark:bg-slate-800 rounded-lg flex-shrink-0 overflow-hidden">
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className="object-contain p-2"
        sizes="128px"
        onError={() => setImgError(true)}
      />
    </div>
  );
}

export default function CartPage() {
  const { state, removeItem, updateQuantity, clearCart } = useCart();
  const { success, info } = useToast();

  const handleRemoveItem = (id: string, name: string) => {
    removeItem(id);
    info(`${name.length > 30 ? name.substring(0, 30) + '…' : name} removed from cart`);
  };

  const handleClearCart = () => {
    clearCart();
    success('Cart cleared');
  };

  if (state.items.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="h-12 w-12 text-slate-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">ไม่มีสินค้าในตะกร้าของคุณ</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            ดูเหมือนว่าคุณยังไม่มีสินค้าในตะกร้า เริ่มช้อปปิ้งเพื่อเลือกสินค้าที่ต้องการได้เลย!
          </p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            กลับไปช้อปปิ้งต่อ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <ShoppingCart className="h-8 w-8 text-primary" />
          ตะกร้าสินค้า
          <span className="text-base font-normal text-slate-500">({state.totalItems} รายการ)</span>
        </h1>
        <button 
          onClick={handleClearCart}
          className="text-sm text-rose-500 hover:text-rose-600 font-medium flex items-center gap-1 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          ล้างตะกร้าสินค้า
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {state.items.map((item) => (
            <div 
              key={item.id}
              className="flex gap-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 md:p-5 transition-all hover:shadow-sm"
            >
              {/* Image */}
              <CartItemImage src={item.image} alt={item.name} />
              
              {/* Details */}
              <div className="flex-1 flex flex-col min-w-0">
                <Link href={`/product/${item.productId}`} className="font-semibold text-slate-900 dark:text-white hover:text-primary transition-colors text-sm md:text-base line-clamp-2">
                  {item.name}
                </Link>
                
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-2">
                  ฿{item.price.toLocaleString()}
                </p>
                
                <div className="mt-auto pt-3 flex items-center justify-between">
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold text-slate-900 dark:text-white">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {/* Subtotal & Remove */}
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-500 hidden sm:block">
                      ฿{(item.price * item.quantity).toLocaleString()}
                    </span>
                    <button 
                      onClick={() => handleRemoveItem(item.id, item.name)}
                      className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sticky top-24">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">สรุปยอดสั่งซื้อ</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">ยอดรวม ({state.totalItems} รายการ)</span>
                <span className="font-medium text-slate-900 dark:text-white">฿{state.totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">ค่าจัดส่ง</span>
                <span className="font-medium text-primary">จัดส่งฟรี</span>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700 pt-3 flex justify-between">
                <span className="text-base font-bold text-slate-900 dark:text-white">ยอดชำระทั้งหมด</span>
                <span className="text-xl font-bold text-slate-900 dark:text-white">฿{state.totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <Link 
              href="/checkout"
              className="block w-full text-center bg-primary hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg shadow-primary/20"
            >
              ดำเนินการสั่งซื้อ
            </Link>

            <Link 
              href="/"
              className="w-full mt-3 flex items-center justify-center gap-2 py-3 px-6 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              กลับไปเลือกซื้อสินค้าต่อ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
