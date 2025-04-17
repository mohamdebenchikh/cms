import React from 'react';
import { Editor } from '@tiptap/react';
import { cn } from '@/lib/utils';
import {
    Link,
    Image,
    Undo,
    Redo,
    Quote,
    Maximize2,
    Minimize2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Toggle } from '@/components/ui/toggle';
import { LinkDialog } from './link-dialog';
import { ImageDialog } from './image-dialog';
import {
    BasicFormatButtons,
    HeadingDropdown,
    ListDropdown,
    AlignmentDropdown
} from './toolbar-components';

interface ToolbarMenuProps {
    editor: Editor;
    isFullscreen?: boolean;
    onToggleFullscreen?: () => void;
}

export function ToolbarMenu({ editor, isFullscreen = false, onToggleFullscreen }: ToolbarMenuProps) {
    const [showLinkDialog, setShowLinkDialog] = React.useState(false);
    const [showImageDialog, setShowImageDialog] = React.useState(false);

    if (!editor) {
        return null;
    }

    return (
        <div className="border border-input bg-background rounded-md mb-4 p-2.5 flex flex-wrap gap-2 items-center justify-between">
            <div className="flex flex-wrap gap-2 items-center">
                {/* Basic formatting buttons */}
                <BasicFormatButtons editor={editor} />
                
                <Separator orientation="vertical" className="h-6" />
                
                {/* Heading dropdown */}
                <HeadingDropdown editor={editor} />
                
                <Separator orientation="vertical" className="h-6" />
                
                {/* List dropdown */}
                <ListDropdown editor={editor} />
                
                {/* Blockquote button */}
                <Toggle
                    size="sm"
                    pressed={editor.isActive('blockquote')}
                    onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
                    aria-label="Toggle blockquote"
                >
                    <Quote className="h-4 w-4" />
                </Toggle>
                
                <Separator orientation="vertical" className="h-6" />
                
                {/* Alignment dropdown */}
                <AlignmentDropdown editor={editor} />
                
                <Separator orientation="vertical" className="h-6" />
                
                {/* Link button */}
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
                
                {/* Image button */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowImageDialog(true)}
                    className="h-8 w-8 p-0"
                    aria-label="Insert image"
                >
                    <Image className="h-4 w-4" />
                </Button>
                
                <Separator orientation="vertical" className="h-6" />
                
                {/* Undo/Redo buttons */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    className="h-8 w-8 p-0"
                    aria-label="Undo"
                >
                    <Undo className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    className="h-8 w-8 p-0"
                    aria-label="Redo"
                >
                    <Redo className="h-4 w-4" />
                </Button>
            </div>
            
            {/* Fullscreen toggle button */}
            {onToggleFullscreen && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onToggleFullscreen}
                    className="h-8 w-8 p-0 ml-auto"
                    aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                    title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                    {isFullscreen ? (
                        <Minimize2 className="h-4 w-4" />
                    ) : (
                        <Maximize2 className="h-4 w-4" />
                    )}
                </Button>
            )}
            
            {/* Dialogs */}
            {showLinkDialog && (
                <LinkDialog
                    editor={editor}
                    isOpen={showLinkDialog}
                    onClose={() => setShowLinkDialog(false)}
                />
            )}

            {showImageDialog && (
                <ImageDialog
                    editor={editor}
                    isOpen={showImageDialog}
                    onClose={() => setShowImageDialog(false)}
                />
            )}
        </div>
    );
}
