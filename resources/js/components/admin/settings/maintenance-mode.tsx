import { useForm } from '@inertiajs/react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface MaintenanceModeProps {
  maintenanceMode: boolean;
  maintenanceMessage: string;
}

export default function MaintenanceMode({ maintenanceMode, maintenanceMessage }: MaintenanceModeProps) {
  const { data, setData, post, processing } = useForm({
    settings: {
      maintenance_mode: maintenanceMode,
      maintenance_message: maintenanceMessage,
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    post(route('admin.settings.update-group', 'advanced'), {
      onSuccess: () => {
        toast.success('Maintenance settings updated successfully');
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Maintenance Mode</CardTitle>
        <CardDescription>
          When enabled, visitors will see a maintenance page instead of your website.
          Administrators can still access the site.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="maintenance-mode"
              checked={data.settings.maintenance_mode}
              onCheckedChange={(checked) => 
                setData('settings', { ...data.settings, maintenance_mode: checked })
              }
            />
            <Label htmlFor="maintenance-mode">
              {data.settings.maintenance_mode ? 'Enabled' : 'Disabled'}
            </Label>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maintenance-message">Maintenance Message</Label>
            <Textarea
              id="maintenance-message"
              value={data.settings.maintenance_message}
              onChange={(e) => 
                setData('settings', { ...data.settings, maintenance_message: e.target.value })
              }
              rows={4}
              placeholder="Enter the message to display during maintenance"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={processing}>
            Save Changes
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
