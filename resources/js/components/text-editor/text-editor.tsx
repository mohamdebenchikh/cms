import { useEffect, useState } from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Typography from '@tiptap/extension-typography';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import Highlight from '@tiptap/extension-highlight';
import { ResizableImage } from './extensions/resizable-image';
import { cn } from '@/lib/utils';
import { ToolbarMenu } from './toolbar-menu';
import { BubbleMenuContent } from './bubble-menu-content';
// Card components removed in favor of custom divs

export type TextEditorVariant = 'toolbar' | 'bubble';

export interface TextEditorProps {
    value: string;
    onChange: (value: string) => void;
    variant?: TextEditorVariant;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    errors?: Record<string, string>;
    fullscreenEnabled?: boolean;
}

export function TextEditor({
    value,
    onChange,
    variant = 'toolbar',
    placeholder = 'Write something...',
    className,
    disabled = false,
    errors,
    fullscreenEnabled = true,
}: TextEditorProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const toggleFullscreen = () => {
        if (fullscreenEnabled) {
            setIsFullscreen(!isFullscreen);
        }
    };

    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline decoration-primary underline-offset-4',
                },
            }),
            // Use our custom ResizableImage extension instead of the default Image extension
            ResizableImage.configure({
                HTMLAttributes: {
                    class: 'rounded-md max-w-full',
                },
                allowBase64: true,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Typography,
            Underline,
            Superscript,
            Subscript,
            Highlight.configure({
                multicolor: true,
            }),
            Placeholder.configure({
                placeholder,
                emptyEditorClass: 'is-editor-empty',
            }),
        ],
        content: value,
        editable: !disabled,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },

        editorProps: {
            attributes: {
                class: cn(
                    'prose dark:prose-invert prose-sm sm:prose-sm max-w-none focus:outline-none',
                    'prose-headings:font-heading prose-headings:font-medium',
                    'prose-a:text-primary',
                    'prose-p:leading-relaxed prose-p:text-sm',
                    'prose-pre:rounded-md prose-pre:bg-muted prose-pre:p-4',
                    'prose-code:rounded-md prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:font-mono prose-code:text-sm',
                    'prose-blockquote:border-l-4 prose-blockquote:border-muted-foreground/30 prose-blockquote:pl-4 prose-blockquote:italic',
                    'prose-img:rounded-md prose-img:my-4',
                    'prose-hr:border-muted-foreground/30',
                    'prose-ul:list-disc prose-ol:list-decimal',
                    'prose-li:my-1 prose-li:text-sm',
                    'prose-table:border prose-table:border-muted-foreground/20',
                    'prose-th:border prose-th:border-muted-foreground/20 prose-th:bg-muted/50 prose-th:px-3 prose-th:py-2',
                    'prose-td:border prose-td:border-muted-foreground/20 prose-td:px-3 prose-td:py-2 prose-td:text-sm',
                ),
            },
        },
    });

    // No need for custom placeholder handling as we're using the Placeholder extension

    // Update content when value changes externally
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value);
        }
    }, [editor, value]);

    // Handle client-side rendering
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Add keyboard shortcut for fullscreen toggle (F11 or Esc)
    useEffect(() => {
        if (!fullscreenEnabled) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            // F11 to toggle fullscreen
            if (e.key === 'F11') {
                e.preventDefault();
                toggleFullscreen();
            }

            // Escape to exit fullscreen
            if (e.key === 'Escape' && isFullscreen) {
                e.preventDefault();
                setIsFullscreen(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [fullscreenEnabled, isFullscreen, toggleFullscreen]);

    if (!isMounted) {
        return null;
    }

    // Render the editor content
    const renderEditorContent = () => (
        <>
            {editor && variant === 'bubble' && (
                <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
                    <BubbleMenuContent editor={editor} />
                </BubbleMenu>
            )}

            {variant === 'toolbar' && editor && (
                <div className='px-3 pt-3 pb-0 w-full max-w-full'>
                    <ToolbarMenu
                        editor={editor}
                        isFullscreen={isFullscreen}
                        onToggleFullscreen={fullscreenEnabled ? toggleFullscreen : undefined}
                    />
                </div>
            )}

            <div className="px-3 pb-3">
                <div
                    className={cn(
                        'relative text-sm',
                        variant === 'bubble'
                            ? 'rounded-md border border-input bg-background px-3 py-2' // Always keep the border for bubble variant
                            : '', // No padding for toolbar variant
                        disabled && 'cursor-not-allowed opacity-50'
                    )}
                >
                    <style dangerouslySetInnerHTML={{
                        __html: `
                        .ProseMirror {
                            min-height: ${variant === 'bubble' ? '100px' : (isFullscreen ? '500px' : '200px')};
                            outline: none;
                            padding: 0.5rem 0;
                            line-height: 1.5;
                            max-width: 100%;
                            overflow-wrap: break-word;
                            word-wrap: break-word;
                            word-break: break-word;
                        }

                        /* Ensure proper spacing after images */
                        .ProseMirror img {
                            display: block;
                            margin: 1rem 0;
                            max-width: 100%;
                            height: auto;
                        }

                        /* Add a paragraph after image if it's the last element */
                        .ProseMirror img:last-child {
                            margin-bottom: 2rem;
                        }

                        /* Ensure tables don't overflow */
                        .ProseMirror table {
                            max-width: 100%;
                            overflow-x: auto;
                            display: block;
                        }

                        /* Ensure code blocks don't overflow */
                        .ProseMirror pre {
                            max-width: 100%;
                            overflow-x: auto;
                            white-space: pre-wrap;
                        }
                        .ProseMirror .is-editor-empty:first-child::before {
                            content: attr(data-placeholder);
                            float: left;
                            color: var(--muted-foreground);
                            pointer-events: none;
                            height: 0;
                            font-size: 0.875rem; /* text-sm */
                            opacity: 0.8;
                        }
                    `}} />
                    <EditorContent editor={editor} />
                </div>
            </div>
        </>
    );

    // Render fullscreen overlay
    if (isFullscreen) {
        return (
            <div className="fixed inset-0 z-50 bg-background flex flex-col overflow-hidden">
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col px-8 py-6 bg-background">
                        {renderEditorContent()}
                    </div>
                </div>
                <div className="fixed bottom-4 right-4 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded-md">
                    Press <kbd className="px-1 py-0.5 bg-muted rounded border border-border">Esc</kbd> to exit fullscreen
                </div>
            </div>
        );
    }

    // Render normal editor
    return (
        <div className={cn('relative overflow-hidden rounded-md w-full max-w-full',
            // Remove the conditional border here to ensure no outer border
            className,
            errors?.content && 'border-destructive'
        )}>
            {renderEditorContent()}
        </div>
    );
}
