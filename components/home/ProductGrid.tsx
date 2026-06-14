import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard, { ProductProps } from './ProductCard';

interface ProductGridProps {
  title: string;
  products: ProductProps[];
  viewAllLink?: string;
  banner?: {
    image: string;
    description?: string;
    specs?: Record<string, any>;
  };
}

export default function ProductGrid({ title, products, viewAllLink, banner }: ProductGridProps) {
  const isBannerActive = banner ? banner.specs?.['Is Active'] !== false : false;
  const style = banner?.specs?.['Style'] || 'Simple';
  const linkUrl = banner?.specs?.['Link URL'] || '';

  // Extract all active grid images
  const images = banner ? [
    { url: banner.image, link: linkUrl },
    { url: banner.specs?.['Image 2'], link: banner.specs?.['Link URL 2'] },
    { url: banner.specs?.['Image 3'], link: banner.specs?.['Link URL 3'] },
    { url: banner.specs?.['Image 4'], link: banner.specs?.['Link URL 4'] },
  ].filter(img => img.url) : [];

  const BannerContent = banner && (
    <div className={`relative w-full h-[120px] md:h-[200px] rounded-2xl overflow-hidden mb-6 transition-all duration-500 border ${
      style === 'Zoom Hover' 
        ? 'hover:shadow-xl hover:border-emerald-500/40 group cursor-pointer border-slate-200 dark:border-slate-800 hover:-translate-y-0.5'
        : style === 'Neon Glow'
          ? 'border-rose-500/20 dark:border-rose-450/30 shadow-[0_0_15px_rgba(244,63,94,0.15)] dark:shadow-[0_0_20px_rgba(244,63,94,0.1)] hover:scale-[1.002] duration-300'
          : style === 'Pulse Outline'
            ? 'border-emerald-500/40 dark:border-emerald-400/40 animate-pulse'
            : 'border-slate-200 dark:border-slate-800 shadow-xs'
    }`}>
      {/* Title overlay on the banner if present */}
      {banner.description && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 to-transparent flex items-center px-8 z-10">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">PROMO</span>
            <h3 className="text-xl md:text-2xl font-extrabold text-white leading-tight drop-shadow-md">
              {banner.description}
            </h3>
          </div>
        </div>
      )}
      
      <img 
        src={banner.image} 
        className={`w-full h-full object-cover ${style === 'Zoom Hover' ? 'group-hover:scale-102 transition-transform duration-700' : ''}`} 
        alt={title} 
      />
    </div>
  );

  return (
    <div className="mb-16">
      {/* Banner display */}
      {isBannerActive && banner && (
        (style === 'Multi-Image Grid' || style === '4 รูป') && images.length > 0 ? (
          <div className={`grid gap-4 mb-6 grid-cols-1 ${
            images.length === 2 ? 'sm:grid-cols-2' :
            images.length === 3 ? 'sm:grid-cols-3' :
            images.length >= 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'
          }`}>
            {images.map((img, idx) => {
              const cardContent = (
                <div className="relative w-full h-[120px] md:h-[180px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-emerald-500/30 transition-all duration-350 group cursor-pointer flex items-center justify-center bg-slate-50 dark:bg-slate-950/20">
                  {idx === 0 && banner.description && (
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 to-transparent flex items-center px-6 z-10">
                      <h3 className="text-sm md:text-base font-extrabold text-white leading-tight drop-shadow-sm line-clamp-2">
                        {banner.description}
                      </h3>
                    </div>
                  )}
                  <img 
                    src={img.url} 
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
                    alt={`${title} banner ${idx + 1}`} 
                  />
                </div>
              );

              return img.link ? (
                <Link key={idx} href={img.link} className="block group">
                  {cardContent}
                </Link>
              ) : (
                <div key={idx}>{cardContent}</div>
              );
            })}
          </div>
        ) : (
          linkUrl ? (
            <Link href={linkUrl} className="block group mb-6">
              {BannerContent}
            </Link>
          ) : (
            <div className="mb-6">{BannerContent}</div>
          )
        )
      )}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <span className="w-2 h-8 bg-primary rounded-full"></span>
          {title}
        </h2>
        
        {viewAllLink && (
          <Link 
            href={viewAllLink} 
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-700 dark:hover:text-primary-400 transition-colors"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      
      {products.length === 0 ? (
        <div className="py-8 text-center bg-slate-50/50 dark:bg-slate-900/30 border border-dashed border-slate-200 dark:border-slate-800/80 rounded-xl">
          <p className="text-xs text-slate-400 dark:text-slate-500">ไม่มีสินค้าในหมวดหมู่นี้ในขณะนี้</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      )}
      
      {viewAllLink && (
        <div className="mt-6 sm:hidden">
          <Link 
            href={viewAllLink} 
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            View All {title} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
