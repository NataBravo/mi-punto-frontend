export interface ReviewResponseOut {
  id: number;
  body: string;
  created_at: string;
}

export interface Review {
  id: number;
  business_id: number;
  user_id: number;
  user_full_name: string;
  rating: number;
  comment: string;
  created_at: string;
  response: ReviewResponseOut | null;
}

export interface MyReview {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  business_id: number;
  business_name: string;
  business_city: string;
  business_category: string;
  response: ReviewResponseOut | null;
}

export interface ReviewCreateInput {
  rating: number;
  comment: string;
}

export interface ReviewResponseCreateInput {
  body: string;
}
