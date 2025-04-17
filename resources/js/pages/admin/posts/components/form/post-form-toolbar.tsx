import { Button } from "@/components/ui/button";
import { FileText, Save, Eye, Trash2, Archive, ChevronDown } from "lucide-react";
import { usePostForm } from "./post-form-context";
import { router } from "@inertiajs/react";
import { bypassUnsavedChangesWarning } from "@/components/unsaved-changes-warning";
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
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export function PostFormToolbar() {
  const { form, mode, post, handleSubmit, onDelete } = usePostForm();
  const { data, setData, processing } = form;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <div className="flex items-center justify-between border-b bg-background px-3 sm:px-4 py-2 w-full max-w-full overflow-hidden sticky top-0 z-50">
      <div className="flex items-center gap-2 md:gap-4">
        <FileText className="h-5 w-5 text-muted-foreground" />
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {mode === 'create' ? 'New Post' : 'Edit Post'}
          </span>
          {mode === 'edit' && post && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <span
                className={`inline-block w-2 h-2 rounded-full ${post.status === 'published' ? 'bg-green-500' : post.status === 'draft' ? 'bg-yellow-500' : 'bg-gray-500'}`}
              />
              Status: {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
            </span>
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
              window.open(`${window.location.origin}/posts/${data.slug}?preview=true`, '_blank');
            }
          }}
          disabled={!data.slug || processing}
          className="h-8 gap-1 hidden md:flex"
        >
          <Eye className="h-4 w-4" />
          Preview
        </Button>

        {/* Save Button - Uses the current status value */}
        <Button
          type="button"
          size="sm"
          onClick={() => {
            // Submit the form with the current status, bypassing the unsaved changes warning
            bypassUnsavedChangesWarning(() => {
              handleSubmit({ preventDefault: () => {} } as React.FormEvent);
            });
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

        {/* Status Dropdown - For changing status without submitting */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={processing}
              className="h-8 gap-1"
              data-status-dropdown-trigger
            >
              <span
                className={`inline-block w-2 h-2 rounded-full mr-1 ${data.status === 'published' ? 'bg-green-500' : data.status === 'draft' ? 'bg-yellow-500' : 'bg-gray-500'}`}
              />
              <span className="hidden sm:inline">Status: </span>
              {data.status.charAt(0).toUpperCase() + data.status.slice(1)} <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => setData('status', 'draft')}
              className="flex items-center gap-2"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-yellow-500" />
              Draft
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setData('status', 'published')}
              className="flex items-center gap-2"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
              Published
            </DropdownMenuItem>
            {mode === 'edit' && (
              <DropdownMenuItem
                onClick={() => setData('status', 'archived')}
                className="flex items-center gap-2"
              >
                <span className="inline-block w-2 h-2 rounded-full bg-gray-500" />
                Archived
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Delete Button - Only in Edit Mode */}
        {mode === 'edit' && post && (
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
                <AlertDialogTitle>Are you sure you want to delete this post?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the post
                  "{post.title}" and remove it from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    if (onDelete && post) {
                      onDelete(post.id);
                    } else {
                      // Fallback if onDelete is not provided
                      router.delete(route('admin.posts.destroy', post.id));
                    }
                  }}
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
