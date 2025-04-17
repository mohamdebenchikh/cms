import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";
import { usePostForm } from "./post-form-context";

export function PostFormExcerpt() {
  const { form, errors } = usePostForm();
  const { data, setData, processing } = form;

  return (
    <div className="space-y-2">
      <Textarea
        id="excerpt"
        value={data.excerpt}
        onChange={e => setData('excerpt', e.target.value)}
        disabled={processing}
        placeholder="Write a brief summary of your post..."
        className={`min-h-[100px] ${errors.excerpt ? "border-destructive" : ""}`}
      />
      <p className="text-xs text-muted-foreground">Appears in search results and post listings.</p>
      {errors.excerpt && (
        <p className="text-destructive text-sm flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> {errors.excerpt}
        </p>
      )}
    </div>
  );
}
