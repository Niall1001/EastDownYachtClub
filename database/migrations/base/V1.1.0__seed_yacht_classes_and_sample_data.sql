-- Seed data for East Down Yacht Club
-- Version 1.1.0 - Initial seed data
-- Created: 2025-08-08

-- Insert common yacht classes with Portsmouth Yardstick numbers
INSERT INTO yacht_classes (id, name, handicap_system) VALUES
    (uuid_generate_v4(), 'Laser', 'PY'),
    (uuid_generate_v4(), 'Laser Radial', 'PY'),
    (uuid_generate_v4(), 'Laser 4.7', 'PY'),
    (uuid_generate_v4(), 'Optimist', 'PY'),
    (uuid_generate_v4(), 'Topper', 'PY'),
    (uuid_generate_v4(), '420', 'PY'),
    (uuid_generate_v4(), '470', 'PY'),
    (uuid_generate_v4(), 'Enterprise', 'PY'),
    (uuid_generate_v4(), 'GP14', 'PY'),
    (uuid_generate_v4(), 'Mirror', 'PY'),
    (uuid_generate_v4(), 'RS Feva', 'PY'),
    (uuid_generate_v4(), 'Wayfarer', 'PY'),
    (uuid_generate_v4(), 'Finn', 'PY'),
    (uuid_generate_v4(), '49er', 'PY'),
    (uuid_generate_v4(), '29er', 'PY'),
    (uuid_generate_v4(), 'Cruiser Class 1', 'IRC'),
    (uuid_generate_v4(), 'Cruiser Class 2', 'IRC'),
    (uuid_generate_v4(), 'Cruiser Class 3', 'IRC'),
    (uuid_generate_v4(), 'Squib', 'PY'),
    (uuid_generate_v4(), 'Flying Fifteen', 'PY');

-- Insert sample events to demonstrate different event types
INSERT INTO events (id, title, description, event_type, start_date, end_date, start_time, location) VALUES
    (uuid_generate_v4(), 'Spring Regatta 2025', 'Annual spring single-day regatta featuring multiple classes', 'regatta', '2025-04-26', '2025-04-26', '10:00:00', 'East Down Yacht Club'),
    (uuid_generate_v4(), 'Summer Evening Series', 'Weekly evening racing series running through summer', 'series', '2025-05-15', '2025-08-07', '18:30:00', 'East Down Yacht Club'),
    (uuid_generate_v4(), 'Commodores Cup', 'Prestigious annual championship regatta', 'regatta', '2025-06-21', '2025-06-21', '11:00:00', 'East Down Yacht Club'),
    (uuid_generate_v4(), 'Club BBQ and Prize Giving', 'End of season social event with prize presentation', 'social', '2025-09-20', null, '17:00:00', 'East Down Yacht Club Clubhouse'),
    (uuid_generate_v4(), 'Winter Training Series', 'Winter coaching and informal racing series', 'series', '2025-10-12', '2025-03-30', '14:00:00', 'East Down Yacht Club');

-- Insert sample stories/news articles
INSERT INTO stories (id, title, excerpt, content, story_type, author_name, publish_date, tags) VALUES
    (uuid_generate_v4(), 
     'Spring Regatta 2025 - Entry Now Open', 
     'Entries are now being accepted for our annual Spring Regatta on April 26th. All classes welcome!',
     '# Spring Regatta 2025 - Entry Now Open

We are delighted to announce that entries are now open for the East Down Yacht Club Spring Regatta 2025, taking place on Saturday, April 26th.

## Event Details
- **Date**: Saturday, April 26th, 2025
- **First Race**: 10:00 AM
- **Classes**: All dinghy and cruiser classes welcome
- **Entry Fee**: £15 per boat
- **Registration Deadline**: April 24th, 11:59 PM

## Race Format
The regatta will feature up to 3 races for each class, dependent on conditions and time. Racing will be conducted using Portsmouth Yardstick handicapping for dinghy classes and IRC for cruisers.

## Prizes
Prizes will be awarded for:
- 1st, 2nd, 3rd in each class (minimum 5 boats)
- Best novice helm
- Best youth helm (under 18)

## Entry
Entry forms are available from the club office or can be downloaded from our website. Online entries will be available soon.

For more information, contact the Race Officer at races@eastdownyc.com',
     'announcement',
     'Race Committee',
     '2025-02-15 10:00:00+00',
     ARRAY['regatta', 'racing', 'spring', '2025']),
    
    (uuid_generate_v4(),
     'New Members Welcome Day Success',
     'Our recent Welcome Day for new members was a great success with 25 new sailors joining the club.',
     '# New Members Welcome Day Success

Last Saturday''s New Members Welcome Day was a fantastic success, with 25 new sailors joining the East Down Yacht Club family.

The day featured:
- Club tours and introductions to key facilities
- "Try sailing" sessions in our training fleet
- Meet and greet with club officers and experienced members  
- Information sessions on racing, cruising, and social activities

## Thank You
A huge thank you to all the volunteers who made the day possible, particularly our RYA instructors who ran the taster sessions and our galley team who provided excellent refreshments.

## New Member Benefits
All new members receive:
- Complimentary RYA Basic Skills course (worth £150)
- Free entry to first club race
- Welcome pack with club burgee and handbook
- Mentor assignment for first season

Welcome aboard to all our new members - we look forward to seeing you on the water!',
     'news',
     'Membership Secretary',
     '2025-03-10 14:30:00+00',
     ARRAY['membership', 'welcome', 'training', 'new-members']),

    (uuid_generate_v4(),
     'Winter Maintenance Working Party',
     'Join us for the annual winter maintenance working party - many hands make light work!',
     '# Winter Maintenance Working Party

The annual winter maintenance working party is scheduled for **Saturday, November 16th** starting at 9:00 AM.

## What Needs Doing?
- Boat park organization and ground maintenance
- Clubhouse interior painting
- Safety boat engine servicing
- Race mark inspection and refurbishment  
- General cleaning and tidying

## What to Bring
- Work clothes and waterproofs
- Hand tools if you have them
- Good attitude and strong coffee!

## Refreshments
The galley will be open providing bacon sandwiches, hot drinks, and soup for lunch. 

## Volunteer Hours
Remember that volunteer hours count towards reduced membership fees for the following season. This is a great opportunity to get involved and meet fellow members.

**Contact the Bosun at bosun@eastdownyc.com to volunteer or for more information.**',
     'announcement',
     'Club Bosun',
     '2025-01-20 09:00:00+00',
     ARRAY['maintenance', 'volunteer', 'winter', 'working-party']);

-- Add some sample race data for the Spring Regatta
DO $$
DECLARE
    spring_regatta_id UUID;
    laser_class_id UUID;
    laser_radial_class_id UUID;
    race_1_id UUID;
    race_2_id UUID;
BEGIN
    -- Get event and class IDs
    SELECT id INTO spring_regatta_id FROM events WHERE title = 'Spring Regatta 2025';
    SELECT id INTO laser_class_id FROM yacht_classes WHERE name = 'Laser';
    SELECT id INTO laser_radial_class_id FROM yacht_classes WHERE name = 'Laser Radial';
    
    -- Create races for Laser class
    INSERT INTO races (id, event_id, yacht_class_id, race_number, race_date, start_time)
    VALUES 
        (uuid_generate_v4(), spring_regatta_id, laser_class_id, 1, '2025-04-26', '10:00:00'),
        (uuid_generate_v4(), spring_regatta_id, laser_class_id, 2, '2025-04-26', '11:30:00'),
        (uuid_generate_v4(), spring_regatta_id, laser_class_id, 3, '2025-04-26', '13:00:00');
    
    -- Create races for Laser Radial class  
    INSERT INTO races (id, event_id, yacht_class_id, race_number, race_date, start_time)
    VALUES 
        (uuid_generate_v4(), spring_regatta_id, laser_radial_class_id, 1, '2025-04-26', '10:05:00'),
        (uuid_generate_v4(), spring_regatta_id, laser_radial_class_id, 2, '2025-04-26', '11:35:00'),
        (uuid_generate_v4(), spring_regatta_id, laser_radial_class_id, 3, '2025-04-26', '13:05:00');
END $$;

-- Create sample document attachments
DO $$
DECLARE
    spring_regatta_id UUID;
    summer_series_id UUID;
BEGIN
    SELECT id INTO spring_regatta_id FROM events WHERE title = 'Spring Regatta 2025';
    SELECT id INTO summer_series_id FROM events WHERE title = 'Summer Evening Series';
    
    INSERT INTO event_documents (event_id, document_name, document_type, file_url, mime_type)
    VALUES 
        (spring_regatta_id, 'Spring Regatta 2025 - Sailing Instructions', 'sailing_instructions', '/documents/spring-regatta-2025-sailing-instructions.pdf', 'application/pdf'),
        (spring_regatta_id, 'Spring Regatta 2025 - Entry Form', 'entry_form', '/documents/spring-regatta-2025-entry-form.pdf', 'application/pdf'),
        (spring_regatta_id, 'Notice of Race', 'notice_of_race', '/documents/spring-regatta-2025-notice-of-race.pdf', 'application/pdf'),
        (summer_series_id, 'Summer Series 2025 - Sailing Instructions', 'sailing_instructions', '/documents/summer-series-2025-sailing-instructions.pdf', 'application/pdf'),
        (summer_series_id, 'Summer Series Entry Form', 'entry_form', '/documents/summer-series-2025-entry-form.pdf', 'application/pdf');
END $$;

-- Insert performance optimization views
-- View for latest race results with yacht class information
CREATE VIEW v_latest_race_results AS
SELECT 
    rr.id,
    rr.sail_number,
    rr.yacht_name,
    rr.helm_name,
    rr.position,
    rr.points,
    r.race_number,
    r.race_date,
    yc.name as yacht_class_name,
    e.title as event_title,
    e.event_type
FROM race_results rr
JOIN races r ON rr.race_id = r.id
JOIN yacht_classes yc ON r.yacht_class_id = yc.id  
JOIN events e ON r.event_id = e.id
WHERE rr.disqualified = false 
    AND rr.dns = false 
    AND rr.dnf = false
ORDER BY r.race_date DESC, rr.position ASC;

-- View for current series standings
CREATE VIEW v_current_series_standings AS
SELECT 
    sr.sail_number,
    sr.yacht_name,
    sr.helm_name,
    sr.position,
    sr.net_points,
    sr.races_completed,
    yc.name as yacht_class_name,
    e.title as event_title,
    e.start_date,
    e.end_date
FROM series_results sr
JOIN yacht_classes yc ON sr.yacht_class_id = yc.id
JOIN events e ON sr.event_id = e.id
WHERE e.event_type = 'series'
    AND (e.end_date IS NULL OR e.end_date >= CURRENT_DATE)
ORDER BY yc.name, sr.position ASC;

-- View for published stories with event information
CREATE VIEW v_published_stories AS
SELECT 
    s.id,
    s.title,
    s.excerpt,
    s.story_type,
    s.featured_image_url,
    s.author_name,
    s.publish_date,
    s.tags,
    e.title as event_title,
    e.event_type,
    e.start_date as event_date
FROM stories s
LEFT JOIN events e ON s.event_id = e.id
ORDER BY s.publish_date DESC;

COMMENT ON VIEW v_latest_race_results IS 'Latest race results with yacht class and event information for quick queries';
COMMENT ON VIEW v_current_series_standings IS 'Current series standings for active racing series';
COMMENT ON VIEW v_published_stories IS 'All stories with optional event associations for content display';