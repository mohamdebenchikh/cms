import { Head } from '@inertiajs/react';
import React from 'react';
import { getSetting } from '@/utils/settings';

interface SeoHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
}

export default function SeoHead({
  title,
  description,
  keywords,
  ogImage,
  ogType = 'website',
}: SeoHeadProps) {
  // Get default values from settings
  const siteName = getSetting('site_name', 'My Blog');
  const defaultDescription = getSetting('meta_description', '');
  const defaultKeywords = getSetting('meta_keywords', '');
  const favicon = getSetting('favicon');
  
  // Use provided values or defaults
  const pageTitle = title ? `${title} | ${siteName}` : getSetting('meta_title', siteName);
  const pageDescription = description || defaultDescription;
  const pageKeywords = keywords || defaultKeywords;
  
  return (
    <Head>
      <title>{pageTitle}</title>
      {pageDescription && <meta name="description" content={pageDescription} />}
      {pageKeywords && <meta name="keywords" content={pageKeywords} />}
      
      {/* Open Graph tags */}
      <meta property="og:title" content={pageTitle} />
      {pageDescription && <meta property="og:description" content={pageDescription} />}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={siteName} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      
      {/* Favicon */}
      {favicon && <link rel="icon" href={favicon} />}
    </Head>
  );
}
