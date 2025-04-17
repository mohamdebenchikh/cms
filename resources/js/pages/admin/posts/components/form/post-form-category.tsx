import { AlertCircle, Folder } from "lucide-react";
import { usePostForm } from "./post-form-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function PostFormCategory() {
  const { form, categories, errors } = usePostForm();
  const { data, setData, processing } = form;

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        <Label htmlFor="category" className="font-medium flex items-center gap-1">
          <Folder className="h-4 w-4" /> Category
        </Label>
        <Select
          value={data.category_id || 'null'}
          onValueChange={(value) => {
            setData({
              ...data,
              category_id: value === 'null' ? null : value,
              category_ids: value && value !== 'null' ? [value] : []
            });
          }}
          disabled={processing}

        >
          <SelectTrigger
            id="category"
            className={cn([errors.category_id ? "border-destructive" : "",'w-full'])}
          >
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="null">(No category)</SelectItem>
            {/* Main categories */}
            {categories
              .filter(category => category.is_main || (!category.parent_id && !category.children?.length))
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map(category => (
                <SelectItem
                  key={category.id}
                  value={category.id.toString()}
                  className="font-medium"
                >
                  {category.name}
                </SelectItem>
              ))}

            {/* Categories with subcategories */}
            {categories
              .filter(category => !category.is_main && !category.parent_id && category.children?.length)
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map(category => (
                <React.Fragment key={category.id}>
                  <SelectItem
                    value={category.id.toString()}
                    className="font-medium"
                  >
                    {category.name}
                  </SelectItem>

                  {/* Subcategories */}
                  {category.children && category.children
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map(subcategory => (
                      <SelectItem
                        key={subcategory.id}
                        value={subcategory.id.toString()}
                        className="pl-6 text-muted-foreground"
                      >
                        ↳ {subcategory.name}
                      </SelectItem>
                    ))
                  }
                </React.Fragment>
              ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">Select a category for this post</p>
        {errors.category_id && (
          <p className="text-destructive text-sm flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> {errors.category_id}
          </p>
        )}
      </div>
    </div>
  );
}
