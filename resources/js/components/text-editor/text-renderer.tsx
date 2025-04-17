import { cn } from '@/lib/utils';

interface TextRendererProps {
  content: string;
  className?: string;
}

/**
 * TextRenderer component for displaying styled content created with the TextEditor
 * 
 * This component renders HTML content with the same styling as the TextEditor,
 * but without the editing capabilities.
 */
export function TextRenderer({ content, className }: TextRendererProps) {
  if (!content) {
    return null;
  }

  return (
    <div 
      className={cn(
        // Apply the same typography classes as the editor
        'prose dark:prose-invert prose-sm sm:prose-sm max-w-none',
        'prose-headings:font-heading prose-headings:font-medium',
        'prose-a:text-primary',
        'prose-p:leading-relaxed prose-p:text-sm',
        'prose-pre:rounded-md prose-pre:bg-muted prose-pre:p-4',
        'prose-code:rounded-md prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:font-mono prose-code:text-sm',
        'prose-blockquote:border-l-4 prose-blockquote:border-muted-foreground/30 prose-blockquote:pl-4 prose-blockquote:italic',
        'prose-img:rounded-md',
        'prose-hr:border-muted-foreground/30',
        'prose-ul:list-disc prose-ol:list-decimal',
        'prose-li:my-1 prose-li:text-sm',
        'prose-table:border prose-table:border-muted-foreground/20',
        'prose-th:border prose-th:border-muted-foreground/20 prose-th:bg-muted/50 prose-th:px-3 prose-th:py-2',
        'prose-td:border prose-td:border-muted-foreground/20 prose-td:px-3 prose-td:py-2 prose-td:text-sm',
        className
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
