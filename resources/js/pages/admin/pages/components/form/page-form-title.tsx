import { usePageForm, generateSlug } from '.';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';

export function PageFormTitle() {
  const { data, setData, errors, processing } = usePageForm();

  return (
    <div className="mb-6 max-w-full">
      <Input
        value={data.title}
        onChange={(e) => {
          const newTitle = e.target.value;
          setData((prev) => ({
            ...prev,
            title: newTitle,
            // Only auto-generate slug if it's empty or matches a slugified version of the previous title
            slug:
              prev.slug === '' ||
              prev.slug === generateSlug(prev.title)
                ? generateSlug(newTitle)
                : prev.slug,
          }));
        }}
        onBlur={() => {
          if (!data.slug && data.title) {
            setData((prev) => ({
              ...prev,
              slug: generateSlug(data.title)
            }));
          }
        }}
        disabled={processing}
        placeholder="Page title"
        className={`w-full text-xl md:text-2xl font-medium py-4 md:py-6 px-3 md:px-4 ${errors.title ? "border-destructive" : ""}`}
      />
      {errors.title && (
        <p className="text-destructive text-sm flex items-center gap-1 mt-2">
          <AlertCircle className="h-3 w-3" /> {errors.title}
        </p>
      )}
    </div>
  );
}
