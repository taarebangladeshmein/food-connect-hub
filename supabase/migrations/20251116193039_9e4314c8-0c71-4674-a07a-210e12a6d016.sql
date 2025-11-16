-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('donor', 'ngo', 'volunteer');

-- Create enum for donation status
CREATE TYPE public.donation_status AS ENUM ('available', 'accepted', 'picked_up', 'delivered', 'cancelled');

-- Create enum for food category
CREATE TYPE public.food_category AS ENUM ('cooked_food', 'raw_food', 'packaged_food', 'beverages', 'bakery', 'dairy', 'fruits_vegetables');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Create ngo_profiles table
CREATE TABLE public.ngo_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  organization_name TEXT NOT NULL,
  registration_number TEXT,
  description TEXT,
  beneficiaries_count INTEGER DEFAULT 0,
  vehicle_capacity TEXT,
  operating_hours TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create volunteer_profiles table
CREATE TABLE public.volunteer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  vehicle_type TEXT,
  vehicle_number TEXT,
  availability_status BOOLEAN DEFAULT TRUE,
  total_deliveries INTEGER DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create donations table
CREATE TABLE public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  food_category food_category NOT NULL,
  quantity TEXT NOT NULL,
  unit TEXT DEFAULT 'kg',
  food_image_url TEXT,
  pickup_address TEXT NOT NULL,
  pickup_city TEXT NOT NULL,
  pickup_latitude DECIMAL(10, 8),
  pickup_longitude DECIMAL(11, 8),
  prepared_at TIMESTAMPTZ,
  expire_at TIMESTAMPTZ NOT NULL,
  status donation_status DEFAULT 'available',
  quality_notes TEXT,
  temperature_indicator TEXT,
  accepted_by_ngo UUID REFERENCES auth.users(id),
  accepted_at TIMESTAMPTZ,
  assigned_volunteer UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create donation_requests table
CREATE TABLE public.donation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_id UUID NOT NULL REFERENCES public.donations(id) ON DELETE CASCADE,
  ngo_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  request_message TEXT,
  distance_km DECIMAL(10, 2),
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create delivery_tracking table
CREATE TABLE public.delivery_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_id UUID NOT NULL REFERENCES public.donations(id) ON DELETE CASCADE,
  volunteer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ngo_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pickup_time TIMESTAMPTZ,
  delivery_time TIMESTAMPTZ,
  status TEXT DEFAULT 'assigned',
  notes TEXT,
  donor_rating INTEGER CHECK (donor_rating >= 1 AND donor_rating <= 5),
  ngo_rating INTEGER CHECK (ngo_rating >= 1 AND ngo_rating <= 5),
  volunteer_rating INTEGER CHECK (volunteer_rating >= 1 AND volunteer_rating <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create analytics_summary table for dashboard stats
CREATE TABLE public.analytics_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_donations INTEGER DEFAULT 0,
  total_weight_kg DECIMAL(10, 2) DEFAULT 0,
  people_fed_estimate INTEGER DEFAULT 0,
  completed_deliveries INTEGER DEFAULT 0,
  month_year TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, month_year)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ngo_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_summary ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view all roles"
  ON public.user_roles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own role"
  ON public.user_roles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for ngo_profiles
CREATE POLICY "Anyone can view NGO profiles"
  ON public.ngo_profiles FOR SELECT
  USING (true);

CREATE POLICY "NGOs can update own profile"
  ON public.ngo_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "NGOs can insert own profile"
  ON public.ngo_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for volunteer_profiles
CREATE POLICY "Anyone can view volunteer profiles"
  ON public.volunteer_profiles FOR SELECT
  USING (true);

CREATE POLICY "Volunteers can update own profile"
  ON public.volunteer_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Volunteers can insert own profile"
  ON public.volunteer_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for donations
CREATE POLICY "Anyone can view available donations"
  ON public.donations FOR SELECT
  USING (true);

CREATE POLICY "Donors can create donations"
  ON public.donations FOR INSERT
  WITH CHECK (auth.uid() = donor_id);

CREATE POLICY "Donors and NGOs can update donations"
  ON public.donations FOR UPDATE
  USING (
    auth.uid() = donor_id OR 
    auth.uid() = accepted_by_ngo OR
    auth.uid() = assigned_volunteer
  );

-- RLS Policies for donation_requests
CREATE POLICY "Users can view related donation requests"
  ON public.donation_requests FOR SELECT
  USING (true);

CREATE POLICY "NGOs can create donation requests"
  ON public.donation_requests FOR INSERT
  WITH CHECK (auth.uid() = ngo_id);

-- RLS Policies for delivery_tracking
CREATE POLICY "Related users can view delivery tracking"
  ON public.delivery_tracking FOR SELECT
  USING (true);

CREATE POLICY "Volunteers can create tracking"
  ON public.delivery_tracking FOR INSERT
  WITH CHECK (auth.uid() = volunteer_id);

CREATE POLICY "Related users can update tracking"
  ON public.delivery_tracking FOR UPDATE
  USING (
    auth.uid() = volunteer_id OR
    auth.uid() = ngo_id
  );

-- RLS Policies for analytics_summary
CREATE POLICY "Users can view own analytics"
  ON public.analytics_summary FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics"
  ON public.analytics_summary FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_donations_updated_at
  BEFORE UPDATE ON public.donations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();