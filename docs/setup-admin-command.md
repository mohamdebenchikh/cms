# Setup Admin Command

This document explains how to use the `setup:admin` Artisan command to create roles, permissions, and a super admin user in one go.

## Basic Usage

To create roles, permissions, and an admin user with default credentials:

```bash
php artisan setup:admin
```

This will:
1. Create all necessary roles (admin, editor, author)
2. Create all permissions for categories, tags, posts, pages, users, roles, images, and settings
3. Create a super admin user with default credentials:
   - Email: admin@example.com
   - Password: password

## Using Custom Credentials

You can customize the admin email and password:

```bash
php artisan setup:admin --email=custom@example.com --password=secure-password
```

## Features

- Creates all necessary roles and permissions in one command
- Creates a super admin user with the provided credentials
- If roles or permissions already exist, they will be preserved
- If the admin user already exists, it will be updated to have the admin role
- The admin role will always be given all permissions

## When to Use This Command

This command is particularly useful for:

- Initial setup of a new CMS installation
- Quickly setting up a development environment
- Resetting admin credentials if needed

## Examples

### Default Setup

```bash
$ php artisan setup:admin
Setting up roles, permissions, and admin user...
Creating roles and permissions...
All permissions created successfully.
All roles created successfully.
Admin role has been given all permissions.
Admin user created: Admin User <admin@example.com>
Admin role assigned to Admin User
This user now has all permissions granted to the admin role
Setup completed successfully!
Admin credentials:
Email: admin@example.com
Password: password
```

### Custom Admin User

```bash
$ php artisan setup:admin --email=custom@example.com --password=secure123
Setting up roles, permissions, and admin user...
Creating roles and permissions...
Permissions already exist. Skipping permission creation.
Roles already exist. Skipping role creation.
Admin role has been given all permissions.
Admin user created: Admin User <custom@example.com>
Admin role assigned to Admin User
This user now has all permissions granted to the admin role
Setup completed successfully!
Admin credentials:
Email: custom@example.com
Password: secure123
```

### Updating Existing User

```bash
$ php artisan setup:admin
Setting up roles, permissions, and admin user...
Creating roles and permissions...
Permissions already exist. Skipping permission creation.
Roles already exist. Skipping role creation.
Admin role has been given all permissions.
User with email admin@example.com already exists.
Updating user to have admin role...
Admin role assigned to Admin User
This user now has all permissions granted to the admin role
Setup completed successfully!
Admin credentials:
Email: admin@example.com
Password: password
```
