-- Create note_type enum
CREATE TYPE public.note_type AS ENUM ('note', 'decision', 'ata');

-- Create client_notes table
CREATE TABLE public.client_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users_profile(id) ON DELETE CASCADE,
    type public.note_type NOT NULL DEFAULT 'note',
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.client_notes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view notes of their agency"
    ON public.client_notes
    FOR SELECT
    USING (agency_id = (SELECT agency_id FROM public.users_profile WHERE id = auth.uid()));

CREATE POLICY "Users can create notes in their agency"
    ON public.client_notes
    FOR INSERT
    WITH CHECK (agency_id = (SELECT agency_id FROM public.users_profile WHERE id = auth.uid()));

CREATE POLICY "Users can update their own notes"
    ON public.client_notes
    FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own notes"
    ON public.client_notes
    FOR DELETE
    USING (user_id = auth.uid());

-- Create index
CREATE INDEX idx_client_notes_client_id ON public.client_notes(client_id);
CREATE INDEX idx_client_notes_agency_id ON public.client_notes(agency_id);
