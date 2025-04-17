import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { ImageIcon, User } from 'lucide-react';
import { Post } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getImageUrl } from '@/utils/image';

interface PostCardProps {
  post: Post;
  variant?: 'horizontal' | 'vertical';
  className?: string;
}

export function PostCard({ post, variant = 'horizontal', className = '' }: PostCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [hasImageError, setHasImageError] = useState(false);

  const handleImageLoad = () => {
    setIsImageLoading(false);
    setHasImageError(false);
  };

  const handleImageError = () => {
    setIsImageLoading(false);
    setHasImageError(true);
  };

  // Determine if we should render in horizontal or vertical layout
  const isHorizontal = variant === 'horizontal';

  return (
    <Card className={`overflow-hidden p-0 ${className}`}>
      <div className={isHorizontal ? 'md:flex' : ''}>
        {/* Featured Image */}
        {getImageUrl(post.featured_image) && (
          <div
            className={`
              relative overflow-hidden bg-muted
              ${isHorizontal
                ? 'aspect-[16/9] md:aspect-square md:w-1/3'
                : 'aspect-[16/9] w-full'
              }
            `}
          >
            {/* Placeholder shown while loading or on error */}
            <div
              className={`
                absolute inset-0 flex items-center justify-center bg-muted
                transition-opacity duration-300
                ${!isImageLoading && !hasImageError ? 'opacity-0' : 'opacity-100'}
              `}
            >
              <ImageIcon className="h-10 w-10 text-muted-foreground opacity-50" />
            </div>

            {/* Actual image */}
            <img
              src={getImageUrl(post.featured_image)}
              alt={post.title}
              className={`
                h-full w-full object-cover
                transition-opacity duration-300
                ${isImageLoading || hasImageError ? 'opacity-0' : 'opacity-100'}
              `}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </div>
        )}

        {/* Content */}
        <div className={`
          flex flex-col p-6
          ${isHorizontal && post.featured_image ? 'md:w-2/3' : 'w-full'}
        `}>
          <CardHeader className="p-0 pb-4">
            <div className="flex items-center gap-2 mb-2">
              {post.category && (
                <Badge variant="outline" asChild>
                  <Link href={route('blog.category', post.category.slug)}>
                    {post.category.name}
                  </Link>
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </span>
            </div>
            <CardTitle className={`${isHorizontal ? 'line-clamp-2' : 'line-clamp-3'}`}>
              <Link href={route('blog.post', post.slug)} className="hover:underline">
                {post.title}
              </Link>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0 pb-4 flex-grow">
            <p className="text-muted-foreground line-clamp-3">
              {post.excerpt}
            </p>
          </CardContent>

          <CardFooter className="p-0 flex justify-between items-center">
            <div className="text-sm flex items-center gap-1">
              {post.user && (
                <>
                  <User className="h-3 w-3" />
                  <span>By {post.user.name}</span>
                </>
              )}
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href={route('blog.post', post.slug)}>
                Read More
              </Link>
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
}
