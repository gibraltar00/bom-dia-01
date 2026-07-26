-- Move "Tide Pool Cape" (🌊) from accessories_catalog to scene_items_catalog
-- so it's a scene decoration rather than a wearable pet accessory.

DELETE FROM accessories_catalog
WHERE name = 'Tide Pool Cape' AND emoji = '🌊';

-- Also remove any owned entries for that accessory
DELETE FROM owned_accessories
WHERE accessory_id IN (
  SELECT id FROM accessories_catalog WHERE name = 'Tide Pool Cape'
);

-- Add it as a scene item for the octopus
INSERT INTO scene_items_catalog (key, name, pet_key, price, emoji, scene_layer)
VALUES ('reef_wave', 'Gentle Wave', 'octopus', 35, '🌊', 'foreground')
ON CONFLICT (key) DO NOTHING;