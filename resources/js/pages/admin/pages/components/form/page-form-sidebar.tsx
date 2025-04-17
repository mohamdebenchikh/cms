import { usePageForm, generateSlug } from '.';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle, Link2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function PageFormSidebar() {
  const { data, setData, errors, processing } = usePageForm();

  // Function to generate slug from title
  const handleGenerateSlug = () => {
    if (!data.title) return;
    setData((prev) => ({ ...prev, slug: generateSlug(data.title) }));
  };

  return (
    <div className="w-[300px] border-l hidden md:block overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="text-sm font-medium">Page Settings</h3>
        <p className="text-xs text-muted-foreground mt-1">Configure page properties</p>
      </div>

      <ScrollArea className="h-[calc(100vh-120px)]">
        <Accordion type="multiple" defaultValue={['url']} className="w-full">
          {/* URL Slug */}
          <AccordionItem value="url" className="border-b">
            <AccordionTrigger className="px-4 py-3 text-sm">Permalink</AccordionTrigger>
            <AccordionContent className="px-4 pb-3 pt-0">
              <div className="space-y-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                    <Link2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                    <Input
                      id="slug"
                      value={data.slug}
                      onChange={e => setData((prev) => ({ ...prev, slug: e.target.value }))}
                      disabled={processing}
                      placeholder="enter-slug-here"
                      className={`pl-8 flex-1 ${errors.slug ? "border-destructive" : ""}`}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateSlug}
                      disabled={!data.title || processing}
                      className="sm:ml-2 h-9 text-xs w-full sm:w-auto"
                    >
                      Generate from Title
                    </Button>
                  </div>
                </div>

                {/* Error message */}
                {errors.slug && (
                  <p className="text-destructive text-sm flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.slug}
                  </p>
                )}

                {/* URL preview */}
                <p className="text-xs text-muted-foreground mt-2">
                  URL: {window.location.origin}/pages/{data.slug || 'page-slug'}
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>
    </div>
  );
}
