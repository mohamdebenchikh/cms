import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import { Post } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getImageUrl } from '@/utils/image';

interface HeroCarouselProps {
  posts: Post[];
  autoplayInterval?: number;
}

export function HeroCarousel({ posts, autoplayInterval = 5000 }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean[]>(Array(posts.length).fill(true));
  const [hasError, setHasError] = useState<boolean[]>(Array(posts.length).fill(false));
  const [isPaused, setIsPaused] = useState(false);

  // Handle image loading and errors
  const handleImageLoad = (index: number) => {
    const newLoadingState = [...isLoading];
    newLoadingState[index] = false;
    setIsLoading(newLoadingState);
  };

  const handleImageError = (index: number) => {
    const newLoadingState = [...isLoading];
    newLoadingState[index] = false;
    setIsLoading(newLoadingState);

    const newErrorState = [...hasError];
    newErrorState[index] = true;
    setHasError(newErrorState);
  };

  // Navigation functions
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? posts.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === posts.length - 1 ? 0 : prevIndex + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Autoplay functionality
  useEffect(() => {
    if (isPaused || posts.length <= 1) return;

    const interval = setInterval(() => {
      goToNext();
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused, posts.length, autoplayInterval]);

  // Pause autoplay on hover
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // If no posts, don't render anything
  if (!posts.length) return null;

  return (
    <div
      className="relative mb-12 overflow-hidden rounded-lg"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Carousel slides */}
      <div className="relative aspect-[21/9] w-full overflow-hidden rounded-lg bg-muted">
        {posts.map((post, index) => (
          <div
            key={post.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000",
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            )}
          >
            {/* Image */}
            {getImageUrl(post.featured_image) ? (
              <>
                {/* Placeholder shown while loading or on error */}
                <div
                  className={cn(
                    "absolute inset-0 flex items-center justify-center bg-muted transition-opacity duration-300",
                    !isLoading[index] && !hasError[index] ? "opacity-0" : "opacity-100"
                  )}
                >
                  <ImageIcon className="h-16 w-16 text-muted-foreground opacity-50" />
                </div>

                {/* Actual image */}
                <img
                  src={getImageUrl(post.featured_image)}
                  alt={post.title}
                  className={cn(
                    "h-full w-full object-cover transition-opacity duration-300",
                    isLoading[index] || hasError[index] ? "opacity-0" : "opacity-100"
                  )}
                  onLoad={() => handleImageLoad(index)}
                  onError={() => handleImageError(index)}
                />
              </>
            ) : (
              <div className="flex h-full items-center justify-center bg-muted">
                <ImageIcon className="h-16 w-16 text-muted-foreground opacity-50" />
              </div>
            )}

            {/* Content overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

            {/* Post content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
              <div className="flex items-center gap-2 mb-3">
                {post.category && (
                  <Badge variant="secondary" className="bg-primary text-primary-foreground hover:bg-primary/80" asChild>
                    <Link href={route('blog.category', post.category.slug)}>
                      {post.category.name}
                    </Link>
                  </Badge>
                )}
                <span className="text-xs text-white/70">
                  {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 line-clamp-2">
                <Link href={route('blog.post', post.slug)} className="hover:underline">
                  {post.title}
                </Link>
              </h2>

              <p className="text-white/80 mb-4 line-clamp-2 max-w-3xl">
                {post.excerpt}
              </p>

              <Button asChild variant="default" size="sm" className="mt-2">
                <Link href={route('blog.post', post.slug)}>
                  Read More
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {posts.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 text-white hover:bg-black/50"
            onClick={goToPrevious}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 text-white hover:bg-black/50"
            onClick={goToNext}
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Indicators */}
      {posts.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {posts.map((_, index) => (
            <button
              key={index}
              className={cn(
                "h-2 w-2 rounded-full transition-all",
                index === currentIndex
                  ? "bg-white w-6"
                  : "bg-white/50 hover:bg-white/80"
              )}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
