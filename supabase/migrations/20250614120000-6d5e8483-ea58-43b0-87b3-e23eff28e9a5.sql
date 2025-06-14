-- Function to fetch a single random demo task
CREATE OR REPLACE FUNCTION public.get_random_demo_task()
RETURNS SETOF public.demo_tasks
LANGUAGE sql AS $$
    SELECT * FROM public.demo_tasks ORDER BY random() LIMIT 1;
$$;
