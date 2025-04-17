import React from 'react';
import { Editor } from '@tiptap/react';
import { cn } from '@/lib/utils';
import { 
    Bold, 
    Italic, 
    Underline, 
    Strikethrough, 
    Code, 
    Link, 
    Heading1, 
    Heading2, 
    List, 
    ListOrdered, 
    Quote
} from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { LinkDialog } from './link-dialog';

interface BubbleMenuContentProps {
    editor: Editor;
}

export function BubbleMenuContent({ editor }: BubbleMenuContentProps) {
    const [showLinkDialog, setShowLinkDialog] = React.useState(false);

    if (!editor) {
        return null;
    }

    return (
        <div className="flex items-center gap-1 rounded-md border border-input bg-background p-1 shadow-md">
            <Toggle
                size="sm"
                pressed={editor.isActive('bold')}
                onPressedChange={() => editor.chain().focus().toggleBold().run()}
                aria-label="Toggle bold"
                className="h-8 w-8 p-0"
            >
                <Bold className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive('italic')}
                onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                aria-label="Toggle italic"
                className="h-8 w-8 p-0"
            >
                <Italic className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive('strike')}
                onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                aria-label="Toggle strikethrough"
                className="h-8 w-8 p-0"
            >
                <Strikethrough className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive('code')}
                onPressedChange={() => editor.chain().focus().toggleCode().run()}
                aria-label="Toggle code"
                className="h-8 w-8 p-0"
            >
                <Code className="h-4 w-4" />
            </Toggle>

            <Separator orientation="vertical" className="h-6" />

            <Toggle
                size="sm"
                pressed={editor.isActive('heading', { level: 1 })}
                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                aria-label="Toggle heading 1"
                className="h-8 w-8 p-0"
            >
                <Heading1 className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive('heading', { level: 2 })}
                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                aria-label="Toggle heading 2"
                className="h-8 w-8 p-0"
            >
                <Heading2 className="h-4 w-4" />
            </Toggle>

            <Separator orientation="vertical" className="h-6" />

            <Toggle
                size="sm"
                pressed={editor.isActive('bulletList')}
                onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                aria-label="Toggle bullet list"
                className="h-8 w-8 p-0"
            >
                <List className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive('orderedList')}
                onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                aria-label="Toggle ordered list"
                className="h-8 w-8 p-0"
            >
                <ListOrdered className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive('blockquote')}
                onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
                aria-label="Toggle blockquote"
                className="h-8 w-8 p-0"
            >
                <Quote className="h-4 w-4" />
            </Toggle>

            <Separator orientation="vertical" className="h-6" />

            <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowLinkDialog(true)}
                className={cn(
                    "h-8 w-8 p-0",
                    editor.isActive('link') && "bg-accent text-accent-foreground"
                )}
                aria-label="Insert link"
            >
                <Link className="h-4 w-4" />
            </Button>

            {showLinkDialog && (
                <LinkDialog 
                    editor={editor} 
                    isOpen={showLinkDialog} 
                    onClose={() => setShowLinkDialog(false)} 
                />
            )}
        </div>
    );
}
