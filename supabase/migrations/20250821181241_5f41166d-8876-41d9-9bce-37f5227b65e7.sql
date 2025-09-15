-- Insert the admin user directly (bypasses RLS)
INSERT INTO users (email, password_hash, active) 
VALUES ('adm@saquetto.com.br', 'S@quetto123', true);

-- Add a policy to allow INSERT operations for new users
-- This allows the first admin to create other users if needed
CREATE POLICY "Allow INSERT for new users" ON public.users
FOR INSERT 
WITH CHECK (true);