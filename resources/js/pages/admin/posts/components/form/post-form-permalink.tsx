import { SlugInput } from "@/components/slug-input";
import { usePostForm } from "./post-form-context";

export function PostFormPermalink() {
  const { form, errors } = usePostForm();
  const { data, setData, processing } = form;

  return (
    <div className="space-y-2">
      <SlugInput
        name="slug"
        value={data.slug}
        onChange={(value) => setData('slug', value)}
        sourceValue={data.title}
        disabled={processing}
        error={errors.slug}
        label="Permalink"
        helpText={`${window.location.origin}/posts/${data.slug || 'example-post-slug'}`}
        generateButtonText="Generate from title"
      />
    </div>
  );
}
