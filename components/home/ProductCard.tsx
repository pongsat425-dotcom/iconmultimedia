'use client'

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Star, Check, Heart } from 'lucide-react';
import { useCart } from '@/lib/cart/cart-context';
import { useToast } from '@/lib/toast/toast-context';
import { useFavorites } from '@/lib/favorites/favorites-context';
import { useState } from 'react';

export interface ProductProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  inStock: boolean;
  rating?: number;
  reviews?: number;
}

export default function ProductCard({ 
  id, 
  name, 
  price, 
  originalPrice, 
  image, 
  inStock,
  rating = 4.5,
  reviews = 12
}: ProductProps) {
  
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const { addItem } = useCart();
  const { success } = useToast();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [justAdded, setJustAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const imageSrc = imgError || !image ? '/placeholder-product.svg' : image;

  const handleAddToCart = () => {
    if (!inStock) return;
    
    addItem({
      id,
      productId: id,
      name,
      price,
      quantity: 1,
      image,
    });
    
    success(`${name.length > 40 ? name.substring(0, 40) + '…' : name} added to cart`);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden glow-card shadow-sm hover:shadow-lg transition-all duration-300 relative">
      
      {/* Invisible overlay link spanning the entire card for easier click/tap navigation */}
      <Link href={`/product/${id}`} className="absolute inset-0 z-10" aria-label={`View ${name}`} />

      {/* Image Container */}
      <div className="relative aspect-square p-4 bg-white flex items-center justify-center overflow-hidden">
        {discount > 0 && (
          <div className="absolute top-3 left-3 z-20 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </div>
        )}
        
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite({
              id,
              name,
              price,
              originalPrice,
              image,
              inStock,
              rating,
              reviews
            });
          }}
          className="absolute top-3 right-3 z-20 p-2 bg-slate-50/80 dark:bg-slate-850/80 backdrop-blur-xs hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-red-500 rounded-xl shadow-xs transition-all duration-300 cursor-pointer"
          aria-label="Add to favorites"
        >
          <Heart className={`h-4.5 w-4.5 ${isFavorite(id) ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
        
        <div className="relative w-full h-full rounded-lg transition-transform duration-500 group-hover:scale-105">
          <Image 
            src={imageSrc} 
            alt={name} 
            fill 
            className="object-contain"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
            onError={() => setImgError(true)}
            unoptimized
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-4 md:p-5">
        <div className="flex items-center gap-1 mb-2">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{rating}</span>
          <span className="text-xs text-slate-500">({reviews})</span>
        </div>
        
        {/* Render title without nested Link, styling matches original */}
        <div className="block mb-2 group-hover:text-primary transition-colors">
          <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-2 text-sm md:text-base leading-tight">
            {name}
          </h3>
        </div>
        
        <div className="mt-auto pt-4 flex items-end justify-between">
          <div>
            {originalPrice && (
              <p className="text-xs text-slate-500 line-through mb-1">
                ฿{originalPrice.toLocaleString()}
              </p>
            )}
            <p className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
              ฿{price.toLocaleString()}
            </p>
          </div>
          
          {/* Button is elevated to z-20 so it can still be clicked directly */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddToCart();
            }}
            disabled={!inStock}
            className={`p-2.5 rounded-xl flex items-center justify-center transition-all duration-300 relative z-20 select-none shadow-sm ${
              justAdded
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white scale-110'
                : inStock 
                  ? 'bg-slate-50 hover:bg-gradient-to-r hover:from-primary hover:to-primary-600 text-slate-750 hover:text-white dark:bg-slate-850 dark:text-slate-200 hover:scale-110 hover:shadow-md hover:shadow-primary/20 cursor-pointer' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-850 dark:text-slate-600'
            }`}
            aria-label="Add to cart"
          >
            {justAdded ? <Check className="h-4.5 w-4.5" /> : <ShoppingCart className="h-4.5 w-4.5" />}
          </button>
        </div>
        
        <div className="mt-3">
           <span className={`text-xs font-medium ${inStock ? 'text-primary-600 dark:text-primary-400' : 'text-red-500'}`}>
              {inStock ? '✓ In Stock' : '✗ Out of Stock'}
           </span>
        </div>
      </div>
    </div>
  );
}