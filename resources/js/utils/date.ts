import { format, formatDistanceToNow } from 'date-fns';

/**
 * Format a date string to a readable format
 * 
 * @param dateString Date string to format
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  return format(new Date(dateString), 'MMMM d, yyyy');
}

/**
 * Format a date string to a relative format (e.g. "2 days ago")
 * 
 * @param dateString Date string to format
 * @returns Relative date string
 */
export function formatRelativeDate(dateString: string): string {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true });
}

/**
 * Format a date string to a compact format (e.g. "Jan 1, 2021")
 * 
 * @param dateString Date string to format
 * @returns Compact date string
 */
export function formatCompactDate(dateString: string): string {
  return format(new Date(dateString), 'MMM d, yyyy');
}
