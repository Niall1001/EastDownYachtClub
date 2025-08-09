-- Migration: Update event_type constraint to include additional event types
-- This migration adds support for 'racing', 'training', 'cruising', and 'committee' event types
-- to match the validation schema and application requirements

-- Drop the existing constraint
ALTER TABLE events DROP CONSTRAINT events_event_type_check;

-- Add the updated constraint with all supported event types
ALTER TABLE events ADD CONSTRAINT events_event_type_check 
    CHECK (event_type IN ('social', 'regatta', 'series', 'racing', 'training', 'cruising', 'committee'));

-- Add comment
COMMENT ON CONSTRAINT events_event_type_check ON events IS 'Allows all supported event types including racing, training, cruising, and committee events';