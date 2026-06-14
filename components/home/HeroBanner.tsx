'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import type { HeroSlide } from '@/lib/types';

interface HeroBannerProps {
  slides: HeroSlide[];
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: 'default-1',
    title: 'Next-Gen Computing Power',
    subtitle: 'Mega Sale 2026',
    description: 'ค้นพบแล็ปท็อป พีซีตั้งโต๊ะ และชิ้นส่วนฮาร์ดแวร์ประสิทธิภาพสูงล่าสุด อัปเกรดเซ็ตอัปของคุณด้วยคุณภาพและการบริการที่เหนือระดับ',
    buttonText1: 'ช้อปเลย',
    buttonLink1: '/shop',
    buttonText2: 'ติดต่อ',
    buttonLink2: '/contact',
    imageUrl: 'https://images.unsplash.com/photo-1600861195091-690c92f1d2cc?q=80&w=1600&auto=format&fit=crop',
    orderIndex: 0
  },
  {
    id: 'default-2',
    imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=1600&auto=format&fit=crop',
    orderIndex: 1
  },
  {
    id: 'default-3',
    imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1600&auto=format&fit=crop',
    orderIndex: 2
  }
];

export default function HeroBanner({ slides }: HeroBannerProps) {
  const activeSlides = slides && slides.length > 0 ? slides : DEFAULT_SLIDES;
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const router = useRouter();

  const handleSlideClick = (e: React.MouseEvent<HTMLDivElement>, link?: string) => {
    if (!link) return;
    
    // Ignore click if user clicked on button, anchor link, dot navigation, or chevron arrows
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) {
      return;
    }
    
    router.push(link);
  };

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % activeSlides.length);
    }, 5000); // 5 seconds auto-play

    return () => clearInterval(interval);
  }, [activeSlides.length]);

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % activeSlides.length);
  };

  return (
    <div className="relative w-full aspect-[800/339] bg-slate-900 rounded-2xl overflow-hidden shadow-xl mb-12 group">
      {/* Slides wrapper */}
      <div className="relative w-full h-full">
        {activeSlides.map((slide, index) => {
          const isActive = index === currentSlideIndex;
          const hasContent = slide.title || slide.description;

          return (
            <div
              key={slide.id}
              onClick={(e) => isActive && handleSlideClick(e, slide.buttonLink1 || slide.buttonLink2)}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              } ${slide.buttonLink1 || slide.buttonLink2 ? 'cursor-pointer' : ''}`}
            >
              {/* Background Image */}
              <div className="absolute inset-0 w-full h-full select-none">
                <Image
                  src={slide.imageUrl}
                  alt={slide.title || 'Promo Banner'}
                  fill
                  priority={index === 0}
                  unoptimized
                  className="object-cover object-center"
                />
                {/* Dark overlay for readability - rendered only when slide has custom text overlay to protect contrast */}
                {hasContent && (
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent" />
                )}
              </div>

              {/* Abstract decorative shapes - Rendered only on content slides for aesthetics */}
              {hasContent && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-primary-500 opacity-20 blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-500 opacity-20 blur-3xl"></div>
                </div>
              )}

              {/* Slide Content Overlay */}
              {hasContent && (
                <div className="relative z-10 h-full py-16 px-8 md:py-24 md:px-16 flex flex-col justify-center items-start max-w-3xl">
                  {slide.subtitle && (
                    <span className="inline-block py-1 px-3 rounded-full bg-primary-500/20 text-primary-300 text-sm font-semibold tracking-wider uppercase mb-4 md:mb-6 border border-primary-500/30">
                      {slide.subtitle}
                    </span>
                  )}
                  {slide.title && (
                    <h1 className="text-3xl md:text-6xl font-extrabold text-white tracking-tight mb-4 md:mb-6 leading-tight">
                      {slide.title}
                    </h1>
                  )}
                  {slide.description && (
                    <p className="text-sm md:text-xl text-slate-300 mb-6 md:mb-10 max-w-2xl leading-relaxed line-clamp-3 md:line-clamp-none">
                      {slide.description}
                    </p>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex flex-row gap-3 w-full sm:w-auto">
                    {slide.buttonText1 && slide.buttonLink1 && (
                      <Link
                        href={slide.buttonLink1}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex justify-center items-center gap-2 bg-primary hover:bg-primary-600 text-white font-bold py-2.5 px-5 md:py-4 md:px-8 rounded-lg shadow-lg shadow-primary-500/30 transition-all duration-300 transform hover:-translate-y-0.5 text-sm md:text-base"
                      >
                        {slide.buttonText1} <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
                      </Link>
                    )}
                    {slide.buttonText2 && slide.buttonLink2 && (
                      <Link
                        href={slide.buttonLink2}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex justify-center items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold py-2.5 px-5 md:py-4 md:px-8 rounded-lg backdrop-blur-sm border border-white/20 transition-all duration-300 text-sm md:text-base"
                      >
                        {slide.buttonText2}
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Slide Navigation Arrows */}
      {activeSlides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-slate-900/50 hover:bg-slate-900/85 text-white/70 hover:text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-slate-900/50 hover:bg-slate-900/85 text-white/70 hover:text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Next Slide"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {activeSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlideIndex(index)}
              className={`h-2 md:h-2.5 rounded-full transition-all duration-300 ${
                index === currentSlideIndex
                  ? 'w-6 md:w-8 bg-primary shadow-sm shadow-primary'
                  : 'w-2 md:w-2.5 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
