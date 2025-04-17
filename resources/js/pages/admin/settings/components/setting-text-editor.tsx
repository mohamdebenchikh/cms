import React from 'react';
import { TextEditor } from '@/components/text-editor';
import { AlertCircle } from 'lucide-react';

interface SettingTextEditorProps {
  value: string | null;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  settingKey: string;
  placeholder?: string;
}

export function SettingTextEditor({
  value,
  onChange,
  disabled = false,
  error,
  settingKey,
  placeholder
}: SettingTextEditorProps) {
  // Determine if this is for site description or author bio
  const isSiteDescription = settingKey === 'site_description';
  const isAuthorBio = settingKey === 'author_bio';

  // Set appropriate placeholder based on the setting key
  const editorPlaceholder = placeholder ||
    (isSiteDescription
      ? 'Enter your site description...'
      : isAuthorBio
        ? 'Enter author bio information...'
        : 'Enter content...');

  return (
    <div className="space-y-2">
      <TextEditor
        value={value || ''}
        onChange={onChange}
        variant="bubble"
        placeholder={editorPlaceholder}
        disabled={disabled}
        className={error ? "border-destructive" : ""}
      />
      {error && (
        <p className="text-destructive text-sm flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> {error}
        </p>
      )}
    </div>
  );
}
