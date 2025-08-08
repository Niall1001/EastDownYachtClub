import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Clock, Facebook, Twitter, Mail } from 'lucide-react';

interface Story {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  date: string;
  image: string;
}

const StoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Sample stories data - in a real app, this would come from API/database
  const stories: Story[] = [
    {
      id: 1,
      title: 'East Down Yacht Club Hosts Successful Strangford Lough Regatta',
      excerpt: "This year's Strangford Lough Regatta was a tremendous success with record participation and perfect sailing conditions throughout the weekend. Over 50 boats competed across multiple classes.",
      content: `This year's Strangford Lough Regatta was a tremendous success with record participation and perfect sailing conditions throughout the weekend. Over 50 boats competed across multiple classes, with sailors traveling from across Ireland to participate in one of the most anticipated events in the Northern Irish sailing calendar.

The event kicked off on Saturday morning with a skipper's briefing at 9:00 AM, where Race Officer Jennifer Clark outlined the racing schedule and safety protocols. The first race started promptly at 11:00 AM with perfect conditions - a steady 15-knot breeze from the southwest and bright sunshine.

Throughout Saturday, three races were completed across all classes. The competitive IRC class saw some exceptional sailing, with close battles between several well-matched boats. The family cruiser category was equally exciting, with multiple lead changes throughout the day.

Sunday brought slightly lighter winds, but the racing remained competitive. Two additional races were completed before the final prize-giving ceremony at the clubhouse. The atmosphere throughout the weekend was fantastic, with both competitors and spectators enjoying the excellent facilities and hospitality that East Down Yacht Club is known for.

In the competitive IRC class, 'Sea Wolf' skippered by John McDowell from Royal North of Ireland Yacht Club took top honors with a series of consistent performances. The family cruiser category was won by 'Blue Jay' with the Henderson family at the helm, demonstrating that sailing truly is a sport for all ages.

The success of this year's regatta is a testament to the hard work of all the volunteers who made the event possible. From the race committee to the galley staff, everyone contributed to making this weekend memorable for all participants.

We're already looking forward to next year's regatta, which promises to be even bigger and better. Thank you to all who participated and supported this fantastic event.`,
      date: 'August 15, 2023',
      author: 'Sarah Thompson',
      category: 'Racing',
      image: 'https://images.unsplash.com/photo-1565194481104-39d1ee1b8bcc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 2,
      title: 'New Training Courses Announced for Spring Season',
      excerpt: "We're excited to announce our spring training schedule, featuring courses for all skill levels from beginners to advanced racers.",
      content: `We're excited to announce our comprehensive spring training schedule for the upcoming season, featuring an expanded range of courses designed to cater for all skill levels from complete beginners to experienced racers looking to hone their skills.

Our RYA-qualified instructors have developed a progressive training program that focuses on both practical sailing skills and essential safety knowledge. The courses are designed to be both educational and enjoyable, with plenty of hands-on time on the water.

**Beginner Courses:**
Starting with our popular 'Learn to Sail' weekends, perfect for those who have never set foot on a boat before. These two-day courses cover all the basics including boat handling, safety procedures, and basic sailing theory. All equipment is provided, and no previous experience is necessary.

**Intermediate Development:**
For those who already have some sailing experience, our Intermediate courses focus on improving boat handling skills, racing techniques, and navigation. These courses are ideal for sailors looking to participate in club racing or take their sailing to the next level.

**Advanced Racing Programs:**
Our advanced courses are designed for experienced sailors who want to compete at a higher level. These intensive programs cover race tactics, advanced boat handling, weather routing, and crew coordination. Led by our most experienced instructors, these courses have helped many of our members achieve success in regional and national competitions.

**Youth Training:**
We're particularly proud of our youth training programs, which have produced several national champions over the years. Our junior courses are specifically tailored for young sailors aged 8-16, with smaller boats and age-appropriate instruction methods.

**Safety and Powerboat Courses:**
In addition to sailing courses, we also offer RYA Powerboat Level 2 courses and Safety Boat courses. These are essential for anyone looking to help with race support or simply wanting to be more confident around boats and water.

All courses can be booked through our website or by calling the club office. Early booking is recommended as these courses are always popular and tend to fill up quickly. We look forward to welcoming both new and returning students to our training programs this season.`,
      date: 'August 10, 2023',
      author: 'Michael O\'Brien',
      category: 'Training',
      image: 'https://images.unsplash.com/photo-1534438097545-a2c22c57f2ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 3,
      title: 'Clubhouse Renovation Complete',
      excerpt: 'After months of work, our clubhouse renovation is finally complete. Come join us for the grand reopening celebration.',
      content: `After six months of intensive renovation work, we are delighted to announce that our clubhouse refurbishment is now complete. The project, which began in February, has transformed our facilities into a modern, welcoming space that better serves our members and visitors.

The renovation project was comprehensive, touching every aspect of the clubhouse interior and exterior. The main bar and lounge area has been completely redesigned with new furnishing, lighting, and decor that reflects our maritime heritage while providing a contemporary feel.

**Key Improvements:**

The kitchen facilities have been completely modernized with new commercial-grade equipment, allowing us to expand our catering capabilities for events and regular dining service. The new kitchen layout improves efficiency and food safety standards.

The meeting rooms have been updated with modern audio-visual equipment, making them perfect for presentations, training sessions, and committee meetings. The new flexible seating arrangements can accommodate groups of various sizes.

Perhaps most importantly, we've significantly improved accessibility throughout the building. New ramps, wider doorways, and an accessible bathroom ensure that all members and visitors can enjoy our facilities regardless of mobility.

The exterior work included repainting in our traditional colors, new windows throughout, and landscaping improvements that enhance the club's waterfront setting. The new outdoor seating area provides spectacular views across Strangford Lough.

**Grand Reopening Celebration:**

We're planning a special grand reopening celebration on Saturday, September 2nd, starting at 6:00 PM. The evening will include a welcome reception, guided tours of the renovated facilities, and live music from local band "The Tidewaters."

All members, their families, and friends are warmly invited to join us for this special occasion. Light refreshments will be provided, and the bar will be open with special celebration prices on selected drinks.

The renovation project was funded through a combination of club reserves, member donations, and grants from local development agencies. We're grateful to everyone who contributed to making this project possible, particularly the renovation committee who oversaw the project from start to finish.

We believe these improvements will serve the club well for many years to come and help us continue to grow our membership and activities. We look forward to seeing you all at the grand reopening celebration.`,
      date: 'August 5, 2023',
      author: 'Committee',
      category: 'Club News',
      image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 4,
      title: 'Junior Sailors Shine at Regional Championships',
      excerpt: 'Our junior sailing team brought home multiple trophies from the Regional Youth Championships held last weekend.',
      content: `Our junior sailing team has made the club incredibly proud by bringing home multiple trophies from the Regional Youth Championships held at Carrickfergus Sailing Club last weekend. The results demonstrate the excellent standard of youth training at East Down Yacht Club and the dedication of our young sailors.

The championships attracted over 80 young sailors from clubs across Northern Ireland, competing in Optimist, Laser 4.7, and RS Feva classes. Our team of twelve young sailors, ranging in age from 10 to 16, competed with skill and sportsmanship throughout the two-day event.

**Outstanding Results:**

In the Optimist class, Emma Wilson (age 12) sailed brilliantly to claim first place overall, winning three of the six races. Her consistent performance and tactical sailing impressed the race officials and competitors alike. This victory qualifies Emma for the Irish Optimist National Championships later this year.

James Murphy (age 14) finished second in the highly competitive Laser 4.7 fleet, demonstrating the advanced sailing skills he's developed through our youth training program. James showed particular strength in the stronger winds on Sunday, moving up from fifth place to claim his silver medal position.

Our RS Feva team of siblings Katie and Tom Henderson secured third place in their double-handed class, showing excellent crew coordination and boat handling throughout the challenging conditions.

**Team Spirit and Development:**

What impressed our coaches most wasn't just the results, but the way our young sailors supported each other throughout the weekend. They shared knowledge about local conditions, helped with boat preparation, and celebrated each other's successes.

The success of our junior program is built on excellent coaching, regular training sessions, and strong support from parents and the wider club community. Our qualified instructors work with the young sailors every Saturday throughout the season, focusing on both sailing skills and racing tactics.

**Looking Ahead:**

These results set us up well for the remainder of the sailing season. Several of our junior sailors will now progress to compete at national level events, representing not just East Down Yacht Club but Northern Ireland sailing as a whole.

We're also pleased to announce that our junior training program has been selected as a case study by the RYA for youth development best practices, reflecting the high standard of coaching and facilities we provide.

Congratulations to all our junior sailors, coaches, and the supportive parents who make our youth program such a success. The future of sailing at East Down Yacht Club is in very capable hands.`,
      date: 'July 28, 2023',
      author: 'David Chen',
      category: 'Racing',
      image: 'https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 5,
      title: "Annual Commodore's Dinner Set for September",
      excerpt: "Join us for our annual Commodore's Dinner, a celebration of the season's achievements and camaraderie.",
      content: `We are delighted to announce that our Annual Commodore's Dinner will take place on Saturday, September 16th, in the newly renovated clubhouse. This prestigious event marks the highlight of our social calendar and provides an opportunity to celebrate the achievements of the past sailing season while enjoying an evening of fine dining and fellowship.

The Commodore's Dinner is a long-standing tradition at East Down Yacht Club, dating back to 1952. It brings together members, their partners, and special guests for an elegant evening that combines formal dining with the presentation of annual awards and recognition of outstanding contributions to the club.

**Evening Program:**

The evening will commence at 7:00 PM with a champagne reception in the main lounge, providing an opportunity for members to socialize and admire the newly renovated facilities. The reception will feature a selection of canapés prepared by our talented kitchen team.

Dinner will be served at 8:00 PM in the main dining hall, which has been specially decorated for the occasion. This year's menu has been carefully crafted by our head chef and features the finest local ingredients, including fresh seafood from Strangford Lough and locally sourced lamb.

**Awards Ceremony:**

The evening's centerpiece will be the annual awards presentation, recognizing outstanding achievements in racing, contributions to club life, and service to the sailing community. Awards to be presented include:

- The Commodore's Cup for the most improved sailor
- The Seamanship Award for outstanding boat handling and safety
- The Community Spirit Award for volunteer service
- Class championship trophies from the season's racing program
- Long service awards for members celebrating significant milestones

**Guest Speaker:**

We are honored to welcome renowned sailor and Olympic medalist Sarah Ayton as our guest speaker. Sarah will share insights from her competitive sailing career, including her gold medal performance at the 2008 Beijing Olympics in the Yngling class.

**Dress Code and Reservations:**

The dress code for the evening is formal - black tie for gentlemen and evening dress for ladies. This maintains the traditional elegance of the event while creating a special atmosphere that distinguishes it from our regular social gatherings.

Reservations are essential and can be made through the club office or online booking system. The ticket price includes the champagne reception, three-course dinner, wine, and coffee service. Early booking is recommended as this event consistently sells out.

**Transport Arrangements:**

Given the formal nature of the evening and to ensure everyone can fully enjoy the festivities, we have arranged for a shuttle bus service from Downpatrick town center. Details of pickup times and locations will be provided with ticket confirmations.

The Commodore's Dinner represents the very best of East Down Yacht Club's traditions and community spirit. We look forward to seeing members dressed in their finest, celebrating another successful season, and looking ahead to the adventures that await us in the year ahead.`,
      date: 'July 20, 2023',
      author: 'Social Committee',
      category: 'Social',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 6,
      title: 'Safety Equipment Inspection Day Scheduled',
      excerpt: 'Ensure your boat is ready for the season with our comprehensive safety equipment inspection day.',
      content: `East Down Yacht Club is pleased to announce our annual Safety Equipment Inspection Day, scheduled for Saturday, August 19th from 9:00 AM to 4:00 PM. This important event helps ensure that all member boats meet current safety standards and are properly equipped for a safe sailing season.

The inspection day is organized in partnership with local maritime safety experts and RYA-qualified inspectors who will examine your boat's safety equipment thoroughly and provide valuable advice on best practices for onboard safety.

**What Will Be Inspected:**

Our qualified inspectors will examine all essential safety equipment including life jackets, flares, fire extinguishers, first aid kits, and emergency communication devices. They will check expiry dates, equipment condition, and ensure everything meets current regulations.

Special attention will be given to lifejacket inspection, as these are your most important safety devices. Inspectors will check for damage, test inflation mechanisms on automatic lifejackets, and ensure that all family members have properly fitted equipment.

Navigation equipment including charts, GPS systems, and backup communication devices will also be reviewed. With increasing reliance on electronic navigation, it's important to maintain paper chart backups and ensure all systems are functioning correctly.

**Expert Advice Available:**

In addition to formal inspections, this is an excellent opportunity to seek advice from experienced mariners about safety best practices. Our inspectors can provide guidance on:

- Seasonal maintenance schedules for safety equipment
- Latest developments in personal safety devices
- Emergency procedures and preparation
- Weather awareness and passage planning
- MOB (Man Overboard) prevention and recovery techniques

**Free Services:**

The inspection service is provided free of charge to all club members as part of our commitment to promoting safe sailing practices. However, any equipment that needs replacement or updating will be at the member's own cost.

We have arranged special member discounts with local chandlery suppliers who will be present on the day with replacement equipment. This provides a convenient opportunity to update expired items immediately.

**Booking Your Inspection:**

To ensure efficient service and minimize waiting times, we recommend booking your inspection slot in advance through the club office. Inspections typically take 30-45 minutes per boat, depending on size and equipment levels.

Please bring your boat's safety inventory checklist if you have one, along with any documentation for electronic equipment. If you're unsure about what safety equipment your boat should carry, our inspectors can advise based on your typical sailing activities and boat size.

**New Member Education:**

For new members or those new to boat ownership, we're also offering brief safety briefings throughout the day. These 15-minute sessions cover essential safety knowledge including VHF radio procedures, distress signal protocols, and basic emergency response.

Safety at sea is everyone's responsibility, and proper equipment is your first line of defense against emergencies. We encourage all members to take advantage of this valuable service and ensure their boats are ready for safe and enjoyable sailing throughout the season.

The inspection day reflects our club's commitment to the highest safety standards and our responsibility to promote safe sailing practices within our community. We look forward to seeing you there.`,
      date: 'July 15, 2023',
      author: 'Safety Committee',
      category: 'Announcements',
      image: 'https://images.unsplash.com/photo-1500627965408-b5f2c5f9168a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 7,
      title: 'New Committee Members Elected',
      excerpt: "We're pleased to announce the results of our recent committee elections. Meet the team who will lead the club forward.",
      content: `Following our Annual General Meeting held on July 8th, we are pleased to announce the results of our committee elections. The new committee represents a blend of experienced leadership and fresh perspectives that will guide East Down Yacht Club through the coming year.

The election process saw strong engagement from the membership, with several contested positions reflecting the healthy democratic processes within our club. We thank all members who stood for election and those who participated in the voting process.

**Executive Committee Results:**

**Commodore:** James Wilson has been re-elected for a second term as Commodore. James brings extensive sailing experience and strong leadership skills, having guided the club through the successful clubhouse renovation project. His vision for the club's continued growth and development resonated strongly with members.

**Vice Commodore:** We welcome Elizabeth Hughes to the role of Vice Commodore. Elizabeth brings valuable experience from her previous role as Sailing Secretary and has been instrumental in developing our training programs. She will work closely with the Commodore to implement the club's strategic initiatives.

**Rear Commodore:** Robert Thompson continues in his role as Rear Commodore, providing continuity in club operations. Robert's attention to detail and operational expertise make him invaluable in managing day-to-day club functions.

**Honorary Secretary:** Sarah Davis has been elected to serve as Honorary Secretary, bringing professional administrative experience and excellent organizational skills to this crucial role. Sarah has been an active member for eight years and understands the club's operations thoroughly.

**Honorary Treasurer:** Michael Brown continues as Honorary Treasurer, providing financial stability and expertise during these times of club investment and growth. His careful stewardship of club finances has enabled major improvements to facilities and equipment.

**Specialist Positions:**

**Sailing Secretary:** Jennifer Clark has been re-elected as Sailing Secretary, continuing her excellent work in organizing racing programs and regattas. Her expertise in race management and rules interpretation makes her invaluable to our competitive sailing activities.

**Membership Secretary:** David Anderson takes on the role of Membership Secretary, bringing enthusiasm for growing club membership and improving member services. David has extensive experience in member relations and communications.

**Social Secretary:** Emma Roberts has been elected as Social Secretary, bringing creative ideas for member events and social activities. Emma's background in event management promises exciting developments in our social calendar.

**Training Coordinator:** This new position has been created to reflect the growing importance of our training programs. Mark Stevens, an RYA-qualified instructor with extensive teaching experience, will coordinate all training activities and instructor development.

**Harbor Master:** Captain Alan Murray continues in his role as Harbor Master, overseeing marina operations and maintaining the excellent standards of our waterfront facilities.

**Looking Forward:**

The new committee has already outlined several priorities for the coming year, including:

- Expanding youth sailing programs to accommodate growing interest
- Developing environmental initiatives to protect Strangford Lough
- Improving digital communications and online services for members
- Planning for the club's 100th anniversary celebrations in 2028
- Continuing facility improvements and modernization

The committee will meet monthly, with special meetings as required. Minutes of committee meetings will continue to be available to all members through our website and notice boards.

We congratulate all elected members and thank retiring committee members for their valuable service to the club. The democratic process ensures that East Down Yacht Club remains responsive to member needs while maintaining the traditions and values that make our club special.

We encourage all members to engage with the new committee, share ideas, and consider how they might contribute to club activities in the coming year. A sailing club is only as strong as its members' involvement and commitment.`,
      date: 'July 10, 2023',
      author: 'Returning Officer',
      category: 'Club News',
      image: 'https://images.unsplash.com/photo-1533558587600-b2f7f7a75518?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    }
  ];

  const storyId = parseInt(id || '0');
  const story = stories.find(s => s.id === storyId);

  if (!story) {
    return <Navigate to="/news" replace />;
  }

  const estimatedReadTime = Math.ceil(story.content.split(' ').length / 200); // Average reading speed: 200 words per minute

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = story.title;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this story from East Down Yacht Club: ${url}`)}`;
        break;
    }
  };

  return (
    <div className="bg-white">
      {/* Back Navigation */}
      <div className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <Link 
            to="/news" 
            className="inline-flex items-center text-[#843c5c] hover:text-[#a05a7a] transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Sailing Stories
          </Link>
        </div>
      </div>

      <article className="container mx-auto px-4 py-12">
        {/* Hero Image */}
        <div className="mb-8">
          <img 
            src={story.image} 
            alt={story.title}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Article Header */}
        <header className="mb-8">
          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{story.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>By {story.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{estimatedReadTime} min read</span>
            </div>
            <span className="bg-[#843c5c] text-white text-xs px-3 py-1 rounded-full">
              {story.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#843c5c] mb-4 leading-tight">
            {story.title}
          </h1>

          {/* Excerpt */}
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            {story.excerpt}
          </p>

          {/* Share Buttons */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600">Share:</span>
            <button
              onClick={() => handleShare('facebook')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <Facebook size={18} />
              <span className="text-sm">Facebook</span>
            </button>
            <button
              onClick={() => handleShare('twitter')}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-600 transition-colors"
            >
              <Twitter size={18} />
              <span className="text-sm">Twitter</span>
            </button>
            <button
              onClick={() => handleShare('email')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <Mail size={18} />
              <span className="text-sm">Email</span>
            </button>
          </div>
        </header>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <div className="text-gray-800 leading-relaxed">
            {story.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-6">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Author Info */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#843c5c] rounded-full flex items-center justify-center">
                <User size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#843c5c] mb-2">
                  About {story.author}
                </h3>
                <p className="text-gray-600 text-sm">
                  {story.author === 'Committee' || story.author === 'Social Committee' || story.author === 'Safety Committee' || story.author === 'Returning Officer'
                    ? `This article was written by the ${story.author} of East Down Yacht Club.`
                    : `${story.author} is a member of East Down Yacht Club and contributes regularly to our sailing stories and club news.`
                  }
                </p>
              </div>
            </div>
          </div>
        </footer>

        {/* Navigation to More Stories */}
        <div className="mt-12 text-center">
          <Link 
            to="/news" 
            className="inline-flex items-center bg-[#843c5c] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#a05a7a] transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Read More Stories
          </Link>
        </div>
      </article>
    </div>
  );
};

export default StoryDetailPage;