import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Check, ChevronDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Post } from '@/types';
import { getStatusVariant } from '../utils';

interface StatusDropdownProps {
  post: Post;
  onStatusChange?: (post: Post) => void;
}

type Status = 'draft' | 'published' | 'archived';

const statusOptions: { value: Status; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

export function StatusDropdown({ post, onStatusChange }: StatusDropdownProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const currentStatus = post.status as Status;

  const handleStatusChange = async (newStatus: Status) => {
    if (newStatus === currentStatus) return;
    
    setIsUpdating(true);
    
    try {
      const response = await axios.patch(route('admin.posts.update-status', post.id), {
        status: newStatus,
      });
      
      if (response.data.success) {
        toast.success(response.data.message);
        
        // Call the callback with the updated post
        if (onStatusChange && response.data.post) {
          onStatusChange(response.data.post);
        }
      }
    } catch (error) {
      console.error('Error updating post status:', error);
      toast.error('Failed to update post status');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={cn(
            "h-8 border-dashed",
            getStatusVariant(currentStatus) === "default" && "border-muted-foreground/20 text-muted-foreground",
            getStatusVariant(currentStatus) === "success" && "border-green-500/20 text-green-500",
            getStatusVariant(currentStatus) === "secondary" && "border-orange-500/20 text-orange-500",
            getStatusVariant(currentStatus) === "destructive" && "border-red-500/20 text-red-500",
          )}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <>
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              {statusOptions.find(option => option.value === currentStatus)?.label}
              <ChevronDown className="ml-2 h-3.5 w-3.5" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {statusOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleStatusChange(option.value)}
            disabled={isUpdating || option.value === currentStatus}
            className={cn(
              option.value === currentStatus && "font-medium",
            )}
          >
            {option.value === currentStatus && (
              <Check className="mr-2 h-4 w-4" />
            )}
            {!option.value === currentStatus && (
              <div className="mr-2 h-4 w-4" />
            )}
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
