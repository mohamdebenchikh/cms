import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
  FileText,
  Image as ImageIcon,
  Users,
  Tag,
  Layers,
  Calendar,
  TrendingUp,
  Eye
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { DashboardProps } from './types';

export default function Dashboard({ stats }: DashboardProps) {
  const breadcrumbs = [
    {
      title: 'Dashboard',
      href: route('admin.dashboard'),
    },
  ];

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Admin Dashboard" />

      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPosts}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <Link href={route('admin.posts.index')} className="text-primary hover:underline">
                  View all posts
                </Link>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
              <Layers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPages}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <Link href={route('admin.pages.index')} className="text-primary hover:underline">
                  View all pages
                </Link>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <Link href={route('admin.users.index')} className="text-primary hover:underline">
                  View all users
                </Link>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Images</CardTitle>
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalImages}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <Link href={route('admin.images.index')} className="text-primary hover:underline">
                  View all images
                </Link>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Layers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCategories}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <Link href={route('admin.categories.index')} className="text-primary hover:underline">
                  View all categories
                </Link>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tags</CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTags}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <Link href={route('admin.tags.index')} className="text-primary hover:underline">
                  View all tags
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Posts by Status Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Posts by Status</CardTitle>
              <CardDescription>Distribution of posts by their current status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ChartContainer
                  config={{
                    published: {
                      theme: {
                        light: "#22c55e",
                        dark: "#22c55e"
                      }
                    },
                    draft: {
                      theme: {
                        light: "#3b82f6",
                        dark: "#60a5fa"
                      }
                    },
                    archived: {
                      theme: {
                        light: "#ef4444",
                        dark: "#f87171"
                      }
                    }
                  }}
                >
                  <PieChart>
                    <Pie
                      data={stats.postsByStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="status"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {stats.postsByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <ChartTooltip>
                              <ChartTooltipContent
                                content={[
                                  {
                                    label: "Status",
                                    value: payload[0].name
                                  },
                                  {
                                    label: "Count",
                                    value: payload[0].value
                                  }
                                ]}
                              />
                            </ChartTooltip>
                          )
                        }
                        return null
                      }}
                    />
                  </PieChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Posts by Month Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Content Growth</CardTitle>
              <CardDescription>Number of posts created per month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ChartContainer
                  config={{
                    posts: {
                      theme: {
                        light: "#3b82f6",
                        dark: "#60a5fa"
                      }
                    }
                  }}
                >
                  <LineChart data={stats.postsByMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <ChartTooltip>
                              <ChartTooltipContent
                                title={label}
                                content={[
                                  {
                                    label: "Posts",
                                    value: payload[0].value
                                  }
                                ]}
                              />
                            </ChartTooltip>
                          )
                        }
                        return null
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="var(--color-posts)"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Posts */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Posts</CardTitle>
              <CardDescription>Latest content added to your CMS</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentPosts.map(post => (
                  <div key={post.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="space-y-1">
                      <p className="font-medium">{post.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        post.status === 'published'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                          : post.status === 'draft'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                      }`}>
                        {post.status}
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={route('admin.posts.edit', post.id)}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              {stats.recentPosts.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  No posts found
                </div>
              )}
              <div className="mt-4 text-center">
                <Button asChild variant="outline">
                  <Link href={route('admin.posts.index')}>
                    View All Posts
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Popular Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Popular Categories</CardTitle>
              <CardDescription>Categories with the most posts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ChartContainer
                  config={{
                    count: {
                      theme: {
                        light: "#8b5cf6",
                        dark: "#a78bfa"
                      }
                    }
                  }}
                >
                  <BarChart data={stats.popularCategories}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <ChartTooltip>
                              <ChartTooltipContent
                                title={label}
                                content={[
                                  {
                                    label: "Posts",
                                    value: payload[0].value
                                  }
                                ]}
                              />
                            </ChartTooltip>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar dataKey="count" fill="var(--color-count)" />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
