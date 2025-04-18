# Admin User Creation Command

This document explains how to use the `admin:create` Artisan command to create a new admin user with all permissions.

## Basic Usage

To create a new admin user interactively:

```bash
php artisan admin:create
```

This will prompt you for:
- Admin name
- Admin email
- Admin password (with confirmation)

## Using Command Options

You can also provide the information directly as command options:

```bash
php artisan admin:create --name="Admin User" --email="admin@example.com" --password="secure-password"
```

## Features

- Creates a new user with the provided credentials
- Assigns the admin role to the user
- If a user with the provided email already exists, offers to update their role
- Validates password length (minimum 8 characters)
- Confirms password when entered interactively

## Requirements

- The admin role must exist in the database
- You should run the RolesAndPermissionsSeeder before using this command

## Examples

### Interactive Mode

```bash
$ php artisan admin:create
Enter admin name: John Doe
Enter admin email: john@example.com
Enter admin password (min 8 characters): ********
Confirm admin password: ********
Admin user created: John Doe <john@example.com>
Admin role assigned to John Doe
This user now has all permissions granted to the admin role
```

### Non-Interactive Mode

```bash
$ php artisan admin:create --name="Jane Smith" --email="jane@example.com" --password="secure123"
Admin user created: Jane Smith <jane@example.com>
Admin role assigned to Jane Smith
This user now has all permissions granted to the admin role
```

### Updating Existing User

```bash
$ php artisan admin:create --email="existing@example.com"
Enter admin name: Existing User
A user with email existing@example.com already exists!
Do you want to update this user to have admin role? (yes/no) [yes]:
Using existing user: Existing User
Admin role assigned to Existing User
This user now has all permissions granted to the admin role
```
