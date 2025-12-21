-- BREAD Clothing Store Database Schema

-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  image_url TEXT,
  images TEXT[] DEFAULT '{}',
  sizes TEXT[] DEFAULT ARRAY['S', 'M', 'L', 'XL'],
  colors TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  is_on_sale BOOLEAN DEFAULT false,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create media table for gallery/lookbook
CREATE TABLE public.media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT DEFAULT 'lookbook',
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contact_messages table
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table (for future payment integration)
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  shipping_address JSONB NOT NULL,
  items JSONB NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin users table for admin panel access
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Enable Row Level Security on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Categories policies (public read, admin write)
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage categories" 
ON public.categories FOR ALL 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Products policies (public read, admin write)
CREATE POLICY "Products are viewable by everyone" 
ON public.products FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage products" 
ON public.products FOR ALL 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Media policies (public read, admin write)
CREATE POLICY "Media is viewable by everyone" 
ON public.media FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage media" 
ON public.media FOR ALL 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Contact messages policies (anyone can submit, admin can read)
CREATE POLICY "Anyone can submit contact messages" 
ON public.contact_messages FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view contact messages" 
ON public.contact_messages FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage contact messages" 
ON public.contact_messages FOR UPDATE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Orders policies (admin only for now)
CREATE POLICY "Admins can manage orders" 
ON public.orders FOR ALL 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- User roles policies
CREATE POLICY "Users can view their own roles" 
ON public.user_roles FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage user roles" 
ON public.user_roles FOR ALL 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers for updated_at
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default categories
INSERT INTO public.categories (name, slug, description) VALUES
('T-Shirts', 't-shirts', 'Classic and graphic tees'),
('Hoodies', 'hoodies', 'Comfortable hooded sweatshirts'),
('Pants', 'pants', 'Stylish bottoms for every occasion'),
('Accessories', 'accessories', 'Complete your look'),
('Limited Edition', 'limited-edition', 'Exclusive drops and collaborations');

-- Insert sample products
INSERT INTO public.products (name, slug, description, price, original_price, category_id, image_url, sizes, colors, is_featured, is_on_sale, stock_quantity) VALUES
('BREAD Classic Tee', 'bread-classic-tee', 'The original BREAD logo tee. Soft cotton blend with pixel art design.', 35.00, NULL, (SELECT id FROM public.categories WHERE slug = 't-shirts'), 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Black', 'White', 'Red'], true, false, 100),
('Pixel Gamer Hoodie', 'pixel-gamer-hoodie', 'Oversized comfort hoodie with retro gaming graphics.', 75.00, 95.00, (SELECT id FROM public.categories WHERE slug = 'hoodies'), 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Black', 'Navy'], true, true, 50),
('8-Bit Joggers', '8-bit-joggers', 'Comfortable joggers with pixel art detailing.', 55.00, NULL, (SELECT id FROM public.categories WHERE slug = 'pants'), 'https://images.unsplash.com/photo-1552902875-9ac1f9fe0c09?w=800', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Black', 'Gray'], false, false, 75),
('Retro Console Cap', 'retro-console-cap', 'Snapback cap with embroidered retro console design.', 28.00, NULL, (SELECT id FROM public.categories WHERE slug = 'accessories'), 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800', ARRAY['One Size'], ARRAY['Black', 'White'], true, false, 120),
('Limited Drop: Player One Jacket', 'player-one-jacket', 'Exclusive varsity jacket. Limited to 100 pieces.', 150.00, NULL, (SELECT id FROM public.categories WHERE slug = 'limited-edition'), 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Black/Red'], true, false, 25),
('Glitch Logo Tee', 'glitch-logo-tee', 'Distorted BREAD logo with glitch effect print.', 38.00, 45.00, (SELECT id FROM public.categories WHERE slug = 't-shirts'), 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Black', 'Purple'], false, true, 80);

-- Insert sample media
INSERT INTO public.media (title, description, image_url, category, is_featured) VALUES
('Summer 2024 Campaign', 'Behind the scenes of our latest photoshoot', 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=1200', 'campaign', true),
('Street Style Lookbook', 'Urban fashion meets retro gaming', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200', 'lookbook', true),
('BREAD Community', 'Our amazing community wearing their favorite pieces', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200', 'community', false);
