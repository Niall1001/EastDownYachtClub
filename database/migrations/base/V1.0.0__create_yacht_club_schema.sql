-- East Down Yacht Club Database Schema
-- Version 1.0.0 - Initial schema creation
-- Created: 2025-08-08

-- Enable UUID extension for PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: yacht_classes
-- Stores different yacht classes used in racing
CREATE TABLE yacht_classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    handicap_system VARCHAR(50), -- e.g., 'PY', 'IRC', 'ORC'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: events
-- Stores all yacht club events (social, regatta, series)
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    event_type VARCHAR(20) NOT NULL CHECK (event_type IN ('social', 'regatta', 'series')),
    start_date DATE NOT NULL,
    end_date DATE,
    start_time TIME,
    location VARCHAR(200),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: races
-- Stores individual races within events
CREATE TABLE races (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    yacht_class_id UUID NOT NULL REFERENCES yacht_classes(id) ON DELETE RESTRICT,
    race_number INTEGER NOT NULL DEFAULT 1,
    race_date DATE NOT NULL,
    start_time TIME,
    wind_direction VARCHAR(100),
    wind_speed INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure unique race numbers within an event for each class
    UNIQUE(event_id, yacht_class_id, race_number)
);

-- Table: race_results
-- Stores results for individual races
CREATE TABLE race_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    race_id UUID NOT NULL REFERENCES races(id) ON DELETE CASCADE,
    sail_number VARCHAR(20) NOT NULL,
    yacht_name VARCHAR(100),
    helm_name VARCHAR(100),
    crew_names TEXT, -- JSON array or comma-separated string
    finish_time TIME,
    elapsed_time INTERVAL,
    corrected_time INTERVAL,
    position INTEGER,
    points INTEGER,
    disqualified BOOLEAN DEFAULT false,
    dns BOOLEAN DEFAULT false, -- Did Not Start
    dnf BOOLEAN DEFAULT false, -- Did Not Finish
    retired BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure unique sail numbers per race
    UNIQUE(race_id, sail_number)
);

-- Table: series_results
-- Stores cumulative results for series events
CREATE TABLE series_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    yacht_class_id UUID NOT NULL REFERENCES yacht_classes(id) ON DELETE RESTRICT,
    sail_number VARCHAR(20) NOT NULL,
    yacht_name VARCHAR(100),
    helm_name VARCHAR(100),
    crew_names TEXT,
    races_completed INTEGER DEFAULT 0,
    total_points INTEGER DEFAULT 0,
    discards_applied INTEGER DEFAULT 0,
    net_points INTEGER DEFAULT 0,
    position INTEGER,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure unique entries per series event and class
    UNIQUE(event_id, yacht_class_id, sail_number)
);

-- Table: stories
-- Content management for news, articles, and announcements
CREATE TABLE stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(300) NOT NULL,
    slug VARCHAR(300) UNIQUE, -- URL-friendly slug derived from title
    excerpt TEXT,
    content TEXT NOT NULL,
    story_type VARCHAR(20) DEFAULT 'news' CHECK (story_type IN ('news', 'announcement', 'race_report', 'feature', 'newsletter')),
    featured_image_url TEXT,
    gallery_images JSONB, -- Array of image URLs
    author_name VARCHAR(100),
    published BOOLEAN DEFAULT false,
    publish_date TIMESTAMP WITH TIME ZONE,
    event_id UUID REFERENCES events(id) ON DELETE SET NULL, -- Optional link to related event
    tags TEXT[], -- Array of tags
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: event_documents
-- File attachments for events (entry forms, sailing instructions, etc.)
CREATE TABLE event_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    document_name VARCHAR(200) NOT NULL,
    document_type VARCHAR(50), -- e.g., 'sailing_instructions', 'entry_form', 'results'
    file_url TEXT NOT NULL,
    file_size_bytes INTEGER,
    mime_type VARCHAR(100),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance optimization
-- Events indexes
CREATE INDEX idx_events_type_date ON events(event_type, start_date);
CREATE INDEX idx_events_date_range ON events(start_date, end_date);

-- Races indexes
CREATE INDEX idx_races_event_class ON races(event_id, yacht_class_id);
CREATE INDEX idx_races_class_date ON races(yacht_class_id, race_date);

-- Race results indexes
CREATE INDEX idx_race_results_race_position ON race_results(race_id, position);
CREATE INDEX idx_race_results_sail_number ON race_results(sail_number);
CREATE INDEX idx_race_results_helm ON race_results(helm_name);

-- Series results indexes
CREATE INDEX idx_series_results_event_class ON series_results(event_id, yacht_class_id);
CREATE INDEX idx_series_results_position ON series_results(event_id, yacht_class_id, position);
CREATE INDEX idx_series_results_sail_number ON series_results(sail_number);

-- Stories indexes
CREATE INDEX idx_stories_publish_date ON stories(publish_date);
CREATE INDEX idx_stories_type ON stories(story_type);
CREATE INDEX idx_stories_tags ON stories USING gin(tags);
CREATE INDEX idx_stories_event ON stories(event_id) WHERE event_id IS NOT NULL;

-- Yacht classes indexes
CREATE INDEX idx_yacht_classes_handicap ON yacht_classes(handicap_system);

-- Event documents indexes
CREATE INDEX idx_event_documents_event ON event_documents(event_id);
CREATE INDEX idx_event_documents_type ON event_documents(document_type);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_yacht_classes_updated_at BEFORE UPDATE ON yacht_classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_races_updated_at BEFORE UPDATE ON races FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_race_results_updated_at BEFORE UPDATE ON race_results FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stories_updated_at BEFORE UPDATE ON stories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to generate story slugs
CREATE OR REPLACE FUNCTION generate_story_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug = lower(regexp_replace(regexp_replace(NEW.title, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));
        
        -- Ensure uniqueness by appending number if needed
        WHILE EXISTS (SELECT 1 FROM stories WHERE slug = NEW.slug AND id != COALESCE(NEW.id, uuid_generate_v4())) LOOP
            NEW.slug = NEW.slug || '-' || extract(epoch from now())::integer;
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for story slug generation
CREATE TRIGGER generate_story_slug_trigger BEFORE INSERT OR UPDATE ON stories FOR EACH ROW EXECUTE FUNCTION generate_story_slug();

-- Add comments for documentation
COMMENT ON TABLE yacht_classes IS 'Different yacht classes/categories used in club racing';
COMMENT ON TABLE events IS 'All club events including social events, regattas, and racing series';
COMMENT ON TABLE races IS 'Individual races within events, one per event per class per race number';
COMMENT ON TABLE race_results IS 'Results for individual races including timing and positions';
COMMENT ON TABLE series_results IS 'Cumulative results for racing series with overall standings';
COMMENT ON TABLE stories IS 'Content management for news, announcements, and race reports';
COMMENT ON TABLE event_documents IS 'File attachments associated with events';

COMMENT ON COLUMN events.event_type IS 'Type of event: social (social events), regatta (single day racing), series (multi-race championship)';
COMMENT ON COLUMN race_results.points IS 'Points awarded based on finishing position and scoring system';
COMMENT ON COLUMN series_results.net_points IS 'Total points minus discards for series scoring';
COMMENT ON COLUMN stories.story_type IS 'Type of content: news, announcement, race_report, feature, newsletter';