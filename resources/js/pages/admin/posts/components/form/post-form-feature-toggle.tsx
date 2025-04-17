import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertCircle, Star } from "lucide-react";
import { usePostForm } from "./post-form-context";

export function PostFormFeatureToggle() {
  const { form, errors } = usePostForm();
  const { data, setData, processing } = form;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between space-x-2">
        <div className="flex items-center space-x-2">
          <Star className="h-4 w-4 text-muted-foreground" />
          <Label htmlFor="is-featured" className="font-medium">Featured Post</Label>
        </div>
        <Switch
          id="is-featured"
          checked={data.is_featured}
          onCheckedChange={(checked) => setData('is_featured', checked)}
          disabled={processing}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Featured posts will be highlighted on the homepage and may appear in special sections.
      </p>
      {errors.is_featured && (
        <p className="text-destructive text-sm flex items-center gap-1 mt-2">
          <AlertCircle className="h-3 w-3" /> {errors.is_featured}
        </p>
      )}
    </div>
  );
}
