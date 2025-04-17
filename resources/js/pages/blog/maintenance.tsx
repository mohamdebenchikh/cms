import { Head } from '@inertiajs/react';
import React from 'react';

interface MaintenanceProps {
  message: string;
  siteName: string;
  siteDescription?: string;
  siteLogo?: string;
  favicon?: string;
}

export default function Maintenance({ message, siteName, siteDescription, siteLogo, favicon }: MaintenanceProps) {
  return (
    <>
      <Head>
        <title>Maintenance - {siteName}</title>
        <meta name="description" content={siteDescription || 'Site under maintenance'} />
        {favicon && <link rel="icon" href={favicon} />}
      </Head>
      
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <div className="mx-auto w-full max-w-md px-4 py-8 text-center">
          {siteLogo && (
            <div className="mb-6 flex justify-center">
              <img src={siteLogo} alt={siteName} className="h-16 w-auto" />
            </div>
          )}
          
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground">
            Site Under Maintenance
          </h1>
          
          <div className="mb-8 text-lg text-muted-foreground">
            {message}
          </div>
          
          <div className="mt-12 text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {siteName}
          </div>
        </div>
      </div>
    </>
  );
}
