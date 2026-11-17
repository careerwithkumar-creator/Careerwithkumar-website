-- Apply separately before 0007: enum values require a committed transaction.
alter type public.job_category add value if not exists 'apprenticeship';
