-- 1. Tabela de Planos (Para referência e controle de limites)
CREATE TABLE plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  arts_limit INTEGER NOT NULL,
  revisions_limit INTEGER NOT NULL,
  active_requests_limit INTEGER NOT NULL,
  priority BOOLEAN DEFAULT FALSE,
  price DECIMAL NOT NULL
);

-- 2. Tabela de Perfis (Extensão do auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  role TEXT CHECK (role IN ('client', 'admin')) DEFAULT 'client',
  plan_id TEXT REFERENCES plans(id) DEFAULT 'essencial',
  arts_used INTEGER DEFAULT 0,
  revisions_used INTEGER DEFAULT 0,
  subscription_status TEXT DEFAULT 'active',
  next_reset_date TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '30 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Tabela de Pedidos
CREATE TABLE requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('solicitado', 'em produção', 'revisão', 'finalizado')) DEFAULT 'solicitado',
  revised_count INTEGER DEFAULT 0,
  attachment_url TEXT,
  final_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Inserir Planos Iniciais
INSERT INTO plans (id, name, arts_limit, revisions_limit, active_requests_limit, priority, price) VALUES
('essencial', 'Essencial', 4, 4, 1, false, 299),
('profissional', 'Profissional', 8, 10, 2, false, 599),
('premium', 'Premium', 12, 24, 3, true, 999),
('elite', 'Elite', 12, 24, 3, true, 1499);

-- Triggers para Profile Automático (Opcional, mas recomendado)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, plan_id)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    CASE 
      WHEN new.email = 'williamgestorbr@gmail.com' THEN 'admin' 
      ELSE 'client' 
    END,
    'essencial'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
