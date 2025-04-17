import { TextEditor } from "@/components/text-editor";
import { AlertCircle } from "lucide-react";
import { usePostForm } from "./post-form-context";

export function PostFormContent() {
  const { form, errors } = usePostForm();
  const { data, setData, processing } = form;

  return (
    <div className="w-full">
      <TextEditor
        value={data.content}
        onChange={(value) => setData('content', value)}
        variant="toolbar"
        placeholder="Start writing your post content here..."
        disabled={processing}
        errors={errors}
        fullscreenEnabled={true}
        className="min-h-[300px] sm:min-h-[400px] md:min-h-[500px] w-full"
      />
      {errors.content && (
        <p className="text-destructive text-sm flex items-center gap-1 mt-2">
          <AlertCircle className="h-3 w-3" /> {errors.content}
        </p>
      )}
    </div>
  );
}
