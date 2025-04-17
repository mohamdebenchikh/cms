import { usePageForm } from '.';
import { TextEditor } from '@/components/text-editor';
import { AlertCircle } from 'lucide-react';

export function PageFormContent() {
  const { data, setData, errors, processing } = usePageForm();

  return (
    <div className="mt-6">
      <TextEditor
        value={data.content}
        onChange={(value) => setData((prev) => ({ ...prev, content: value }))}
        variant="toolbar"
        placeholder="Start writing your page content here..."
        disabled={processing}
        errors={errors}
        fullscreenEnabled={true}
      />
      {errors.content && (
        <p className="text-destructive text-sm flex items-center gap-1 mt-2">
          <AlertCircle className="h-3 w-3" /> {errors.content}
        </p>
      )}
    </div>
  );
}
