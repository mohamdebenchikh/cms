import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
import { usePostForm } from "./post-form-context";

export function PostFormTitle() {
  const { form, errors } = usePostForm();
  const { data, setData, processing } = form;

  return (
    <div>
      <div className="relative">
        <Input
          value={data.title}
          onChange={e => setData('title', e.target.value)}
          disabled={processing}
          placeholder="Post title"
          className={`w-full text-lg sm:text-xl md:text-2xl font-medium py-3 sm:py-4 md:py-6 px-2 sm:px-3 md:px-4 border-0 shadow-none focus-visible:ring-0 ${errors.title ? "border-destructive" : ""}`}
          aria-label="Post title"
        />
      </div>
      {errors.title && (
        <p className="text-destructive text-sm flex items-center gap-1 mt-2">
          <AlertCircle className="h-3 w-3" /> {errors.title}
        </p>
      )}
    </div>
  );
}
