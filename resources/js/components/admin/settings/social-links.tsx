import { useForm } from '@inertiajs/react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Github, Globe, AtSign } from 'lucide-react';

interface SocialLinksProps {
  facebookUrl: string | null;
  twitterUrl: string | null;
  instagramUrl: string | null;
  linkedinUrl: string | null;
  youtubeUrl: string | null;
  githubUrl: string | null;
  websiteUrl: string | null;
  contactEmail: string | null;
}

export default function SocialLinks({
  facebookUrl,
  twitterUrl,
  instagramUrl,
  linkedinUrl,
  youtubeUrl,
  githubUrl,
  websiteUrl,
  contactEmail
}: SocialLinksProps) {
  const { data, setData, post, processing } = useForm({
    settings: {
      facebook_url: facebookUrl || '',
      twitter_url: twitterUrl || '',
      instagram_url: instagramUrl || '',
      linkedin_url: linkedinUrl || '',
      youtube_url: youtubeUrl || '',
      github_url: githubUrl || '',
      website_url: websiteUrl || '',
      contact_email: contactEmail || '',
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    post(route('admin.settings.update-group', 'social'), {
      onSuccess: () => {
        toast.success('Social media links updated successfully');
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Media Links</CardTitle>
        <CardDescription>
          Add your social media profile links to display in the footer and contact page.
          Leave empty to hide a specific social media link.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="facebook-url" className="flex items-center gap-2">
                <Facebook className="h-4 w-4" /> Facebook URL
              </Label>
              <Input
                id="facebook-url"
                placeholder="https://facebook.com/yourpage"
                value={data.settings.facebook_url}
                onChange={(e) => 
                  setData('settings', { ...data.settings, facebook_url: e.target.value })
                }
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="twitter-url" className="flex items-center gap-2">
                <Twitter className="h-4 w-4" /> Twitter URL
              </Label>
              <Input
                id="twitter-url"
                placeholder="https://twitter.com/yourusername"
                value={data.settings.twitter_url}
                onChange={(e) => 
                  setData('settings', { ...data.settings, twitter_url: e.target.value })
                }
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="instagram-url" className="flex items-center gap-2">
                <Instagram className="h-4 w-4" /> Instagram URL
              </Label>
              <Input
                id="instagram-url"
                placeholder="https://instagram.com/yourusername"
                value={data.settings.instagram_url}
                onChange={(e) => 
                  setData('settings', { ...data.settings, instagram_url: e.target.value })
                }
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="linkedin-url" className="flex items-center gap-2">
                <Linkedin className="h-4 w-4" /> LinkedIn URL
              </Label>
              <Input
                id="linkedin-url"
                placeholder="https://linkedin.com/in/yourusername"
                value={data.settings.linkedin_url}
                onChange={(e) => 
                  setData('settings', { ...data.settings, linkedin_url: e.target.value })
                }
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="youtube-url" className="flex items-center gap-2">
                <Youtube className="h-4 w-4" /> YouTube URL
              </Label>
              <Input
                id="youtube-url"
                placeholder="https://youtube.com/c/yourchannel"
                value={data.settings.youtube_url}
                onChange={(e) => 
                  setData('settings', { ...data.settings, youtube_url: e.target.value })
                }
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="github-url" className="flex items-center gap-2">
                <Github className="h-4 w-4" /> GitHub URL
              </Label>
              <Input
                id="github-url"
                placeholder="https://github.com/yourusername"
                value={data.settings.github_url}
                onChange={(e) => 
                  setData('settings', { ...data.settings, github_url: e.target.value })
                }
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website-url" className="flex items-center gap-2">
                <Globe className="h-4 w-4" /> Website URL
              </Label>
              <Input
                id="website-url"
                placeholder="https://yourwebsite.com"
                value={data.settings.website_url}
                onChange={(e) => 
                  setData('settings', { ...data.settings, website_url: e.target.value })
                }
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact-email" className="flex items-center gap-2">
                <AtSign className="h-4 w-4" /> Contact Email
              </Label>
              <Input
                id="contact-email"
                type="email"
                placeholder="contact@example.com"
                value={data.settings.contact_email}
                onChange={(e) => 
                  setData('settings', { ...data.settings, contact_email: e.target.value })
                }
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={processing}>
            Save Changes
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
