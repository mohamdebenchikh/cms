import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TextRenderer } from "./text-editor";
import { Badge } from "./ui/badge";
import { CalendarIcon, ClockIcon, UserIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface PostPreviewProps {
  title: string;
  content: string;
  excerpt?: string;
  author?: {
    name: string;
    avatar?: string;
  };
  publishedAt?: string;
  readingTime?: string;
  categories?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  featuredImage?: string;
}

/**
 * PostPreview component for displaying a post with styled content
 * 
 * This component can be used to preview posts or display them on the frontend
 */
export function PostPreview({
  title,
  content,
  excerpt,
  author,
  publishedAt,
  readingTime = "5 min read",
  categories = [],
  featuredImage,
}: PostPreviewProps) {
  return (
    <Card className="overflow-hidden">
      {featuredImage && (
        <div className="relative w-full h-[200px] md:h-[300px] overflow-hidden">
          <img 
            src={featuredImage} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <CardHeader className="space-y-2">
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge key={category.id} variant="outline">
                {category.name}
              </Badge>
            ))}
          </div>
        )}
        
        <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
        
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          {author && (
            <div className="flex items-center gap-1">
              <UserIcon className="h-4 w-4" />
              <span>{author.name}</span>
            </div>
          )}
          
          {publishedAt && (
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              <span>{formatDistanceToNow(new Date(publishedAt), { addSuffix: true })}</span>
            </div>
          )}
          
          <div className="flex items-center gap-1">
            <ClockIcon className="h-4 w-4" />
            <span>{readingTime}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {excerpt && (
          <div className="text-muted-foreground italic border-l-4 border-muted-foreground/30 pl-4 py-2">
            {excerpt}
          </div>
        )}
        
        <TextRenderer content={content} />
      </CardContent>
    </Card>
  );
}
