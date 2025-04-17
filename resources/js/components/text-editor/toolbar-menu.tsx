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
import { Toggle } from '@/components/ui/toggle';
import { LinkDialog } from './link-dialog';
import { ImageDialog } from './image-dialog';
import {
    BasicFormatButtons,
    HeadingDropdown,
    ListDropdown,
    AlignmentDropdown,
    MoreFeaturesDropdown
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
        <div className="flex flex-wrap items-center justify-between mb-2 pb-2 border-b max-w-full">
            <div className="flex flex-wrap items-center gap-1">
                {/* Essential formatting controls - always visible */}
                <div className="flex items-center bg-muted/30 rounded-md p-1 my-1">
                    <BasicFormatButtons editor={editor} />
                </div>

                {/* Structure controls - always visible */}
                <div className="flex items-center bg-muted/30 rounded-md p-1 my-1">
                    <HeadingDropdown editor={editor} />
                </div>

                {/* List and quote controls */}
                <div className="hidden sm:flex items-center bg-muted/30 rounded-md p-1 my-1">
                    <ListDropdown editor={editor} />
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('blockquote')}
                        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
                        aria-label="Toggle blockquote"
                        className="rounded-md h-8 w-8"
                    >
                        <Quote className="h-4 w-4" />
                    </Toggle>
                </div>

                {/* Alignment controls */}
                <div className="hidden sm:flex items-center bg-muted/30 rounded-md p-1 my-1">
                    <AlignmentDropdown editor={editor} />
                </div>

                {/* Insert controls */}
                <div className="flex items-center bg-muted/30 rounded-md p-1 my-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowLinkDialog(true)}
                        className={cn(
                            "rounded-md h-8 w-8",
                            editor.isActive('link') && "bg-accent text-accent-foreground"
                        )}
                        aria-label="Insert link"
                    >
                        <Link className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowImageDialog(true)}
                        className="rounded-md h-8 w-8"
                        aria-label="Insert image"
                    >
                        <Image className="h-4 w-4" />
                    </Button>
                </div>

                {/* History controls */}
                <div className="hidden sm:flex items-center bg-muted/30 rounded-md p-1 my-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        className="rounded-md h-8 w-8"
                        aria-label="Undo"
                    >
                        <Undo className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        className="rounded-md h-8 w-8"
                        aria-label="Redo"
                    >
                        <Redo className="h-4 w-4" />
                    </Button>
                </div>

                {/* More features dropdown - contains overflow items */}
                <div className="flex items-center bg-muted/30 rounded-md p-1 my-1">
                    <MoreFeaturesDropdown editor={editor} />
                </div>
            </div>

            {/* Fullscreen toggle button */}
            <div className="flex items-center my-1">
                {onToggleFullscreen && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onToggleFullscreen}
                        className="h-8 w-8 p-0"
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
            </div>

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
