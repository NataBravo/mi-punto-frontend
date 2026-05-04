export interface CityDistribution {
  city: string;
  count: number;
  percentage: number;
}

export interface CategoryDistribution {
  category: string;
  count: number;
  percentage: number;
}

export interface OwnerMetrics {
  total_businesses: number;
  active_businesses: number;
  inactive_businesses: number;
  total_reviews: number;
  total_visits: number;
  cities: CityDistribution[];
  categories: CategoryDistribution[];
}

export interface RecentReview {
  id: number;
  user_full_name: string;
  rating: number;
  comment: string;
  created_at: string;
  has_response: boolean;
}

export interface BusinessMetrics {
  business_id: number;
  profile_views: number;
  total_reviews: number;
  average_rating: number;
  response_rate: number;
  pending_responses: number;
  recent_reviews: RecentReview[];
}
