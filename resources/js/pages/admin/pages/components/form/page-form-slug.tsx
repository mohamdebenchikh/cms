import { usePageForm, generateSlug } from '.';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Link2 } from 'lucide-react';

export function PageFormSlug() {
  const { data, setData, errors, processing } = usePageForm();

  // Function to generate slug from title
  const handleGenerateSlug = () => {
    if (!data.title) return;
    setData((prev) => ({ ...prev, slug: generateSlug(data.title) }));
  };

  return (
    <div className="space-y-2 mb-6">
      <div className="flex flex-col space-y-1.5">
        <label htmlFor="slug" className="text-sm font-medium">
          Permalink
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
            <Link2 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Input
              id="slug"
              value={data.slug}
              onChange={e => setData((prev) => ({ ...prev, slug: e.target.value }))}
              disabled={processing}
              placeholder="enter-slug-here"
              className={`pl-8 flex-1 ${errors.slug ? "border-destructive" : ""}`}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGenerateSlug}
              disabled={!data.title || processing}
              className="sm:ml-2 h-9 text-xs w-full sm:w-auto"
            >
              Generate from Title
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {window.location.origin}/pages/{data.slug || 'example-page-slug'}
        </p>
      </div>
      {errors.slug && (
        <p className="text-destructive text-sm flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> {errors.slug}
        </p>
      )}
    </div>
  );
}
