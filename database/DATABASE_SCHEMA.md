# East Down Yacht Club - Database Schema Documentation

## Overview

This document describes the database schema designed for the East Down Yacht Club website. The schema supports three main types of events (social, regatta, series) with comprehensive race management, results tracking, and content management capabilities.

## Schema Design Principles

- **Scalability**: Designed to handle growing membership and event history
- **Flexibility**: Supports different event types and racing formats
- **Performance**: Optimized with strategic indexing for common queries
- **Data Integrity**: Enforced through foreign keys and constraints
- **Extensibility**: JSON fields and metadata columns for future requirements

## Core Tables

### 1. yacht_classes
Stores different yacht classes/categories used in club racing.

**Key Features:**
- Portsmouth Yardstick (PY) and IRC handicap systems supported
- Active/inactive status for managing historical classes
- Extensible handicap system field

**Common Queries:**
```sql
-- Get all active racing classes
SELECT * FROM yacht_classes WHERE active = true ORDER BY name;

-- Get classes by handicap system
SELECT * FROM yacht_classes WHERE handicap_system = 'PY' AND active = true;
```

### 2. events
Central table for all club events (social, regatta, series).

**Event Types:**
- `social`: Non-racing events (BBQs, meetings, social gatherings)
- `regatta`: Single-day racing events with multiple races
- `series`: Multi-week racing championships

**Key Features:**
- Flexible date handling (single day or date range)
- Optional entry fees and participant limits
- Publishing and featuring flags for website display
- JSONB metadata field for event-specific data

**Common Queries:**
```sql
-- Get upcoming published events
SELECT * FROM events 
WHERE published = true AND start_date >= CURRENT_DATE 
ORDER BY start_date;

-- Get featured events
SELECT * FROM events 
WHERE published = true AND featured = true 
ORDER BY start_date;
```

### 3. races
Individual races within events, with one race per event per class per race number.

**Key Features:**
- Unique constraint ensures no duplicate race numbers per event/class
- Race status tracking (scheduled, in_progress, completed, cancelled, postponed)
- Course and conditions information
- Links to parent event and yacht class

**Common Queries:**
```sql
-- Get all races for an event
SELECT r.*, yc.name as class_name 
FROM races r
JOIN yacht_classes yc ON r.yacht_class_id = yc.id
WHERE r.event_id = $1
ORDER BY r.race_number;

-- Get today's races
SELECT r.*, e.title as event_title, yc.name as class_name
FROM races r
JOIN events e ON r.event_id = e.id
JOIN yacht_classes yc ON r.yacht_class_id = yc.id
WHERE r.race_date = CURRENT_DATE
ORDER BY r.start_time;
```

### 4. race_results
Results for individual races including timing and scoring.

**Key Features:**
- Comprehensive timing data (finish time, elapsed time, corrected time)
- Racing flags (DNS, DNF, DSQ, retired)
- Points calculation for series scoring
- Unique sail number per race constraint

**Common Queries:**
```sql
-- Get race results with positions
SELECT * FROM race_results 
WHERE race_id = $1 AND disqualified = false
ORDER BY position;

-- Get sailor's recent results
SELECT rr.*, r.race_name, e.title as event_title
FROM race_results rr
JOIN races r ON rr.race_id = r.id
JOIN events e ON r.event_id = e.id
WHERE rr.sail_number = $1
ORDER BY r.race_date DESC
LIMIT 10;
```

### 5. series_results
Cumulative results for racing series with overall standings.

**Key Features:**
- Tracks total points and discards for series scoring
- Position calculation for leaderboards
- Automatic updates from race results (via application logic)
- Unique constraint per series/class/boat

**Common Queries:**
```sql
-- Get series leaderboard
SELECT * FROM series_results
WHERE event_id = $1 AND yacht_class_id = $2
ORDER BY position;

-- Get current series standings (view)
SELECT * FROM v_current_series_standings
WHERE yacht_class_name = 'Laser'
ORDER BY position;
```

### 6. stories
Content management system for news, announcements, and race reports.

**Story Types:**
- `news`: General club news
- `announcement`: Important announcements
- `race_report`: Post-race reports and results
- `feature`: Feature articles
- `newsletter`: Newsletter content

**Key Features:**
- SEO-friendly slugs (auto-generated)
- Rich content support with excerpt
- Image gallery support (JSONB)
- Tag system for categorization
- Optional event linking
- Publishing workflow

**Common Queries:**
```sql
-- Get latest published stories
SELECT * FROM v_published_stories
ORDER BY publish_date DESC
LIMIT 10;

-- Get stories by type
SELECT * FROM stories
WHERE published = true AND story_type = 'race_report'
ORDER BY publish_date DESC;
```

### 7. event_documents
File attachments for events (sailing instructions, entry forms, results).

**Document Types:**
- `sailing_instructions`: Race sailing instructions
- `entry_form`: Event entry forms
- `notice_of_race`: Notice of race documents
- `results`: Results sheets
- `general`: Other event-related documents

**Common Queries:**
```sql
-- Get documents for an event
SELECT * FROM event_documents
WHERE event_id = $1
ORDER BY document_type, document_name;
```

## Performance Optimizations

### Strategic Indexing

The schema includes carefully designed indexes for common query patterns:

**Events:**
```sql
-- For filtering by type and date
CREATE INDEX idx_events_type_date ON events(event_type, start_date);

-- For published and featured content
CREATE INDEX idx_events_published_featured ON events(published, featured) WHERE published = true;
```

**Races:**
```sql
-- For event and class lookups
CREATE INDEX idx_races_event_class ON races(event_id, yacht_class_id);

-- For date and status queries
CREATE INDEX idx_races_date_status ON races(race_date, race_status);
```

**Stories:**
```sql
-- For content queries
CREATE INDEX idx_stories_published_date ON stories(published, publish_date) WHERE published = true;

-- For tag searching (GIN index)
CREATE INDEX idx_stories_tags ON stories USING gin(tags);
```

### Optimized Views

Three materialized-style views provide optimized access to common data:

1. **v_latest_race_results**: Recent race results with class and event info
2. **v_current_series_standings**: Active series leaderboards
3. **v_published_stories**: Published content with event associations

## Business Rules Implementation

### Event Types and Racing Logic

**Social Events:**
- No races associated
- Simple event information
- Optional document attachments

**Regatta Events:**
- Multiple races per class on single day
- Each class can have multiple races (race_number 1, 2, 3, etc.)
- Results tracked per individual race

**Series Events:**
- Multiple races spanning weeks/months
- Series_results table maintains overall standings
- Points accumulate across races with discard rules

### Data Integrity Constraints

```sql
-- Event types
CHECK (event_type IN ('social', 'regatta', 'series'))

-- Race status
CHECK (race_status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'postponed'))

-- Story types
CHECK (story_type IN ('news', 'announcement', 'race_report', 'feature', 'newsletter'))

-- Unique race numbers per event/class
UNIQUE(event_id, yacht_class_id, race_number)

-- Unique sail numbers per race
UNIQUE(race_id, sail_number)
```

## Migration Strategy

Migrations are located in `/database/migrations/base/` and follow the Flyway naming convention:

- `V1.0.0__create_yacht_club_schema.sql` - Initial schema creation
- `V1.1.0__seed_yacht_classes_and_sample_data.sql` - Reference data and samples

### Running Migrations

Follow the instructions in `/database/instructions.md`:

```bash
# Bring up database
docker compose up --build -d

# Pull schema from database to Prisma
cd server
npx prisma db pull
npx prisma generate
```

## Sample Data

The seed migration includes:

- **20 Yacht Classes**: Common dinghy and cruiser classes with PY/IRC handicaps
- **5 Sample Events**: Mix of social, regatta, and series events
- **3 News Stories**: Different content types with realistic content
- **Race Schedule**: Sample races for Spring Regatta 2025
- **Event Documents**: Sample sailing instructions and entry forms

## Query Performance Examples

### Common Query Patterns with Execution Plans

**Get Event Listing (Most Common):**
```sql
EXPLAIN ANALYZE
SELECT e.*, COUNT(r.id) as race_count
FROM events e
LEFT JOIN races r ON e.id = r.event_id
WHERE e.published = true 
    AND e.start_date >= CURRENT_DATE
GROUP BY e.id
ORDER BY e.start_date
LIMIT 10;
```
*Uses: idx_events_published_featured, idx_races_event_class*

**Get Series Standings:**
```sql
EXPLAIN ANALYZE
SELECT sr.*, yc.name as class_name
FROM series_results sr
JOIN yacht_classes yc ON sr.yacht_class_id = yc.id
WHERE sr.event_id = $1
ORDER BY sr.yacht_class_id, sr.position;
```
*Uses: idx_series_results_event_class, idx_series_results_position*

**Content Search:**
```sql
EXPLAIN ANALYZE
SELECT * FROM stories
WHERE published = true 
    AND 'racing' = ANY(tags)
    AND publish_date >= (CURRENT_DATE - INTERVAL '30 days')
ORDER BY publish_date DESC;
```
*Uses: idx_stories_tags (GIN), idx_stories_published_date*

## Scaling Considerations

### Current Capacity
- **Events**: 1000s of events over decades
- **Races**: 10,000s of individual races
- **Results**: 100,000s of individual race results
- **Stories**: 1000s of news articles and reports

### Future Enhancements
- **Partitioning**: Consider partitioning race_results by year for very large clubs
- **Caching**: Use Redis for frequently accessed series standings
- **Read Replicas**: Consider read replicas for reporting queries
- **Archival**: Implement archival strategy for very old race data

### Monitoring Queries

**Slow Query Detection:**
```sql
-- Find slowest queries (PostgreSQL)
SELECT query, mean_time, calls, total_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

**Index Usage:**
```sql
-- Check index utilization
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

**Table Size Monitoring:**
```sql
-- Monitor table growth
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
    pg_total_relation_size(schemaname||'.'||tablename) as size_bytes
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY size_bytes DESC;
```

## API Integration Examples

The schema is designed to work efficiently with modern web APIs. Here are some example queries that would be commonly used:

### REST API Endpoints

**GET /api/events** - Event listing with race counts:
```sql
SELECT 
    e.*,
    COUNT(r.id) as race_count,
    COUNT(CASE WHEN r.race_status = 'completed' THEN 1 END) as completed_races
FROM events e
LEFT JOIN races r ON e.id = r.event_id
WHERE e.published = true
GROUP BY e.id
ORDER BY e.start_date DESC;
```

**GET /api/events/{id}/results** - Event results summary:
```sql
SELECT 
    yc.name as class_name,
    COUNT(DISTINCT r.id) as total_races,
    COUNT(DISTINCT rr.sail_number) as participants
FROM events e
JOIN races r ON e.id = r.event_id
JOIN yacht_classes yc ON r.yacht_class_id = yc.id
LEFT JOIN race_results rr ON r.id = rr.race_id
WHERE e.id = $1
GROUP BY yc.id, yc.name
ORDER BY yc.name;
```

This schema provides a solid foundation for a modern yacht club website with room for future enhancements and excellent query performance.