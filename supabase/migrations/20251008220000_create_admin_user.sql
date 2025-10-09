-- Create admin user in Supabase Auth
-- This user will be able to authenticate and perform status updates

-- Insert admin user into auth.users table
-- Note: This uses pgcrypto extension for password hashing
DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Check if user already exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'adm@saquetto.com.br') THEN
    -- Generate a new UUID for the user
    admin_user_id := gen_random_uuid();

    -- Insert the user
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      admin_user_id,
      'authenticated',
      'authenticated',
      'adm@saquetto.com.br',
      crypt('S@quetto123', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{}'::jsonb,
      now(),
      now(),
      '',
      '',
      '',
      ''
    );

    -- Insert identity for the user
    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      admin_user_id,
      admin_user_id,
      jsonb_build_object('sub', admin_user_id::text, 'email', 'adm@saquetto.com.br'),
      'email',
      now(),
      now(),
      now()
    );

    RAISE NOTICE 'Admin user created successfully: adm@saquetto.com.br';
  ELSE
    RAISE NOTICE 'Admin user already exists: adm@saquetto.com.br';
  END IF;
END $$;

-- Add comment for documentation
COMMENT ON SCHEMA auth IS 'Supabase authentication schema with admin user created for fiscal audit system';
