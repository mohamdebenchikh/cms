import { useState } from 'react';
import { router } from '@inertiajs/react';
import { usePageForm } from '.';
import { Button } from '@/components/ui/button';
import { File, Save, Eye, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export function PageFormToolbar() {
  const { data, processing, mode, page } = usePageForm();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    if (page?.id) {
      router.delete(route('admin.pages.destroy', page.id), {
        onSuccess: () => {
          // Redirect will happen automatically
        },
      });
    }
  };

  return (
    <div className="flex items-center justify-between border-b bg-background px-3 sm:px-4 py-2 w-full max-w-full overflow-hidden">
      <div className="flex items-center gap-2 md:gap-4">
        <File className="h-5 w-5 text-muted-foreground" />
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {mode === 'create' ? 'New Page' : 'Edit Page'}
          </span>
          {mode === 'edit' && page && (
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${data.status === 'published' ? 'bg-green-500' : data.status === 'draft' ? 'bg-yellow-500' : 'bg-gray-500'}`}
                />
                Status: {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
              </span>
              <span className="text-xs text-muted-foreground">
                Last updated: {new Date(page.updated_at).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 md:gap-2">
        {/* Preview Button - Hidden on small screens */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            // Open preview in new tab
            if (data.slug) {
              window.open(`${window.location.origin}/pages/${data.slug}?preview=true`, '_blank');
            }
          }}
          disabled={!data.slug || processing}
          className="h-8 gap-1 hidden md:flex"
        >
          <Eye className="h-4 w-4" />
          Preview
        </Button>

        {/* Save Button */}
        <Button
          type="button"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            const form = document.querySelector('form');
            if (form) {
              form.dispatchEvent(new Event('submit', { bubbles: true }));
            }
          }}
          disabled={processing}
          className="h-8 gap-1"
        >
          <Save className="h-4 w-4" />
          <span className="hidden sm:inline">
            {data.status === 'draft' ? 'Save Draft' :
             data.status === 'published' ? (mode === 'create' ? 'Publish' : 'Update') :
             'Save as ' + data.status.charAt(0).toUpperCase() + data.status.slice(1)}
          </span>
        </Button>

        {/* Delete Button - Only in Edit Mode */}
        {mode === 'edit' && page && (
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="h-8 gap-1 ml-2 md:ml-4"
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Delete</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to delete this page?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the page
                  "{page.title}" and remove it from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}


      </div>
    </div>
  );
}
