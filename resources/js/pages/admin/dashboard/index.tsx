import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
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
  Cell,
  Legend
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
  Eye,
  BarChart2,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Archive
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DashboardProps } from './types';

export default function Dashboard({ stats }: DashboardProps) {
  const breadcrumbs = [
    {
      title: 'Dashboard',
      href: route('admin.dashboard'),
    },
  ];

  // Colors for pie chart
  const COLORS = ['#22c55e', '#3b82f6', '#ef4444', '#f59e0b'];
  const STATUS_COLORS = {
    published: '#22c55e',
    draft: '#3b82f6',
    archived: '#ef4444'
  };

  // Calculate percentage changes (mock data for demonstration)
  const getStatusCount = (status: string) => {
    const statusItem = stats.postsByStatus.find(item => item.status === status);
    return statusItem ? statusItem.count : 0;
  };

  const publishedCount = getStatusCount('published');
  const draftCount = getStatusCount('draft');
  const archivedCount = getStatusCount('archived');
  const totalPostsCount = stats.totalPosts;

  // Calculate percentages
  const publishedPercentage = totalPostsCount > 0 ? (publishedCount / totalPostsCount) * 100 : 0;
  const draftPercentage = totalPostsCount > 0 ? (draftCount / totalPostsCount) * 100 : 0;
  const archivedPercentage = totalPostsCount > 0 ? (archivedCount / totalPostsCount) * 100 : 0;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Admin Dashboard" />

      <div className="container mx-auto py-6 space-y-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your CMS dashboard. Here's an overview of your content.</p>
        </div>

        {/* Stats Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="overflow-hidden border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <div className="p-2 bg-primary/10 rounded-full">
                <FileText className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalPosts}</div>
              <div className="flex items-center gap-1 mt-1 text-xs">
                <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                <span className="text-emerald-500 font-medium">12%</span>
                <span className="text-muted-foreground">from last month</span>
              </div>
            </CardContent>
            <CardFooter className="pt-0 pb-3">
              <Button asChild variant="ghost" size="sm" className="px-0 text-xs text-primary hover:text-primary/90">
                <Link href={route('admin.posts.index')}>
                  View all posts
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="overflow-hidden border-l-4 border-l-indigo-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
              <div className="p-2 bg-indigo-500/10 rounded-full">
                <Layers className="h-4 w-4 text-indigo-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalPages}</div>
              <div className="flex items-center gap-1 mt-1 text-xs">
                <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                <span className="text-emerald-500 font-medium">5%</span>
                <span className="text-muted-foreground">from last month</span>
              </div>
            </CardContent>
            <CardFooter className="pt-0 pb-3">
              <Button asChild variant="ghost" size="sm" className="px-0 text-xs text-indigo-500 hover:text-indigo-500/90">
                <Link href={route('admin.pages.index')}>
                  View all pages
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="overflow-hidden border-l-4 border-l-violet-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <div className="p-2 bg-violet-500/10 rounded-full">
                <Users className="h-4 w-4 text-violet-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalUsers}</div>
              <div className="flex items-center gap-1 mt-1 text-xs">
                <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                <span className="text-emerald-500 font-medium">8%</span>
                <span className="text-muted-foreground">from last month</span>
              </div>
            </CardContent>
            <CardFooter className="pt-0 pb-3">
              <Button asChild variant="ghost" size="sm" className="px-0 text-xs text-violet-500 hover:text-violet-500/90">
                <Link href={route('admin.users.index')}>
                  View all users
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="overflow-hidden border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Images</CardTitle>
              <div className="p-2 bg-amber-500/10 rounded-full">
                <ImageIcon className="h-4 w-4 text-amber-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalImages}</div>
              <div className="flex items-center gap-1 mt-1 text-xs">
                <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                <span className="text-emerald-500 font-medium">15%</span>
                <span className="text-muted-foreground">from last month</span>
              </div>
            </CardContent>
            <CardFooter className="pt-0 pb-3">
              <Button asChild variant="ghost" size="sm" className="px-0 text-xs text-amber-500 hover:text-amber-500/90">
                <Link href={route('admin.images.index')}>
                  View all images
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Content Status Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Content Status Overview</CardTitle>
              <CardDescription>Distribution of your content by status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm font-medium">Published</span>
                    </div>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400">
                      {publishedCount}
                    </Badge>
                  </div>
                  <Progress value={publishedPercentage} className="h-2 bg-emerald-100 dark:bg-emerald-950/50" indicatorClassName="bg-emerald-500" />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">Draft</span>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50 dark:bg-blue-950/20 dark:text-blue-400">
                      {draftCount}
                    </Badge>
                  </div>
                  <Progress value={draftPercentage} className="h-2 bg-blue-100 dark:bg-blue-950/50" indicatorClassName="bg-blue-500" />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Archive className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium">Archived</span>
                    </div>
                    <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50 dark:bg-red-950/20 dark:text-red-400">
                      {archivedCount}
                    </Badge>
                  </div>
                  <Progress value={archivedPercentage} className="h-2 bg-red-100 dark:bg-red-950/50" indicatorClassName="bg-red-500" />
                </div>
              </div>

              <div className="mt-6 h-[200px] relative">
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
                  className="absolute inset-0"
                >
                  <ResponsiveContainer>
                    <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                      <Pie
                        data={stats.postsByStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="status"
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
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest content updates</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={route('admin.posts.index')}>View all</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-6">
                  {stats.recentPosts.map(post => (
                    <div key={post.id} className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
                      <div className={`p-2 rounded-full ${post.status === 'published' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' : post.status === 'draft' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400' : 'bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-400'}`}>
                        {post.status === 'published' ? <CheckCircle2 className="h-4 w-4" /> : post.status === 'draft' ? <Clock className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium line-clamp-1">{post.title}</p>
                          <Badge variant="outline" className={`${post.status === 'published' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' : post.status === 'draft' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400' : 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400'}`}>
                            {post.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                          {post.user && (
                            <>
                              <span>•</span>
                              <span>by {post.user.name}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Content Growth Chart */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Content Growth</CardTitle>
            <CardDescription>Number of posts created per month</CardDescription>
          </CardHeader>
          <CardContent className="p-0 pb-4">
            <div className="h-[300px] w-full relative">
              <ChartContainer
                config={{
                  posts: {
                    theme: {
                      light: "#3b82f6",
                      dark: "#60a5fa"
                    }
                  }
                }}
                className="absolute inset-0"
              >
                <ResponsiveContainer>
                  <LineChart
                    data={stats.postsByMonth}
                    margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="month"
                      stroke="#6b7280"
                      tick={{ fontSize: 12 }}
                      tickMargin={10}
                    />
                    <YAxis
                      stroke="#6b7280"
                      tick={{ fontSize: 12 }}
                      tickMargin={10}
                    />
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
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Popular Categories */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Popular Categories</CardTitle>
            <CardDescription>Categories with the most posts</CardDescription>
          </CardHeader>
          <CardContent className="p-0 pb-4">
            <div className="h-[300px] w-full relative">
              <ChartContainer
                config={{
                  count: {
                    theme: {
                      light: "#8b5cf6",
                      dark: "#a78bfa"
                    }
                  }
                }}
                className="absolute inset-0"
              >
                <ResponsiveContainer>
                  <BarChart
                    data={stats.popularCategories}
                    margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="name"
                      stroke="#6b7280"
                      tick={{ fontSize: 12 }}
                      tickMargin={10}
                    />
                    <YAxis
                      stroke="#6b7280"
                      tick={{ fontSize: 12 }}
                      tickMargin={10}
                    />
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
                    <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
