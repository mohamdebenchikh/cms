import React from 'react';
import { useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { GroupHeaderActions } from './components/group-header-actions';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Setting, GroupSettingsFormData } from './types';
import { SettingFileUpload } from './components/setting-file-upload';
import { SettingTextEditor } from './components/setting-text-editor';
import { SettingActions } from './components/setting-actions';

interface GroupSettingsFormProps {
  settings: Setting[];
  currentGroup: string;
  onSubmit: (data: GroupSettingsFormData) => void;
}

const GroupSettingsForm: React.FC<GroupSettingsFormProps> = ({
  settings,
  currentGroup,
  onSubmit
}) => {
  const initialData: Record<string, any> = {
    settings: {}
  };

  // Initialize form data with current setting values
  settings.forEach(setting => {
    initialData.settings[setting.key] = setting.value;
  });

  const { data, setData, errors, processing } = useForm<Record<string, any>>(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(data as GroupSettingsFormData);
  };

  const updateSettingValue = (key: string, value: string | boolean) => {
    const newSettings = { ...data.settings };

    if (typeof value === 'boolean') {
      newSettings[key] = value ? '1' : '0';
    } else {
      newSettings[key] = value;
    }

    setData('settings', newSettings);
  };

  const renderSettingInput = (setting: Setting) => {
    const value = data.settings[setting.key];

    switch (setting.type) {
      case 'textarea':
        return (
          <Textarea
            id={setting.key}
            value={value || ''}
            onChange={e => updateSettingValue(setting.key, e.target.value)}
            disabled={processing}
            placeholder={`Enter ${setting.display_name.toLowerCase()}`}
            className={errors[`settings.${setting.key}`] ? "border-destructive" : ""}
            rows={4}
          />
        );
      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={setting.key}
              checked={value === '1'}
              onCheckedChange={checked => updateSettingValue(setting.key, !!checked)}
              disabled={processing}
            />
            <label
              htmlFor={setting.key}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Enabled
            </label>
          </div>
        );
      case 'select':
        return (
          <Select
            value={value || ''}
            onValueChange={value => updateSettingValue(setting.key, value)}
            disabled={processing}
          >
            <SelectTrigger id={setting.key} className={errors[`settings.${setting.key}`] ? "border-destructive" : ""}>
              <SelectValue placeholder={`Select ${setting.display_name.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {setting.options && Object.entries(setting.options).map(([optionKey, optionValue]) => (
                <SelectItem key={optionKey} value={optionKey}>{optionValue}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'number':
        return (
          <Input
            id={setting.key}
            type="number"
            value={value || ''}
            onChange={e => updateSettingValue(setting.key, e.target.value)}
            disabled={processing}
            placeholder={`Enter ${setting.display_name.toLowerCase()}`}
            className={errors[`settings.${setting.key}`] ? "border-destructive" : ""}
          />
        );
      case 'file':
        return (
          <SettingFileUpload
            settingKey={setting.key}
            value={value}
            onChange={value => updateSettingValue(setting.key, value)}
            disabled={processing}
            error={errors[`settings.${setting.key}`]}
          />
        );
      case 'richtext':
        return (
          <SettingTextEditor
            settingKey={setting.key}
            value={value}
            onChange={value => updateSettingValue(setting.key, value)}
            disabled={processing}
            error={errors[`settings.${setting.key}`]}
            placeholder={`Enter ${setting.display_name.toLowerCase()}`}
          />
        );
      default:
        return (
          <Input
            id={setting.key}
            value={value || ''}
            onChange={e => updateSettingValue(setting.key, e.target.value)}
            disabled={processing}
            placeholder={`Enter ${setting.display_name.toLowerCase()}`}
            className={errors[`settings.${setting.key}`] ? "border-destructive" : ""}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-md">
              <span className="text-primary font-semibold text-lg capitalize">{currentGroup}</span>
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">Settings</h2>
          </div>
          <GroupHeaderActions group={currentGroup} />
        </div>
        <p className="text-muted-foreground mb-6">
          Configure and manage your {currentGroup} settings below.
        </p>
      </div>

      <div className="space-y-6">
        {settings.map(setting => (
          <div key={setting.id} className="pb-6 border-b border-muted last:border-0 last:pb-0">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <Label htmlFor={setting.key} className="text-base font-medium">
                    {setting.display_name}
                  </Label>
                  {setting.description && (
                    <p className="text-muted-foreground text-sm">
                      {setting.description}
                    </p>
                  )}
                </div>
                <SettingActions setting={setting} />
              </div>
              <div className="pt-1">
                {renderSettingInput(setting)}
              </div>
              {errors[`settings.${setting.key}`] && (
                <p className="text-destructive text-sm flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors[`settings.${setting.key}`]}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-muted">
        <div className="flex justify-end">
          <Button type="submit" disabled={processing} className="px-6">
            Save Changes
          </Button>
        </div>
      </div>
    </form>
  );
};

export default GroupSettingsForm;
