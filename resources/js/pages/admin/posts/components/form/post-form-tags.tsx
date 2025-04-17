import { AlertCircle } from "lucide-react";
import { usePostForm } from "./post-form-context";
import { TagInput } from "@/components/tag-input";
import { useState } from "react";

export function PostFormTags() {
  const { form, tags: initialTags, errors } = usePostForm();
  const { data, setData, processing } = form;
  const [availableTags, setAvailableTags] = useState(initialTags);

  // Handle new tag creation
  const handleTagCreated = (newTag: { id: number; name: string }) => {
    // Add the new tag to the available tags list
    setAvailableTags([...availableTags, newTag]);
  };

  return (
    <div className="space-y-2">
      <TagInput
        options={availableTags.map(tag => ({ label: tag.name, value: tag.id.toString() }))}
        selected={data.tags.map(id => id.toString())}
        onChange={(values) => setData('tags', values.map(v => parseInt(v)))}
        placeholder="Select or create tags"
        disabled={processing}
        error={errors.tags}
        allowCreation={true}
        createTagEndpoint={route('admin.tags.store')}
        onTagCreated={handleTagCreated}
      />
      <p className="text-xs text-muted-foreground">Select existing tags or create new ones</p>
    </div>
  );
}
