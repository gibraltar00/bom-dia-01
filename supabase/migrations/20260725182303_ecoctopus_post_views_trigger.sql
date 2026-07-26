/*
# Add trigger to increment post views on insert

1. Functions
- `increment_post_views()` — trigger function that increments the `views` column on `community_posts` when a new row is inserted into `post_views`.
2. Triggers
- `on_post_view_insert` — AFTER INSERT trigger on `post_views` calling `increment_post_views()`.
*/

CREATE OR REPLACE FUNCTION increment_post_views()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE community_posts
  SET views = views + 1
  WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_post_view_insert ON post_views;
CREATE TRIGGER on_post_view_insert
AFTER INSERT ON post_views
FOR EACH ROW
EXECUTE FUNCTION increment_post_views();
