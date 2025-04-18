# Modern CMS Blog Platform

A modern, feature-rich Content Management System (CMS) built with Laravel and React, designed for creating and managing blog content with a clean, responsive frontend.

![CMS Dashboard](https://via.placeholder.com/1200x600?text=CMS+Dashboard)

## Features

### Admin Dashboard
- **Comprehensive Analytics**: View post counts, user stats, and content metrics
- **Content Management**: Create, edit, and manage posts, pages, categories, and tags
- **Media Library**: Upload and manage images with an intuitive interface
- **User Management**: Control user accounts with role-based permissions
- **Settings**: Customize site appearance, SEO settings, and more

### Blog Frontend
- **Responsive Design**: Optimized for all devices from mobile to desktop
- **SEO Optimized**: Built-in SEO tools for better search engine visibility
- **Dark/Light Mode**: Toggle between dark and light themes
- **Category & Tag Navigation**: Browse content by categories and tags
- **Search Functionality**: Find content quickly with the built-in search
- **Archive View**: Browse posts by date with monthly archives
- **Grid/List View**: Toggle between different content viewing modes

## Tech Stack

### Backend
- **Laravel 12**: Modern PHP framework for robust backend development
- **MySQL/SQLite**: Database options for storing content and user data
- **Spatie Laravel Permission**: Role and permission management
- **Inertia.js**: Server-side rendering without API complexity

### Frontend
- **React 18**: Component-based UI library
- **TypeScript**: Type-safe JavaScript for better development experience
- **Tailwind CSS 4**: Utility-first CSS framework
- **Shadcn UI**: High-quality UI components built on Radix UI
- **React Hook Form**: Form validation and handling
- **TanStack React Table**: Powerful data tables with sorting and filtering

## Getting Started

### Prerequisites
- PHP 8.2 or higher
- Composer
- Node.js 18 or higher
- npm or yarn
- MySQL or SQLite

### Installation

1. Clone the repository
```bash
git clone https://github.com/mohamdebenchikh/cms.git
cd cms
```

2. Install PHP dependencies
```bash
composer install
```

3. Install JavaScript dependencies
```bash
npm install
```

4. Copy the environment file and configure your database
```bash
cp .env.example .env
```

5. Generate application key
```bash
php artisan key:generate
```

6. Run database migrations and set up admin user
```bash
php artisan migrate
php artisan setup:admin
```

Alternatively, you can run migrations with all seed data:
```bash
php artisan migrate --seed
```

7. Build frontend assets
```bash
npm run build
```

8. Start the development server
```bash
php artisan serve
```

9. Access the CMS at http://localhost:8000

### Default Admin Credentials
- **Email**: admin@example.com
- **Password**: password

## Development

### Running in Development Mode

Start the Laravel development server:
```bash
php artisan serve
```

Run Vite development server for hot module replacement:
```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

## Project Structure

```
├── app/                  # PHP application code
│   ├── Http/             # Controllers, Middleware, Requests
│   ├── Models/           # Eloquent models
│   └── Providers/        # Service providers
├── database/             # Migrations, factories, and seeders
├── public/               # Publicly accessible files
├── resources/            # Frontend resources
│   ├── css/              # CSS files
│   ├── js/               # JavaScript/TypeScript files
│   │   ├── components/   # React components
│   │   ├── layouts/      # Layout components
│   │   ├── pages/        # Page components
│   │   └── types/        # TypeScript type definitions
│   └── views/            # Blade templates
├── routes/               # Route definitions
│   ├── auth.php          # Authentication routes
│   ├── blog.php          # Blog frontend routes
│   ├── cms.php           # Admin CMS routes
│   └── web.php           # Web routes
└── storage/              # Application storage
```

## Features in Detail

### Content Management
- **Posts**: Create, edit, and manage blog posts with rich text editing
- **Pages**: Manage static pages like About, Contact, Privacy Policy
- **Categories**: Organize posts into categories with hierarchical structure
- **Tags**: Add tags to posts for better content organization
- **Featured Images**: Add eye-catching images to posts and pages
- **SEO Settings**: Customize meta titles, descriptions, and keywords

### User Management
- **Role-Based Access**: Admin, Editor, and Author roles with different permissions
- **User Profiles**: Manage user information and avatars
- **Permissions**: Fine-grained control over user capabilities

### Media Management
- **Image Upload**: Drag-and-drop image uploading
- **Media Library**: Browse and manage all uploaded media
- **Image Optimization**: Automatic image resizing and optimization

### Frontend Features
- **Responsive Design**: Mobile-first approach for all screen sizes
- **Dark/Light Mode**: User preference-based theme switching
- **Search**: Full-text search across all content
- **Pagination**: Smooth navigation through content lists
- **Related Posts**: Automatically display related content
- **Social Sharing**: Easy sharing of content to social media
- **Contact Form**: Built-in contact form with validation

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Laravel](https://laravel.com/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Inertia.js](https://inertiajs.com/)
