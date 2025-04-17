import { Button } from '@/components/ui/button';
import { Save, Eye, ChevronDown } from 'lucide-react';
import { usePageForm } from '.';

export function PageFormMobileActions() {
  const { data, setData, processing, mode } = usePageForm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = document.querySelector('form');
    if (form) {
      form.dispatchEvent(new Event('submit', { bubbles: true }));
    }
  };

  return (
    <div className="lg:hidden p-4 border-t space-y-4 bg-background w-full">
      {/* Status indicator */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium">Current Status:</div>
        <div className="text-sm font-medium flex items-center gap-1">
          <span
            className={`inline-block w-2 h-2 rounded-full ${data.status === 'published' ? 'bg-green-500' : data.status === 'draft' ? 'bg-yellow-500' : 'bg-gray-500'}`}
          />
          {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
        </div>
      </div>

      {/* Action buttons - First row */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            // Find the status dropdown button in the toolbar and click it
            const statusButton = document.querySelector('[data-status-dropdown-trigger]');
            if (statusButton && statusButton instanceof HTMLElement) {
              statusButton.click();
            }
          }}
          disabled={processing}
          className="flex-1 gap-1"
        >
          <ChevronDown className="h-4 w-4" />
          Change Status
        </Button>
      </div>

      {/* Action buttons - Second row */}
      <div className="flex gap-2">
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
          className="flex-1 gap-1"
        >
          <Eye className="h-4 w-4" />
          Preview
        </Button>

        <Button
          type="button"
          size="sm"
          onClick={handleSubmit}
          disabled={processing}
          className="flex-1 gap-1"
        >
          <Save className="h-4 w-4" />
          {data.status === 'draft' ? 'Save Draft' :
           data.status === 'published' ? (mode === 'create' ? 'Publish' : 'Update') :
           'Save as ' + data.status.charAt(0).toUpperCase() + data.status.slice(1)}
        </Button>
      </div>
    </div>
  );
}
