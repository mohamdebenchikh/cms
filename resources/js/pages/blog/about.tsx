import React from 'react';
import { Head } from '@inertiajs/react';
import BlogLayout from '@/layouts/blog-layout';
import { Card, CardContent } from '@/components/ui/card';
import { User } from '@/types';
import { PageHero } from '@/components/blog/page-hero';
import { Button } from '@/components/ui/button';

interface AboutProps {
  page: {
    title: string;
    content: string;
    featured_image?: string;
  };
  team?: User[];
}

export default function About({ page, team }: AboutProps) {
  return (
    <BlogLayout title="About" showSidebar={false}>
      {/* Hero Section */}
      <PageHero
        title="About Our Tech Blog"
        subtitle="Learn more about our team and mission to provide valuable insights and resources for developers and tech enthusiasts."
        backgroundImage={page.featured_image || "/images/about-hero.jpg"}
        size="lg"
        overlay={true}
        overlayOpacity="medium"
        defaultImage="/images/hero-bg.jpeg"
      >
        <div className="flex flex-wrap gap-4 mt-6">
          <Button size="lg" variant="default" asChild>
            <a href="#team">Meet Our Team</a>
          </Button>
          <Button size="lg" variant="outline" className="bg-background/20 hover:bg-background/40 border-white text-white" asChild>
            <a href="#content">Our Story</a>
          </Button>
        </div>
      </PageHero>

      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <div id="content" className="scroll-mt-20">

          <div className="prose prose-stone dark:prose-invert max-w-none mb-12" dangerouslySetInnerHTML={{ __html: page.content }} />
          </div>

          {team && team.length > 0 && (
            <div id="team" className="mt-16 scroll-mt-20">
              <h2 className="text-3xl font-bold mb-8 text-center">Meet Our Team</h2>
              <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
                Our team of experienced writers and developers are passionate about sharing knowledge and helping the tech community grow.
              </p>
              <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {team.map((member) => (
                  <Card key={member.id} className="overflow-hidden hover:shadow-md transition-all duration-300">
                    <div className="aspect-[1/1] w-full overflow-hidden bg-muted">
                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-muted-foreground"
                          >
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{member.name}</h3>
                      {member.role && (
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      )}
                      {member.bio && (
                        <p className="text-sm mt-2">{member.bio}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </BlogLayout>
  );
}
