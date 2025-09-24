"use client";
import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { generateCollectionLD } from '@/lib/structured-data';

interface Movie {
  id: string;
  title: string;
  slug: string;
  release_date: string;
  poster_path: string;
  vote_average: number;
  overview: string;
}

interface MovieCarouselProps {
  title: string;
  movies: Movie[];
  href?: string;
  description?: string;
  showViewAll?: boolean;
}

export default function MovieCarousel({ 
  title, 
  movies, 
  href, 
  description,
  showViewAll = true 
}: MovieCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollAmount = 300;
    const newPosition = direction === 'left' 
      ? scrollPosition - scrollAmount 
      : scrollPosition + scrollAmount;
    
    container.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
    
    setScrollPosition(newPosition);
  };

  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = scrollContainerRef.current 
    ? scrollPosition < (scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth)
    : false;

  return (
    <section className="mb-12" aria-label={title}>
      {/* Carousel Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Inter Tight, sans-serif' }}>
            {title}
          </h2>
          {description && (
            <p className="text-gray-400 text-sm">{description}</p>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {/* Scroll Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="w-8 h-8 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors"
              aria-label="Scroll left"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="w-8 h-8 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors"
              aria-label="Scroll right"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          {/* View All Link */}
          {showViewAll && href && (
            <Link 
              href={href}
              className="text-[#E0B15C] hover:text-[#F2C879] text-sm font-medium transition-colors"
            >
              View All →
            </Link>
          )}
        </div>
      </div>

      {/* Movie Grid */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {movies.map((movie) => (
          <Link key={movie.id} href={`/movie/${movie.slug}`} className="group flex-shrink-0">
            <article className="w-48 bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300 group-hover:scale-105">
              <div className="relative aspect-[2/3]">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={`${movie.title} movie poster`}
                  fill
                  sizes="192px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                    {movie.vote_average?.toFixed(1) || 'N/A'} ⭐
                  </span>
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-[#E0B15C] transition-colors">
                  {movie.title}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(movie.release_date).getFullYear()}
                </p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}

