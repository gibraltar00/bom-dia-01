-- Remove accessory system entirely (security: RLS policies were incomplete/incorrect,
-- and the feature is being removed from the game).
DROP TABLE IF EXISTS owned_accessories CASCADE;
DROP TABLE IF EXISTS accessories_catalog CASCADE;
