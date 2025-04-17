import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getResourceIcon } from '../utils';

interface ResourceSidebarProps {
  resources: string[];
  activeResource: string | null;
  setActiveResource: (resource: string) => void;
  permissionCounts: Record<string, { total: number; selected: number }>;
  resourceFilter: string;
  setResourceFilter: (filter: string) => void;
}

export function ResourceSidebar({
  resources,
  activeResource,
  setActiveResource,
  permissionCounts,
  resourceFilter,
  setResourceFilter
}: ResourceSidebarProps) {
  const filteredResources = resources.filter(resource =>
    resource.toLowerCase().includes(resourceFilter.toLowerCase())
  );

  return (
    <div className="md:w-64 space-y-1 md:border-r md:pr-4 mb-4 md:mb-0">
      <h3 className="font-medium text-sm text-muted-foreground mb-2 px-3">RESOURCES</h3>

      <div className="mb-2">
        <Input
          type="text"
          placeholder="Filter resources..."
          value={resourceFilter}
          onChange={(e) => setResourceFilter(e.target.value)}
          className="h-8 text-sm"
        />
      </div>

      {filteredResources.map(resource => {
        const count = permissionCounts[resource];
        const isActive = activeResource === resource;

        return (
          <button
            key={resource}
            type="button"
            onClick={() => setActiveResource(resource)}
            className={`w-full text-left px-3 py-1.5 text-sm rounded-md flex items-center justify-between group hover:bg-muted transition-colors ${isActive ? 'bg-muted' : ''}`}
          >
            <span className="flex items-center gap-2 capitalize">
              {getResourceIcon(resource)}
              {resource}
            </span>
            <Badge
              variant={count.selected === count.total ? "default" : "outline"}
              className="text-xs"
            >
              {count.selected}/{count.total}
            </Badge>
          </button>
        );
      })}

      {resourceFilter && filteredResources.length === 0 && (
        <div className="px-3 py-2 text-sm text-muted-foreground text-center">
          No resources found
        </div>
      )}
    </div>
  );
}
