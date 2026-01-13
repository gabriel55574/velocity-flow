-- Storage buckets for assets and approvals
INSERT INTO storage.buckets (id, name, public)
VALUES
    ('assets-public', 'assets-public', false),
    ('assets-private', 'assets-private', false),
    ('approvals', 'approvals', false)
ON CONFLICT (id) DO NOTHING;
