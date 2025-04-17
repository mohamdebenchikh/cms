export interface Setting {
    id: number;
    key: string;
    value: string | null;
    display_name: string;
    type: 'text' | 'textarea' | 'boolean' | 'select' | 'number' | 'file' | 'array' | 'json' | 'richtext';
    options: Record<string, string> | null;
    group: string;
    description: string | null;
    is_public: boolean;
    order: number;
    created_at: string;
    updated_at: string;
}

export interface SettingFormData {
    key: string;
    value: string | null;
    display_name: string;
    type: 'text' | 'textarea' | 'boolean' | 'select' | 'number' | 'file' | 'array' | 'json' | 'richtext';
    options: Record<string, string> | null;
    group: string;
    description: string | null;
    is_public: boolean;
    order: number;
}

export interface SettingFormProps {
    setting?: Setting;
    groups: string[];
    mode: 'create' | 'edit';
    onSubmit: (data: SettingFormData) => void;
}

export interface GroupSettingsFormData {
    settings: Record<string, string | null>;
}
