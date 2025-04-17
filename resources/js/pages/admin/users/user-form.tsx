import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Role } from '@/types';
import { UserFormData, UserFormProps } from './types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle2, KeyRound, User as UserIcon, UserCog, FileText } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AvatarUpload } from './components/avatar-upload';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';

// Helper function to get user initials for avatar
const getUserInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

const UserForm: React.FC<UserFormProps> = ({ user, roles, mode, onSubmit }) => {
  const isEditMode = mode === 'edit';

  const { data, setData, errors, processing } = useForm<Record<string, any>>({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    password_confirmation: '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
    roles: user?.roles?.map((role: Role) => role.name) || [],
  });

  // Update form data when user prop changes
  useEffect(() => {
    if (user) {
      setData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        password_confirmation: '',
        bio: user.bio || '',
        avatar: user.avatar || '',
        roles: user.roles?.map((role: Role) => role.name) || [],
      });
    }
  }, [user, setData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(data as UserFormData);
  };

  const toggleRole = (roleName: string) => {
    const roleIndex = data.roles.indexOf(roleName);
    if (roleIndex === -1) {
      setData('roles', [...data.roles, roleName]);
    } else {
      const updatedRoles = [...data.roles];
      updatedRoles.splice(roleIndex, 1);
      setData('roles', updatedRoles);
    }
  };

  const hasRole = (roleName: string): boolean => {
    return data.roles.includes(roleName);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Display form errors if any */}
      {Object.keys(errors).length > 0 && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please correct the errors in the form before submitting.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left side - User data (2 columns on large screens) */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-primary" />
                User Information
              </CardTitle>
              <CardDescription>
                Enter the basic information for this user
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Name and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-medium">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('name', e.target.value)}
                    placeholder="Enter user's full name"
                    required
                    autoFocus
                    aria-invalid={!!errors.name}
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && (
                    <p className="text-destructive text-sm flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('email', e.target.value)}
                    placeholder="Enter user's email address"
                    required
                    aria-invalid={!!errors.email}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-destructive text-sm flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Biography */}
              <div className="space-y-2">
                <Label htmlFor="bio" className="font-medium">Biography</Label>
                <Textarea
                  id="bio"
                  value={data.bio || ''}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('bio', e.target.value)}
                  placeholder="Enter user's biography"
                  className={errors.bio ? "border-destructive" : ""}
                  rows={4}
                />
                {errors.bio && (
                  <p className="text-destructive text-sm flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.bio}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  A short biography that will be displayed on the user's profile
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Password Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-primary" />
                Password
              </CardTitle>
              <CardDescription>
                {isEditMode ? 'Leave blank to keep current password' : 'Set a password for this user'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="password" className="font-medium">
                    {isEditMode ? 'New Password' : 'Password'}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={data.password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('password', e.target.value)}
                    placeholder={isEditMode ? "Enter new password" : "Enter password"}
                    required={!isEditMode}
                    autoComplete="new-password"
                    aria-invalid={!!errors.password}
                    className={errors.password ? "border-destructive" : ""}
                  />
                  {errors.password && (
                    <p className="text-destructive text-sm flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.password}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password_confirmation" className="font-medium">Confirm Password</Label>
                  <Input
                    id="password_confirmation"
                    type="password"
                    value={data.password_confirmation}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('password_confirmation', e.target.value)}
                    placeholder="Confirm password"
                    required={!isEditMode}
                    autoComplete="new-password"
                    aria-invalid={!!errors.password_confirmation}
                    className={errors.password_confirmation ? "border-destructive" : ""}
                  />
                  {errors.password_confirmation && (
                    <p className="text-destructive text-sm flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.password_confirmation}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right side - Avatar and Roles (1 column) */}
        <div className="space-y-6">
          {/* Avatar Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-primary" />
                Profile Picture
              </CardTitle>
              <CardDescription>
                Upload a profile picture for this user
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-6">
              <AvatarUpload
                initialAvatar={data.avatar}
                userName={data.name}
                onAvatarChange={(avatarUrl) => setData('avatar', avatarUrl)}
                error={errors.avatar}
              />
            </CardContent>
          </Card>

          {/* Roles Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCog className="h-5 w-5 text-primary" />
                User Roles
              </CardTitle>
              <CardDescription>
                Assign roles to control permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    className={cn(
                      "flex items-start space-x-3 rounded-lg border p-3 transition-all",
                      hasRole(role.name)
                        ? 'bg-primary/5 border-primary/20 shadow-sm'
                        : 'hover:border-primary/30 hover:bg-muted/50'
                    )}
                  >
                    <Checkbox
                      id={`role-${role.id}`}
                      checked={hasRole(role.name)}
                      onCheckedChange={() => toggleRole(role.name)}
                      className="mt-1"
                    />
                    <div>
                      <Label
                        htmlFor={`role-${role.id}`}
                        className="font-medium cursor-pointer"
                      >
                        {role.name}
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        {role.name === 'admin' ? 'Full access to all features' :
                         role.name === 'editor' ? 'Can edit content only' :
                         role.name === 'viewer' ? 'Read-only access' :
                         'Custom permissions'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {errors.roles && (
                <p className="text-destructive text-sm mt-4 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.roles}
                </p>
              )}
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-6">
              <Button
                disabled={processing}
                type="submit"
                size="lg"
                className="flex items-center gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                {isEditMode ? 'Update User' : 'Create User'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </form>
  );
};

export default UserForm;
