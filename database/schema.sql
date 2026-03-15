-- SCM Medical AI Suite - Database Schema
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. Enable required extensions
-- ============================================
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================
-- 2. User Profiles (extends Supabase Auth)
-- ============================================
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'sales' CHECK (role IN ('sales', 'compliance', 'admin')),
  department TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own profile" 
  ON user_profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON user_profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'sales')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 3. Products Table
-- ============================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  model TEXT UNIQUE NOT NULL,
  category TEXT,
  description TEXT,
  specifications JSONB DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  needle_size TEXT,
  connection_type TEXT,
  packaging TEXT,
  equivalent_to TEXT[] DEFAULT '{}',
  applications TEXT[] DEFAULT '{}',
  materials TEXT[] DEFAULT '{}',
  sterility TEXT,
  standards TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products" 
  ON products FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Only admins can modify products" 
  ON products FOR ALL 
  TO authenticated 
  USING (EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- ============================================
-- 4. Certifications Table
-- ============================================
CREATE TABLE certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT REFERENCES products(model) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('CE', 'FDA', 'ISO13485', 'MDD', 'MDR')),
  number TEXT NOT NULL,
  issued_by TEXT,
  issue_date DATE,
  expiry_date DATE,
  status TEXT DEFAULT 'valid' CHECK (status IN ('valid', 'expired', 'pending')),
  scope TEXT,
  document_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view certifications" 
  ON certifications FOR SELECT 
  TO authenticated 
  USING (true);

-- ============================================
-- 5. Documents Table
-- ============================================
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('datasheet', 'ifu', 'certificate', 'doc', 'label', 'other')),
  size TEXT,
  pages INTEGER,
  storage_path TEXT,
  parsed_content JSONB,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'parsed', 'error')),
  uploaded_by UUID REFERENCES auth.users(id),
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view documents" 
  ON documents FOR SELECT 
  TO authenticated 
  USING (true);

-- ============================================
-- 6. Competitor Products Table
-- ============================================
CREATE TABLE competitor_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competitor_name TEXT NOT NULL,
  product_name TEXT NOT NULL,
  model TEXT NOT NULL,
  category TEXT,
  specifications JSONB DEFAULT '{}',
  equivalent_model TEXT,
  equivalent_product_id UUID REFERENCES products(id),
  differences TEXT[] DEFAULT '{}',
  advantages TEXT[] DEFAULT '{}',
  disadvantages TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE competitor_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view competitors" 
  ON competitor_products FOR SELECT 
  TO authenticated 
  USING (true);

-- ============================================
-- 7. Market Registrations Table
-- ============================================
CREATE TABLE market_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  region TEXT NOT NULL,
  country TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('registered', 'pending', 'not_required', 'blocked')),
  registration_number TEXT,
  registration_date DATE,
  expiry_date DATE,
  requirements TEXT[] DEFAULT '{}',
  required_documents TEXT[] DEFAULT '{}',
  distributor TEXT,
  distributor_contact TEXT,
  notes TEXT,
  timeline TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE market_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view registrations" 
  ON market_registrations FOR SELECT 
  TO authenticated 
  USING (true);

-- ============================================
-- 8. Chat History Table (per user)
-- ============================================
CREATE TABLE chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  module TEXT NOT NULL CHECK (module IN ('sales', 'compliance')),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  citations JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only view their own history" 
  ON chat_history FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own history" 
  ON chat_history FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own history" 
  ON chat_history FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- ============================================
-- 9. Document Embeddings (for AI search)
-- ============================================
CREATE TABLE document_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  content_chunk TEXT NOT NULL,
  embedding vector(1536),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE document_embeddings ENABLE ROW LEVEL SECURITY;

-- Vector similarity search function
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  product_filter uuid DEFAULT NULL
)
RETURNS TABLE(
  id uuid,
  document_id uuid,
  content_chunk text,
  similarity float,
  metadata jsonb
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT
    de.id,
    de.document_id,
    de.content_chunk,
    1 - (de.embedding <=> query_embedding) AS similarity,
    de.metadata
  FROM document_embeddings de
  JOIN documents d ON d.id = de.document_id
  WHERE 
    1 - (de.embedding <=> query_embedding) > match_threshold
    AND (product_filter IS NULL OR d.product_id = product_filter)
  ORDER BY de.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- ============================================
-- 10. Indexes for performance
-- ============================================
CREATE INDEX idx_products_model ON products(model);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_search ON products USING gin(to_tsvector('english', name || ' ' || COALESCE(model, '') || ' ' || COALESCE(description, '')));

CREATE INDEX idx_certifications_product ON certifications(product_id);
CREATE INDEX idx_certifications_status ON certifications(status);

CREATE INDEX idx_documents_product ON documents(product_id);
CREATE INDEX idx_documents_status ON documents(status);

CREATE INDEX idx_market_registrations_product ON market_registrations(product_id);
CREATE INDEX idx_market_registrations_country ON market_registrations(country);

CREATE INDEX idx_chat_history_user ON chat_history(user_id);
CREATE INDEX idx_chat_history_created ON chat_history(created_at DESC);

CREATE INDEX ON document_embeddings USING ivfflat (embedding vector_cosine_ops);

-- ============================================
-- 11. Storage Bucket Setup (run in Supabase UI)
-- ============================================
-- Create a bucket named 'documents' in Supabase Storage
-- Set it as Public bucket for file access
