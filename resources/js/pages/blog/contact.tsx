import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import BlogLayout from '@/layouts/blog-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Mail, MapPin, Phone, Send, MessageSquare } from 'lucide-react';
import { PageHero } from '@/components/blog/page-hero';

interface ContactProps {
  page: {
    title: string;
    content: string;
  };
  contactInfo: {
    email: string;
    phone?: string;
    address?: string;
    social?: {
      twitter?: string;
      facebook?: string;
      instagram?: string;
      linkedin?: string;
    };
  };
}

export default function Contact({ page, contactInfo }: ContactProps) {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('blog.contact.submit'), {
      onSuccess: () => reset(),
    });
  };

  return (
    <BlogLayout title="Contact" showSidebar={false}>
      {/* Hero Section */}
      <PageHero
        title="Get In Touch"
        subtitle="Have a question or want to work with us? We'd love to hear from you!"
        backgroundImage={page.featured_image || "/images/contact-hero.jpg"}
        size="lg"
        align="center"
      >
        <div className="flex flex-wrap gap-4 mt-6 justify-center">
          <Button size="lg" variant="default" className="gap-2" asChild>
            <a href="#contact-form">
              <MessageSquare className="h-5 w-5" />
              Send a Message
            </a>
          </Button>
          {contactInfo.email && (
            <Button size="lg" variant="outline" className="gap-2 bg-background/20 hover:bg-background/40 border-white text-white" asChild>
              <a href={`mailto:${contactInfo.email}`}>
                <Mail className="h-5 w-5" />
                {contactInfo.email}
              </a>
            </Button>
          )}
        </div>
      </PageHero>

      <div className="container py-12">
        <div className="max-w-5xl mx-auto">
          {/* Social Media Banner */}
          <div className="bg-primary/5 rounded-lg p-6 mb-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Connect With Us</h2>
            <p className="text-muted-foreground mb-6">Follow us on social media for the latest updates, articles, and tech news</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href={contactInfo.social?.twitter || "https://twitter.com/yourblog"} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1DA1F2] text-white hover:bg-[#1DA1F2]/90 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
                Twitter
              </a>
              <a href={contactInfo.social?.facebook || "https://facebook.com/yourblog"} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1877F2] text-white hover:bg-[#1877F2]/90 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
                Facebook
              </a>
              <a href={contactInfo.social?.instagram || "https://instagram.com/yourblog"} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E4405F] text-white hover:bg-[#E4405F]/90 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                Instagram
              </a>
              <a href={contactInfo.social?.linkedin || "https://linkedin.com/company/yourblog"} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
                LinkedIn
              </a>
            </div>
          </div>

          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {contactInfo.email && (
              <Card className="text-center hover:shadow-md transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Email Us</h3>
                  <a href={`mailto:${contactInfo.email}`} className="text-primary hover:underline">
                    {contactInfo.email}
                  </a>
                </CardContent>
              </Card>
            )}

            {contactInfo.phone && (
              <Card className="text-center hover:shadow-md transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Call Us</h3>
                  <a href={`tel:${contactInfo.phone}`} className="text-primary hover:underline">
                    {contactInfo.phone}
                  </a>
                </CardContent>
              </Card>
            )}

            {contactInfo.address && (
              <Card className="text-center hover:shadow-md transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Visit Us</h3>
                  <p className="text-muted-foreground">
                    {contactInfo.address}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {page.content && (
            <div className="prose prose-stone dark:prose-invert max-w-none mb-12 text-center" dangerouslySetInnerHTML={{ __html: page.content }} />
          )}

          <div id="contact-form" className="grid gap-8 md:grid-cols-3 scroll-mt-20">
            <div className="md:col-span-2">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Send us a message
                  </CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                        disabled={processing}
                        className={errors.name ? "border-destructive" : ""}
                      />
                      {errors.name && (
                        <p className="text-destructive text-sm flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {errors.name}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                        disabled={processing}
                        className={errors.email ? "border-destructive" : ""}
                      />
                      {errors.email && (
                        <p className="text-destructive text-sm flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {errors.email}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={data.subject}
                        onChange={e => setData('subject', e.target.value)}
                        disabled={processing}
                        className={errors.subject ? "border-destructive" : ""}
                      />
                      {errors.subject && (
                        <p className="text-destructive text-sm flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {errors.subject}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        rows={6}
                        value={data.message}
                        onChange={e => setData('message', e.target.value)}
                        disabled={processing}
                        className={errors.message ? "border-destructive" : ""}
                      />
                      {errors.message && (
                        <p className="text-destructive text-sm flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {errors.message}
                        </p>
                      )}
                    </div>

                    <Button type="submit" disabled={processing} className="w-full gap-2">
                      <Send className="h-4 w-4" />
                      {processing ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
                    </svg>
                    <span>Connect With Us</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 justify-center">
                    {/* Twitter */}
                    <a
                      href={contactInfo.social?.twitter || "https://twitter.com/yourblog"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-2 p-3 rounded-lg border border-input bg-background hover:bg-primary/5 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#1DA1F2]/10 flex items-center justify-center group-hover:bg-[#1DA1F2]/20">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1DA1F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">Twitter</span>
                    </a>

                    {/* Facebook */}
                    <a
                      href={contactInfo.social?.facebook || "https://facebook.com/yourblog"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-2 p-3 rounded-lg border border-input bg-background hover:bg-primary/5 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#1877F2]/10 flex items-center justify-center group-hover:bg-[#1877F2]/20">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1877F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">Facebook</span>
                    </a>

                    {/* Instagram */}
                    <a
                      href={contactInfo.social?.instagram || "https://instagram.com/yourblog"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-2 p-3 rounded-lg border border-input bg-background hover:bg-primary/5 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#E4405F]/10 flex items-center justify-center group-hover:bg-[#E4405F]/20">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E4405F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">Instagram</span>
                    </a>

                    {/* LinkedIn */}
                    <a
                      href={contactInfo.social?.linkedin || "https://linkedin.com/company/yourblog"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-2 p-3 rounded-lg border border-input bg-background hover:bg-primary/5 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#0A66C2]/10 flex items-center justify-center group-hover:bg-[#0A66C2]/20">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A66C2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                          <rect width="4" height="12" x="2" y="9" />
                          <circle cx="4" cy="4" r="2" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">LinkedIn</span>
                    </a>

                    {/* YouTube */}
                    <a
                      href="https://youtube.com/@yourblog"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-2 p-3 rounded-lg border border-input bg-background hover:bg-primary/5 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#FF0000]/10 flex items-center justify-center group-hover:bg-[#FF0000]/20">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
                          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
                        </svg>
                      </div>
                      <span className="text-sm font-medium">YouTube</span>
                    </a>

                    {/* GitHub */}
                    <a
                      href="https://github.com/yourblog"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-2 p-3 rounded-lg border border-input bg-background hover:bg-primary/5 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#333]/10 flex items-center justify-center group-hover:bg-[#333]/20 dark:bg-white/10 dark:group-hover:bg-white/20">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-white">
                          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                        </svg>
                      </div>
                      <span className="text-sm font-medium">GitHub</span>
                    </a>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-medium mb-3 text-center">Business Hours</h3>
                    <div className="space-y-2 text-center">
                      <p className="text-sm"><span className="font-medium">Monday - Friday:</span> 9:00 AM - 6:00 PM</p>
                      <p className="text-sm"><span className="font-medium">Saturday:</span> 10:00 AM - 4:00 PM</p>
                      <p className="text-sm"><span className="font-medium">Sunday:</span> Closed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </BlogLayout>
  );
}
