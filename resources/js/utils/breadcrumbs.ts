import { BreadcrumbItem } from '@/components/blog/blog-breadcrumb';

/**
 * Create breadcrumbs for a blog page
 * 
 * @param items Array of breadcrumb items
 * @returns Array of breadcrumb items
 */
export function createBreadcrumbs(items: BreadcrumbItem[]): BreadcrumbItem[] {
  return items;
}

/**
 * Create breadcrumbs for a category page
 * 
 * @param categoryName The name of the category
 * @param categorySlug The slug of the category
 * @returns Array of breadcrumb items
 */
export function createCategoryBreadcrumbs(categoryName: string, categorySlug: string): BreadcrumbItem[] {
  return [
    { title: 'Categories', href: route('blog.categories') },
    { title: categoryName }
  ];
}

/**
 * Create breadcrumbs for a tag page
 * 
 * @param tagName The name of the tag
 * @returns Array of breadcrumb items
 */
export function createTagBreadcrumbs(tagName: string): BreadcrumbItem[] {
  return [
    { title: 'Tags' },
    { title: tagName }
  ];
}

/**
 * Create breadcrumbs for a post page
 * 
 * @param postTitle The title of the post
 * @param categoryName The name of the category (optional)
 * @param categorySlug The slug of the category (optional)
 * @returns Array of breadcrumb items
 */
export function createPostBreadcrumbs(
  postTitle: string, 
  categoryName?: string, 
  categorySlug?: string
): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [];
  
  // Add category if provided
  if (categoryName && categorySlug) {
    breadcrumbs.push({ 
      title: categoryName, 
      href: route('blog.category', categorySlug) 
    });
  }
  
  // Add post title
  breadcrumbs.push({ title: postTitle });
  
  return breadcrumbs;
}
