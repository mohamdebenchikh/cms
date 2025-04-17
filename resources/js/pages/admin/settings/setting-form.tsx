import React, { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { SettingFormProps, SettingFormData } from './types';
import { TextEditor } from '@/components/text-editor';

const SettingForm: React.FC<SettingFormProps> = ({ setting, groups, mode, onSubmit }) => {
  const isEditMode = mode === 'edit';
  const [optionsText, setOptionsText] = useState<string>('');

  const { data, setData, errors, processing } = useForm<Record<string, any>>({
    key: setting?.key || '',
    value: setting?.value || '',
    display_name: setting?.display_name || '',
    type: setting?.type || 'text',
    options: setting?.options || null,
    group: setting?.group || 'general',
    description: setting?.description || '',
    is_public: setting?.is_public || false,
    order: setting?.order || 0,
  });

  // Update form data when setting prop changes
  useEffect(() => {
    if (setting) {
      setData({
        key: setting.key || '',
        value: setting.value || '',
        display_name: setting.display_name || '',
        type: setting.type || 'text',
        options: setting.options || null,
        group: setting.group || 'general',
        description: setting.description || '',
        is_public: setting.is_public || false,
        order: setting.order || 0,
      });

      // Format options for textarea
      if (setting.options) {
        const formattedOptions = Object.entries(setting.options)
          .map(([key, value]) => `${key}:${value}`)
          .join('\n');
        setOptionsText(formattedOptions);
      }
    }
  }, [setting, setData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Parse options from text
    if (data.type === 'select' && optionsText) {
      const options: Record<string, string> = {};
      optionsText.split('\n').forEach(line => {
        const [key, value] = line.split(':');
        if (key && value) {
          options[key.trim()] = value.trim();
        }
      });
      data.options = options;
    }

    onSubmit(data as SettingFormData);
  };

  const handleTypeChange = (type: string) => {
    setData('type', type);

    // Reset value based on type
    if (type === 'boolean') {
      setData('value', '0');
    } else if (type === 'number') {
      setData('value', '0');
    } else {
      setData('value', '');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? 'Edit Setting' : 'Create Setting'}</CardTitle>
          <CardDescription>
            {isEditMode
              ? 'Update the setting details below.'
              : 'Fill in the details to create a new setting.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Key */}
          <div className="space-y-2">
            <Label htmlFor="key" className="text-base font-medium">Key</Label>
            <Input
              id="key"
              value={data.key}
              onChange={e => setData('key', e.target.value)}
              disabled={processing || isEditMode}
              placeholder="site_name"
              className={errors.key ? "border-destructive" : ""}
            />
            {errors.key && (
              <p className="text-destructive text-sm flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.key}
              </p>
            )}
            <p className="text-muted-foreground text-sm">
              The unique identifier for this setting. Use snake_case.
            </p>
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="display_name" className="text-base font-medium">Display Name</Label>
            <Input
              id="display_name"
              value={data.display_name}
              onChange={e => setData('display_name', e.target.value)}
              disabled={processing}
              placeholder="Site Name"
              className={errors.display_name ? "border-destructive" : ""}
            />
            {errors.display_name && (
              <p className="text-destructive text-sm flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.display_name}
              </p>
            )}
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type" className="text-base font-medium">Type</Label>
            <Select
              value={data.type}
              onValueChange={handleTypeChange}
              disabled={processing || isEditMode}
            >
              <SelectTrigger id="type" className={errors.type ? "border-destructive" : ""}>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="textarea">Textarea</SelectItem>
                <SelectItem value="richtext">Rich Text</SelectItem>
                <SelectItem value="boolean">Boolean</SelectItem>
                <SelectItem value="select">Select</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="file">File</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-destructive text-sm flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.type}
              </p>
            )}
          </div>

          {/* Value */}
          <div className="space-y-2">
            <Label htmlFor="value" className="text-base font-medium">Value</Label>
            {data.type === 'textarea' ? (
              <Textarea
                id="value"
                value={data.value || ''}
                onChange={e => setData('value', e.target.value)}
                disabled={processing}
                placeholder="Enter value"
                className={errors.value ? "border-destructive" : ""}
                rows={4}
              />
            ) : data.type === 'richtext' ? (
              <TextEditor
                value={data.value || ''}
                onChange={(value) => setData('value', value)}
                variant="bubble"
                placeholder="Enter rich text content..."
                disabled={processing}
                className={errors.value ? "border-destructive" : ""}
              />
            ) : data.type === 'boolean' ? (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="value"
                  checked={data.value === '1'}
                  onCheckedChange={checked => setData('value', checked ? '1' : '0')}
                  disabled={processing}
                />
                <label
                  htmlFor="value"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Enabled
                </label>
              </div>
            ) : (
              <Input
                id="value"
                type={data.type === 'number' ? 'number' : 'text'}
                value={data.value || ''}
                onChange={e => setData('value', e.target.value)}
                disabled={processing}
                placeholder="Enter value"
                className={errors.value ? "border-destructive" : ""}
              />
            )}
            {errors.value && (
              <p className="text-destructive text-sm flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.value}
              </p>
            )}
          </div>

          {/* Options (for select type) */}
          {data.type === 'select' && (
            <div className="space-y-2">
              <Label htmlFor="options" className="text-base font-medium">Options</Label>
              <Textarea
                id="options"
                value={optionsText}
                onChange={e => setOptionsText(e.target.value)}
                disabled={processing}
                placeholder="key:value&#10;another_key:Another Value"
                className={errors.options ? "border-destructive" : ""}
                rows={4}
              />
              {errors.options && (
                <p className="text-destructive text-sm flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.options}
                </p>
              )}
              <p className="text-muted-foreground text-sm">
                Enter one option per line in the format key:value
              </p>
            </div>
          )}

          {/* Group */}
          <div className="space-y-2">
            <Label htmlFor="group" className="text-base font-medium">Group</Label>
            <Select
              value={data.group}
              onValueChange={value => setData('group', value)}
              disabled={processing}
            >
              <SelectTrigger id="group" className={errors.group ? "border-destructive" : ""}>
                <SelectValue placeholder="Select group" />
              </SelectTrigger>
              <SelectContent>
                {groups.map(group => (
                  <SelectItem key={group} value={group}>{group}</SelectItem>
                ))}
                <SelectItem value="new">+ Add New Group</SelectItem>
              </SelectContent>
            </Select>
            {data.group === 'new' && (
              <Input
                value={data.newGroup || ''}
                onChange={e => setData('newGroup', e.target.value)}
                disabled={processing}
                placeholder="Enter new group name"
                className="mt-2"
              />
            )}
            {errors.group && (
              <p className="text-destructive text-sm flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.group}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-medium">Description</Label>
            <Textarea
              id="description"
              value={data.description || ''}
              onChange={e => setData('description', e.target.value)}
              disabled={processing}
              placeholder="Enter description"
              className={errors.description ? "border-destructive" : ""}
              rows={2}
            />
            {errors.description && (
              <p className="text-destructive text-sm flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.description}
              </p>
            )}
          </div>

          {/* Is Public */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_public"
                checked={data.is_public}
                onCheckedChange={checked => setData('is_public', !!checked)}
                disabled={processing}
              />
              <Label
                htmlFor="is_public"
                className="text-sm font-medium leading-none"
              >
                Public
              </Label>
            </div>
            <p className="text-muted-foreground text-sm">
              If checked, this setting will be available to the public API.
            </p>
            {errors.is_public && (
              <p className="text-destructive text-sm flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.is_public}
              </p>
            )}
          </div>

          {/* Order */}
          <div className="space-y-2">
            <Label htmlFor="order" className="text-base font-medium">Order</Label>
            <Input
              id="order"
              type="number"
              value={data.order}
              onChange={e => setData('order', parseInt(e.target.value))}
              disabled={processing}
              placeholder="0"
              className={errors.order ? "border-destructive" : ""}
            />
            {errors.order && (
              <p className="text-destructive text-sm flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.order}
              </p>
            )}
            <p className="text-muted-foreground text-sm">
              The order in which this setting appears in the group.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            disabled={processing}
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={processing}>
            {isEditMode ? 'Update Setting' : 'Create Setting'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default SettingForm;
