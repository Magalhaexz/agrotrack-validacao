create table if not exists public.app_validation_responses (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  works_with_beef text,
  role text,
  current_control text[],
  hardest_info text,
  decision_frequency text,
  financial_visibility text,
  financial_impact text,
  main_difficulty text,
  solution_utility text,
  most_valuable_feature text,
  must_have_features text,
  would_test text,
  usage_frequency text,
  would_pay text,
  price_range text,
  validation_score integer,
  score_label text
);

alter table public.app_validation_responses enable row level security;

create policy "allow public insert responses"
on public.app_validation_responses
for insert
to anon
with check (true);

create policy "allow authenticated read responses"
on public.app_validation_responses
for select
to authenticated
using (true);

create or replace view public.app_validation_summary as
select
  count(*) as total_responses,
  avg(validation_score)::numeric(10,2) as avg_score,
  count(*) filter (where would_test = 'Sim') as total_would_test_yes,
  count(*) filter (where would_pay = 'Sim') as total_would_pay_yes,
  count(*) filter (where solution_utility in ('Útil', 'Muito útil')) as total_useful,
  count(*) filter (where decision_frequency in ('Às vezes', 'Frequentemente', 'Sempre')) as total_real_pain
from public.app_validation_responses;
