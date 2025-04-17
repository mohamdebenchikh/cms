import React from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  ShieldQuestion, 
  User, 
  FileText, 
  Settings, 
  Image, 
  Tag, 
  Folder 
} from 'lucide-react';

/**
 * Get an icon component for a resource
 */
export const getResourceIcon = (resource: string) => {
  switch (resource) {
    case 'users':
      return <User className="h-4 w-4" />;
    case 'roles':
      return <ShieldCheck className="h-4 w-4" />;
    case 'posts':
      return <FileText className="h-4 w-4" />;
    case 'pages':
      return <FileText className="h-4 w-4" />;
    case 'categories':
      return <Folder className="h-4 w-4" />;
    case 'tags':
      return <Tag className="h-4 w-4" />;
    case 'images':
      return <Image className="h-4 w-4" />;
    case 'settings':
      return <Settings className="h-4 w-4" />;
    default:
      return <ShieldQuestion className="h-4 w-4" />;
  }
};

/**
 * Get an icon component for a permission action
 */
export const getActionIcon = (action: string) => {
  switch (action) {
    case 'view':
      return <ShieldCheck className="h-3 w-3 text-blue-500" />;
    case 'create':
      return <ShieldCheck className="h-3 w-3 text-green-500" />;
    case 'edit':
    case 'update':
      return <ShieldCheck className="h-3 w-3 text-amber-500" />;
    case 'delete':
      return <ShieldAlert className="h-3 w-3 text-red-500" />;
    default:
      return <ShieldQuestion className="h-3 w-3" />;
  }
};
