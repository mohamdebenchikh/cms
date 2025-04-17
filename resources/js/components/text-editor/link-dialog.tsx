import React, { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface LinkDialogProps {
    editor: Editor;
    isOpen: boolean;
    onClose: () => void;
}

export function LinkDialog({ editor, isOpen, onClose }: LinkDialogProps) {
    const [url, setUrl] = useState('');
    const [openInNewTab, setOpenInNewTab] = useState(true);

    useEffect(() => {
        if (isOpen && editor.isActive('link')) {
            setUrl(editor.getAttributes('link').href || '');
        } else {
            setUrl('');
        }
    }, [isOpen, editor]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // If URL is empty, remove the link
        if (!url) {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            onClose();
            return;
        }

        // Ensure URL has protocol
        let formattedUrl = url;
        if (!/^https?:\/\//i.test(url)) {
            formattedUrl = `https://${url}`;
        }

        // Set the link
        editor
            .chain()
            .focus()
            .extendMarkRange('link')
            .setLink({ 
                href: formattedUrl, 
                target: openInNewTab ? '_blank' : null 
            })
            .run();

        onClose();
    };

    const removeLink = () => {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>
                            {editor.isActive('link') ? 'Edit Link' : 'Insert Link'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="url">URL</Label>
                            <Input
                                id="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://example.com"
                                autoFocus
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="new-tab"
                                checked={openInNewTab}
                                onCheckedChange={(checked) => 
                                    setOpenInNewTab(checked as boolean)
                                }
                            />
                            <Label htmlFor="new-tab">Open in new tab</Label>
                        </div>
                    </div>
                    <DialogFooter className="flex justify-between sm:justify-between">
                        <div>
                            {editor.isActive('link') && (
                                <Button 
                                    type="button" 
                                    variant="destructive" 
                                    onClick={removeLink}
                                >
                                    Remove Link
                                </Button>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                {editor.isActive('link') ? 'Update' : 'Insert'}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
