import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Category } from '@/types';
import { FolderOpen } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
  className?: string;
}

export function CategoryCard({ category, className = '' }: CategoryCardProps) {
  const [imageError, setImageError] = useState(false);
  
  // Handle image loading error
  const handleImageError = () => {
    setImageError(true);
  };
  
  // Determine if we should show the placeholder
  const showPlaceholder = !category.image_cover || imageError;
  
  // Get the first letter of the category name for the placeholder
  const firstLetter = category.name.charAt(0).toUpperCase();
  
  // Generate a background color based on the category name for variety
  const generateColor = (name: string) => {
    const colors = [
      'bg-primary/10', 'bg-blue-500/10', 'bg-green-500/10', 
      'bg-yellow-500/10', 'bg-purple-500/10', 'bg-pink-500/10',
      'bg-indigo-500/10', 'bg-red-500/10', 'bg-orange-500/10'
    ];
    
    // Simple hash function to get a consistent color for the same category name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };
  
  const placeholderColor = generateColor(category.name);
  
  return (
    <Card className={`overflow-hidden hover:shadow-md transition-shadow ${className}`}>
      <Link href={route('blog.category', category.slug)}>
        <div className="h-40 bg-muted flex items-center justify-center relative">
          {!showPlaceholder ? (
            <img 
              src={category.image_cover} 
              alt={category.name} 
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${placeholderColor}`}>
              <div className="flex flex-col items-center justify-center">
                <div className="text-4xl font-bold text-foreground/40">
                  {firstLetter}
                </div>
                <FolderOpen className="h-8 w-8 mt-2 text-foreground/40" />
              </div>
            </div>
          )}
        </div>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-2 line-clamp-1">{category.name}</h3>
          {category.description && (
            <p className="text-muted-foreground line-clamp-2 mb-4 text-sm">
              {category.description}
            </p>
          )}
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {category.posts_count || 0} {category.posts_count === 1 ? 'post' : 'posts'}
            </span>
            <Button variant="ghost" size="sm" className="font-medium">
              Browse
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
