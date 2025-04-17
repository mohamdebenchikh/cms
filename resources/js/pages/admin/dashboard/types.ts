export interface DashboardStats {
  totalPosts: number;
  totalPages: number;
  totalUsers: number;
  totalImages: number;
  totalCategories: number;
  totalTags: number;
  recentPosts: {
    id: number;
    title: string;
    status: string;
    created_at: string;
    user?: {
      name: string;
    };
  }[];
  postsByStatus: {
    status: string;
    count: number;
  }[];
  postsByMonth: {
    month: string;
    count: number;
  }[];
  popularCategories: {
    name: string;
    count: number;
  }[];
}

export interface DashboardProps {
  stats: DashboardStats;
}
