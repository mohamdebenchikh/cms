import { usePageForm } from '.';
import { AlertCircle, ChevronDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function PageFormStatus() {
  const { data, setData, errors, processing } = usePageForm();

  return (
    <div className="space-y-2 mb-6">
      <div className="flex flex-col space-y-1.5">
        <label htmlFor="status" className="text-sm font-medium">
          Status
        </label>
        <Select
          value={data.status}
          onValueChange={(value) => setData((prev) => ({ ...prev, status: value }))}
          disabled={processing}
        >
          <SelectTrigger id="status" className={errors.status ? "border-destructive" : ""}>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-yellow-500" />
                Draft
              </div>
            </SelectItem>
            <SelectItem value="published">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                Published
              </div>
            </SelectItem>
            <SelectItem value="archived">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-gray-500" />
                Archived
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          {data.status === 'draft' ? 'Save as draft to continue editing later' :
           data.status === 'published' ? 'Make this page visible to the public' :
           'Archive this page to hide it from the public'}
        </p>
      </div>
      {errors.status && (
        <p className="text-destructive text-sm flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> {errors.status}
        </p>
      )}
    </div>
  );
}
