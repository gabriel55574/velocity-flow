-- Add asset_status enum to align with PDR (missing/uploaded/validated)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'asset_status') THEN
        CREATE TYPE public.asset_status AS ENUM ('missing', 'uploaded', 'validated');
    END IF;
END$$;

-- Add status column with default
ALTER TABLE public.assets
    ADD COLUMN IF NOT EXISTS status public.asset_status DEFAULT 'missing';

-- Simple index for filtering by status
CREATE INDEX IF NOT EXISTS idx_assets_status ON public.assets(status);
