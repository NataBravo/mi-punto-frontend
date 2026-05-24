export interface CategoryOut {
  id: number;
  name: string;
  slug: string;
}

export interface MediaOut {
  id: number;
  url: string;
  is_primary: boolean;
  sort_order: number;
}

export interface BusinessOwnerRow {
  id: number;
  name: string;
  city: string;
  is_active: boolean;
  category_name: string;
  admin_full_name: string;
  admin_email: string;
}

export interface BusinessDetail {
  id: number;
  name: string;
  description: string;
  city: string;
  address: string;
  phone: string | null;
  email: string | null;
  hours: string | null;
  is_active: boolean;
  category: CategoryOut;
  cover_url: string | null;
  logo_url: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  media: MediaOut[];
  average_rating: number;
  review_count: number;
  profile_views: number;
  lat: number | null;
  lng: number | null;
  admin_full_name: string | null;
  admin_email: string | null;
  created_at: string;
}

export interface ToggleResult {
  id: number;
  is_active: boolean;
}

export interface MyBusiness {
  id: number;
  name: string;
  description: string;
  city: string;
  address: string;
  phone: string | null;
  email: string | null;
  hours: string | null;
  is_active: boolean;
  category: CategoryOut;
  cover_url: string | null;
  logo_url: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  media: MediaOut[];
  lat: number | null;
  lng: number | null;
  average_rating: number;
  review_count: number;
  profile_views: number;
}

export interface BusinessCreateInput {
  name: string;
  description?: string;
  category_id: number;
  city: string;
  address?: string;
  phone?: string | null;
  email?: string | null;
  hours?: string | null;
  instagram_url?: string | null;
  facebook_url?: string | null;
}

export interface BusinessUpdateInput {
  name?: string;
  description?: string;
  category_id?: number;
  city?: string;
  address?: string;
  phone?: string | null;
  email?: string | null;
  hours?: string | null;
  instagram_url?: string | null;
  facebook_url?: string | null;
}

export interface BusinessLocationInput {
  lat: number;
  lng: number;
  address?: string;
}

export interface PublicBusinessSummary {
  id: number;
  name: string;
  description: string;
  city: string;
  address: string;
  category: CategoryOut;
  cover_url: string | null;
  logo_url: string | null;
  average_rating: number;
  review_count: number;
  lat: number | null;
  lng: number | null;
  distance_km: number | null;
}

export interface PublicBusinessDetail {
  id: number;
  name: string;
  description: string;
  city: string;
  address: string;
  phone: string | null;
  email: string | null;
  hours: string | null;
  category: CategoryOut;
  cover_url: string | null;
  logo_url: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  media: MediaOut[];
  average_rating: number;
  review_count: number;
  lat: number | null;
  lng: number | null;
}

export interface CatalogParams {
  city?: string;
  category_id?: number;
  q?: string;
  page?: number;
  page_size?: number;
}

export interface NearbyParams {
  lat: number;
  lng: number;
  radius_km?: number;
}
