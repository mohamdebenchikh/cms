import { useForm } from '@inertiajs/react';
import { Category, Post, Tag } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { UnsavedChangesWarning } from '@/components/unsaved-changes-warning';
import {
  PostFormProvider,
  PostFormToolbar,
  PostFormTitle,
  PostFormContent,
  PostFormFeaturedImage,
  PostFormPermalink,
  PostFormCategory,
  PostFormTags,
  PostFormExcerpt,
  PostFormFeatureToggle,
  PostFormSeo,
  PostFormData,
  PostFormUnsavedChangesWarning
} from './components/form';

interface PostFormProps {
  post?: Post;
  categories: Category[];
  tags: Tag[];
  mode: 'create' | 'edit';
  onSubmit: (data: PostFormData) => void;
  onDelete?: (id: number) => void;
  errors?: Record<string, string>;
}

export default function PostForm({
  post,
  categories,
  tags,
  mode,
  onSubmit,
  onDelete,
  errors: serverErrors = {}
}: PostFormProps) {
  // Get a reference to the resetDirtyState function from the parent component
  const resetDirtyStateRef = (window as any).resetDirtyStateRef;
  const form = useForm<PostFormData>({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    category_id: post?.category_id?.toString() || 'none',
    category_ids: post?.category_id ? [post.category_id.toString()] : [],
    tags: post?.tags?.map(tag => tag.id) || [],
    status: post?.status || 'draft',
    featured_image: post?.featured_image || null,
    is_featured: post?.is_featured || false,
    seo_title: post?.seo?.title || post?.title || '',
    seo_keywords: post?.seo?.keywords || '',
    seo_description: post?.seo?.description || post?.excerpt || '',
  });

  // Create a function to handle form submission from the unsaved changes dialog
  const handleSaveChanges = () => {
    // Prepare the form data
    const formData = { ...form.data };

    // Ensure category_id is properly formatted
    if (formData.category_id === 'none') {
      formData.category_id = ''; // Convert 'none' to empty string for the backend
    }

    // Ensure category_ids is consistent with category_id for backward compatibility
    formData.category_ids = formData.category_id ? [formData.category_id] : [];

    // Submit the form data
    onSubmit(formData as PostFormData);
  };

  // Function to expose the resetDirtyState function to the parent component
  const exposeResetDirtyState = (resetFn: () => void) => {
    if (resetDirtyStateRef) {
      resetDirtyStateRef.current = resetFn;
    }
  };

  return (
    <PostFormProvider
      form={form}
      post={post}
      categories={categories}
      tags={tags}
      mode={mode}
      errors={serverErrors}
      onSubmit={onSubmit}
      onDelete={onDelete}
    >
      {/* This component will render the unsaved changes dialog when needed */}
      <PostFormUnsavedChangesWarning
        onSave={handleSaveChanges}
        onExpose={exposeResetDirtyState}
      />

      <form onSubmit={(e) => e.preventDefault()} >
        {/* Top Toolbar */}
        <PostFormToolbar />



        {/* Main Content Area */}
        <div className="flex-1 overflow-auto p-2 sm:p-4 md:p-6">
          <div className="max-w-7xl mx-auto w-full space-y-6">
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>

              {/* Title and Content */}
              <div className='col-span-2 space-y-4'>
                <Card className="shadow-sm">
                  <CardContent className="pt-6 space-y-6">
                    {/* Title Input */}
                    <PostFormTitle />

                    {/* Content Editor */}
                    <PostFormContent />
                  </CardContent>
                </Card>

                {/* SEO Card */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl">SEO Metadata</CardTitle>
                    <CardDescription>
                      Optimize your post for search engines with custom title, keywords, and description.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PostFormSeo />
                  </CardContent>
                </Card>


              </div>
              <div>
                {/* Post Settings */}
                <Accordion type="multiple" defaultValue={['featured-image', 'permalink', 'category', 'tags', 'excerpt', 'feature-toggle']} className="w-full">
                  {/* Featured Image */}
                  <AccordionItem value="featured-image" className="border rounded-lg mb-3 shadow-sm">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline">
                      <span className="text-base font-medium">Featured Image</span>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <PostFormFeaturedImage />
                    </AccordionContent>
                  </AccordionItem>

                  {/* Permalink */}
                  <AccordionItem value="permalink" className="border rounded-lg mb-3 shadow-sm">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline">
                      <span className="text-base font-medium">Permalink</span>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <PostFormPermalink />
                    </AccordionContent>
                  </AccordionItem>

                  {/* Category */}
                  <AccordionItem value="category" className="border rounded-lg mb-3 shadow-sm">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline">
                      <span className="text-base font-medium">Category</span>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <PostFormCategory />
                    </AccordionContent>
                  </AccordionItem>

                  {/* Tags */}
                  <AccordionItem value="tags" className="border rounded-lg mb-3 shadow-sm">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline">
                      <span className="text-base font-medium">Tags</span>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <PostFormTags />
                    </AccordionContent>
                  </AccordionItem>

                  {/* Excerpt */}
                  <AccordionItem value="excerpt" className="border rounded-lg mb-3 shadow-sm">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline">
                      <span className="text-base font-medium">Excerpt</span>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <PostFormExcerpt />
                    </AccordionContent>
                  </AccordionItem>

                  {/* Feature Toggle */}
                  <AccordionItem value="feature-toggle" className="border rounded-lg mb-3 shadow-sm">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline">
                      <span className="text-base font-medium">Featured Post</span>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <PostFormFeatureToggle />
                    </AccordionContent>
                  </AccordionItem>

                </Accordion>
              </div>
            </div>
          </div>
        </div>

      </form>
    </PostFormProvider>
  );
}
