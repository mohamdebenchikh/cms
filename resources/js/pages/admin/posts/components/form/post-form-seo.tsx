import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Globe, Search, Tag } from "lucide-react";
import { usePostForm } from "./post-form-context";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export function PostFormSeo() {
  const { form, errors } = usePostForm();
  const { data, setData, processing } = form;

  return (
    <div className="space-y-6">
      {/* SEO Title */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <Label htmlFor="seo_title" className="font-medium">
            SEO Title
          </Label>
        </div>
        <Input
          id="seo_title"
          value={data.seo_title}
          onChange={e => setData('seo_title', e.target.value)}
          disabled={processing}
          placeholder="Enter SEO title (recommended: 50-60 characters)"
          className={errors.seo_title ? "border-destructive" : ""}
        />
        {errors.seo_title && (
          <p className="text-destructive text-sm flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> {errors.seo_title}
          </p>
        )}
        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            Appears in search engine results and browser tabs
          </p>
          <p className={`text-xs ${data.seo_title.length > 60 ? 'text-destructive' : 'text-muted-foreground'}`}>
            {data.seo_title.length}/60 characters
          </p>
        </div>
      </div>

      {/* SEO Keywords */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <Label htmlFor="seo_keywords" className="font-medium">
            SEO Keywords
          </Label>
        </div>
        <Input
          id="seo_keywords"
          value={data.seo_keywords}
          onChange={e => setData('seo_keywords', e.target.value)}
          disabled={processing}
          placeholder="Enter keywords separated by commas"
          className={errors.seo_keywords ? "border-destructive" : ""}
        />
        {errors.seo_keywords && (
          <p className="text-destructive text-sm flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> {errors.seo_keywords}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Separate keywords with commas (e.g., blog, cms, laravel)
        </p>
      </div>

      {/* SEO Description */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Label htmlFor="seo_description" className="font-medium">
            Meta Description
          </Label>
        </div>
        <Textarea
          id="seo_description"
          value={data.seo_description}
          onChange={e => setData('seo_description', e.target.value)}
          disabled={processing}
          placeholder="Enter meta description (recommended: 150-160 characters)"
          className={`min-h-[100px] ${errors.seo_description ? "border-destructive" : ""}`}
        />
        {errors.seo_description && (
          <p className="text-destructive text-sm flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> {errors.seo_description}
          </p>
        )}
        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            Appears as the description in search engine results
          </p>
          <p className={`text-xs ${data.seo_description.length > 160 ? 'text-destructive' : 'text-muted-foreground'}`}>
            {data.seo_description.length}/160 characters
          </p>
        </div>
      </div>

      {/* SEO Preview */}
      <Card className="mt-4 border-dashed">
        <CardContent className="pt-4">
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-primary">Search Preview</h4>
            <div className="p-3 bg-muted/50 rounded-md">
              <div className="text-sm text-blue-600 font-medium truncate">
                {data.seo_title || data.title || 'Page Title'}
              </div>
              <div className="text-xs text-green-700 truncate">
                {window.location.origin}/posts/{data.slug || 'example-post-slug'}
              </div>
              <div className="text-xs text-muted-foreground line-clamp-2 mt-1">
                {data.seo_description || data.excerpt || 'No description provided. Add a meta description to improve search engine results.'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
