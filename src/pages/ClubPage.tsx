import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Award, ChevronRight } from 'lucide-react';

const ClubPage = () => {
  const [activeTab, setActiveTab] = useState('history');
  const [visibleSections, setVisibleSections] = useState<number[]>([]);
  const [rippleActiveCards, setRippleActiveCards] = useState<Set<number>>(new Set());
  const timelineRefs = useRef<Array<HTMLDivElement | null>>([]);
  const committeeRefs = useRef<Array<HTMLDivElement | null>>([]);
  const facilityRefs = useRef<Array<HTMLDivElement | null>>([]);
  const awardRefs = useRef<Array<HTMLDivElement | null>>([]);

  // Set up refs for each history item
  useEffect(() => {
    timelineRefs.current = timelineRefs.current.slice(0, historyEvents.length);
    committeeRefs.current = committeeRefs.current.slice(0, committeeMembers.length);
    facilityRefs.current = facilityRefs.current.slice(0, facilityImages.length);
    awardRefs.current = awardRefs.current.slice(0, clubAwards.length);
  }, []);

  // Enhanced intersection observer with wave animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = parseInt(entry.target.getAttribute('data-id') || '0');
          const type = entry.target.getAttribute('data-type') || 'timeline';
          
          setVisibleSections(prev => [...new Set([...prev, id])]);
          
          // Trigger ripple effect
          setTimeout(() => {
            setRippleActiveCards(prev => new Set([...prev, id]));
            // Remove ripple after animation
            setTimeout(() => {
              setRippleActiveCards(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
              });
            }, 1000);
          }, 200);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all card types based on active tab
    const observeRefs = (refs: Array<HTMLDivElement | null>) => {
      refs.forEach(ref => {
        if (ref) observer.observe(ref);
      });
    };

    if (activeTab === 'history') {
      observeRefs(timelineRefs.current);
    } else if (activeTab === 'committee') {
      observeRefs(committeeRefs.current);
    } else if (activeTab === 'facilities') {
      observeRefs(facilityRefs.current);
    } else if (activeTab === 'awards') {
      observeRefs(awardRefs.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [activeTab]);

  // Reset animations when tab changes
  useEffect(() => {
    setVisibleSections([]);
    setRippleActiveCards(new Set());
  }, [activeTab]);

  const committeeMembers = [{
    position: 'Commodore',
    name: 'James Wilson',
    image: 'https://randomuser.me/api/portraits/men/32.jpg'
  }, {
    position: 'Vice Commodore',
    name: 'Elizabeth Hughes',
    image: 'https://randomuser.me/api/portraits/women/44.jpg'
  }, {
    position: 'Rear Commodore',
    name: 'Robert Thompson',
    image: 'https://randomuser.me/api/portraits/men/67.jpg'
  }, {
    position: 'Honorary Secretary',
    name: 'Sarah Davis',
    image: 'https://randomuser.me/api/portraits/women/28.jpg'
  }, {
    position: 'Honorary Treasurer',
    name: 'Michael Brown',
    image: 'https://randomuser.me/api/portraits/men/52.jpg'
  }, {
    position: 'Sailing Secretary',
    name: 'Jennifer Clark',
    image: 'https://randomuser.me/api/portraits/women/17.jpg'
  }, {
    position: 'Membership Secretary',
    name: 'David Anderson',
    image: 'https://randomuser.me/api/portraits/men/41.jpg'
  }, {
    position: 'Social Secretary',
    name: 'Emma Roberts',
    image: 'https://randomuser.me/api/portraits/women/63.jpg'
  }];

  const clubAwards = [{
    year: '2022',
    award: 'RYA Club of the Year Finalist'
  }, {
    year: '2021',
    award: 'Northern Ireland Sailing Club Achievement Award'
  }, {
    year: '2019',
    award: 'RYA Training Center Excellence Award'
  }, {
    year: '2018',
    award: 'Community Outreach Recognition'
  }, {
    year: '2016',
    award: 'Environmental Stewardship Award'
  }];

  const facilityImages = [{
    src: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    alt: 'Marina with sailing boats',
    title: 'Marina'
  }, {
    src: 'https://images.unsplash.com/photo-1533558587600-b2f7f7a75518?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    alt: 'Yacht club slipway',
    title: 'Slipway'
  }, {
    src: 'https://images.unsplash.com/photo-1627841513840-23a01a57bd2f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    alt: 'Club restaurant',
    title: 'Clubhouse'
  }, {
    src: 'https://images.unsplash.com/photo-1593351415075-3bac9f45c877?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    alt: 'Training facilities',
    title: 'Training Centre'
  }];

  const historyEvents = [{
    year: '1928',
    title: 'Foundation',
    description: 'East Down Yacht Club was founded by a small group of sailing enthusiasts from the Downpatrick area, initially meeting at Quoile Quay.',
    image: 'https://images.unsplash.com/photo-1516550893885-985694927d5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  }, {
    year: '1947',
    title: 'First Clubhouse',
    description: 'The club acquired its first permanent clubhouse, a modest building that served as the center of operations for the growing membership.',
    image: 'https://images.unsplash.com/photo-1543269664-7eef42226a21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  }, {
    year: '1962',
    title: 'Relocation',
    description: 'The club moved to its current location, offering better access to Strangford Lough and room for expansion of facilities.',
    image: 'https://images.unsplash.com/photo-1593351415075-3bac9f45c877?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  }, {
    year: '1975',
    title: 'New Clubhouse',
    description: 'Construction of the current main clubhouse was completed, providing modern facilities for members and visitors.',
    image: 'https://images.unsplash.com/photo-1534437088728-d816f38288a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  }, {
    year: '1988',
    title: 'RYA Recognition',
    description: 'EDYC became an officially recognized RYA Training Center, allowing the club to offer certified sailing courses.',
    image: 'https://images.unsplash.com/photo-1534438097545-a2c22c57f2ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  }, {
    year: '2003',
    title: 'Marina Expansion',
    description: 'The marina facilities were expanded to accommodate more boats and provide better services to members.',
    image: 'https://images.unsplash.com/photo-1566840767200-3551b92b0c19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  }, {
    year: '2018',
    title: '90th Anniversary',
    description: 'The club celebrated its 90th anniversary with a special regatta and gala dinner, honoring its long history.',
    image: 'https://images.unsplash.com/photo-1565194481104-39d1ee1b8bcc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  }, {
    year: '2022',
    title: 'Facilities Upgrade',
    description: 'Major renovations to the clubhouse and grounds were completed, modernizing the facilities for current and future generations.',
    image: 'https://images.unsplash.com/photo-1533558587600-b2f7f7a75518?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  }];

  return (
    <div className="bg-white">
      {/* Page Header with Wave Animation */}
      <div className="bg-gradient-to-br from-[#843c5c] via-[#843c5c] to-[#843c5c]/90 text-white py-16 relative overflow-hidden">
        {/* Background Wave Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="club-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M10 2L18 18L2 18Z" fill="currentColor" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#club-pattern)"/>
          </svg>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Our Heritage
            </h1>
            <p className="text-lg md:text-xl mb-12 text-white/90">
              Discover the rich history, people, and facilities that make East
              Down Yacht Club special
            </p>
          </div>
        </div>
        {/* Enhanced Wave decoration with animation */}
        <div className="relative h-16 mt-12">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1440 100" 
            className="absolute bottom-0 w-full h-auto animate-wave"
          >
            <path 
              fill="#ffffff" 
              fillOpacity="1" 
              d="M0,64L60,53.3C120,43,240,21,360,21.3C480,21,600,43,720,53.3C840,64,960,64,1080,58.7C1200,53,1320,43,1380,37.3L1440,32L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z"
            />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto pb-2 mb-8">
          <button 
            className={`py-2 px-4 font-medium text-sm whitespace-nowrap transition-colors ${
              activeTab === 'history' 
                ? 'text-[#843c5c] border-b-2 border-[#843c5c]' 
                : 'text-gray-500 hover:text-[#843c5c]'
            }`} 
            onClick={() => setActiveTab('history')}
          >
            Our History
          </button>
          <button 
            className={`py-2 px-4 font-medium text-sm whitespace-nowrap transition-colors ${
              activeTab === 'committee' 
                ? 'text-[#843c5c] border-b-2 border-[#843c5c]' 
                : 'text-gray-500 hover:text-[#843c5c]'
            }`} 
            onClick={() => setActiveTab('committee')}
          >
            Committee & Officers
          </button>
          <button 
            className={`py-2 px-4 font-medium text-sm whitespace-nowrap transition-colors ${
              activeTab === 'facilities' 
                ? 'text-[#843c5c] border-b-2 border-[#843c5c]' 
                : 'text-gray-500 hover:text-[#843c5c]'
            }`} 
            onClick={() => setActiveTab('facilities')}
          >
            Our Facilities
          </button>
          <button 
            className={`py-2 px-4 font-medium text-sm whitespace-nowrap transition-colors ${
              activeTab === 'awards' 
                ? 'text-[#843c5c] border-b-2 border-[#843c5c]' 
                : 'text-gray-500 hover:text-[#843c5c]'
            }`} 
            onClick={() => setActiveTab('awards')}
          >
            Awards & Recognition
          </button>
        </div>

        {/* History Tab */}
        {activeTab === 'history' && (
          <div>
            <div className="mb-12">
              <div className="md:flex items-center gap-8 mb-8">
                <div className="md:w-1/2 mb-6 md:mb-0">
                  <h2 className="text-3xl font-bold text-[#843c5c] mb-4">
                    A Proud Sailing Tradition
                  </h2>
                  <p className="text-[#843c5c]/80 mb-4">
                    East Down Yacht Club has been at the heart of sailing on
                    Strangford Lough since 1928. From humble beginnings with a
                    handful of enthusiasts, we've grown into one of Northern
                    Ireland's premier sailing clubs with hundreds of members and
                    a rich history of competitive racing, training excellence,
                    and community spirit.
                  </p>
                  <p className="text-[#843c5c]/80">
                    Throughout our history, we've maintained our founding
                    principles of promoting sailing, fostering camaraderie among
                    members, and preserving the natural beauty of Strangford
                    Lough for future generations.
                  </p>
                </div>
                <div className="md:w-1/2">
                  <img
                    src="https://images.unsplash.com/photo-1540946485063-a40da27545f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                    alt="Historical sailing photo"
                    className="w-full h-64 object-cover rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>

            {/* Enhanced Timeline with Wave Animations */}
            <div className="relative">
              <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-1 h-full bg-[#843c5c]/40 rounded-full"></div>
              
              {historyEvents.map((event, index) => (
                <div
                  key={index}
                  ref={el => timelineRefs.current[index] = el}
                  data-id={index}
                  data-type="timeline"
                  className={`mb-12 relative ${
                    index % 2 === 0 ? 'md:pr-1/2 md:mr-8' : 'md:pl-1/2 md:ml-8'
                  } ${
                    visibleSections.includes(index) 
                      ? `wave-reveal-card revealed ${index % 2 === 0 ? 'wave-reveal-left' : 'wave-reveal-right'} revealed`
                      : `wave-reveal-card ${index % 2 === 0 ? 'wave-reveal-left' : 'wave-reveal-right'}`
                  } ${rippleActiveCards.has(index) ? 'wave-ripple ripple-active' : 'wave-ripple'}`}
                  style={{
                    transitionDelay: `${index * 0.1}s`
                  }}
                >
                  {/* Timeline dot with wave effect */}
                  <div className={`absolute ${
                    index % 2 === 0 ? 'right-0 md:right-[-0.5rem]' : 'left-0 md:left-[-0.5rem]'
                  } top-8 w-4 h-4 bg-[#843c5c] rounded-full border-4 border-white shadow-lg z-10`}>
                    {visibleSections.includes(index) && (
                      <div className="absolute inset-0 bg-[#843c5c]/60 rounded-full animate-ping"></div>
                    )}
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-lg p-6 ml-8 md:ml-0 border border-[#843c5c]/10">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/3">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-32 object-cover rounded-lg shadow"
                        />
                      </div>
                      <div className="md:w-2/3">
                        <div className="flex items-center gap-4 mb-3">
                          <span className="bg-[#843c5c] text-white text-sm font-bold px-3 py-1 rounded-full">
                            {event.year}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-[#843c5c] mb-2">
                          {event.title}
                        </h3>
                        <p className="text-[#843c5c]/80 text-sm leading-relaxed">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Committee Tab with Wave Animations */}
        {activeTab === 'committee' && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#843c5c] mb-4">
                Leadership Team
              </h2>
              <p className="text-[#843c5c]/80 max-w-3xl">
                Our dedicated committee members bring years of sailing experience and passion
                for the sport to guide East Down Yacht Club into the future.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {committeeMembers.map((member, index) => (
                <div
                  key={index}
                  ref={el => committeeRefs.current[index] = el}
                  data-id={index}
                  data-type="committee"
                  className={`text-center ${
                    visibleSections.includes(index) 
                      ? 'wave-reveal-card revealed' 
                      : 'wave-reveal-card'
                  } ${rippleActiveCards.has(index) ? 'wave-ripple ripple-active' : 'wave-ripple'} wave-stagger-${(index % 5) + 1}`}
                >
                  <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl border border-[#843c5c]/10">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-20 h-20 rounded-full mx-auto mb-4 shadow"
                    />
                    <h3 className="font-semibold text-[#843c5c] mb-1">
                      {member.name}
                    </h3>
                    <p className="text-[#843c5c]/80 text-sm font-medium">
                      {member.position}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Facilities Tab with Wave Animations */}
        {activeTab === 'facilities' && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#843c5c] mb-4">
                World-Class Facilities
              </h2>
              <p className="text-[#843c5c]/80 max-w-3xl">
                Our modern facilities provide everything you need for sailing, training,
                and socializing in a beautiful waterfront setting.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {facilityImages.map((facility, index) => (
                <div
                  key={index}
                  ref={el => facilityRefs.current[index] = el}
                  data-id={index}
                  data-type="facility"
                  className={`$${
                    visibleSections.includes(index) 
                      ? 'wave-reveal-card revealed' 
                      : 'wave-reveal-card'
                  } ${rippleActiveCards.has(index) ? 'wave-ripple ripple-active' : 'wave-ripple'} wave-stagger-${(index % 4) + 1}`}
                >
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl border border-[#843c5c]/10">
                    <img
                      src={facility.src}
                      alt={facility.alt}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-[#843c5c] mb-2">
                        {facility.title}
                      </h3>
                      <p className="text-[#843c5c]/80 text-sm">
                        State-of-the-art {facility.title.toLowerCase()} facilities designed for comfort and functionality.
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Awards Tab with Wave Animations */}
        {activeTab === 'awards' && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#843c5c] mb-4">
                Recognition & Awards
              </h2>
              <p className="text-[#843c5c]/80 max-w-3xl">
                Our commitment to excellence in sailing, training, and community service
                has been recognized with numerous awards and accolades.
              </p>
            </div>

            <div className="space-y-6">
              {clubAwards.map((award, index) => (
                <div
                  key={index}
                  ref={el => awardRefs.current[index] = el}
                  data-id={index}
                  data-type="award"
                  className={`$${
                    visibleSections.includes(index) 
                      ? 'wave-reveal-card revealed' 
                      : 'wave-reveal-card'
                  } ${rippleActiveCards.has(index) ? 'wave-ripple ripple-active' : 'wave-ripple'} wave-stagger-${(index % 5) + 1}`}
                >
                  <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl border border-[#843c5c]/10">
                    <div className="flex items-center gap-4">
                      <div className="bg-[#843c5c] text-white p-3 rounded-full">
                        <Award size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="bg-[#843c5c] text-white text-sm font-bold px-3 py-1 rounded-full">
                            {award.year}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-[#843c5c]">
                          {award.award}
                        </h3>
                      </div>
                      <ChevronRight size={20} className="text-[#843c5c]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Section */}
        <div className="mt-16 pt-16 border-t border-[#843c5c]/20">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-[#843c5c]/10">
            <h2 className="text-2xl font-bold text-[#843c5c] mb-4">
              Visit East Down Yacht Club
            </h2>
            <p className="text-[#843c5c]/80 mb-6 max-w-2xl mx-auto">
              Come and experience our facilities, meet our members, and discover
              why EDYC is the premier sailing destination on Strangford Lough.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-6 mb-8">
              <div className="flex items-center gap-3 text-[#843c5c]/80">
                <MapPin size={18} className="text-[#843c5c]" />
                <span className="text-sm">Quoile Road, Downpatrick, BT30 7JB</span>
              </div>
              <div className="flex items-center gap-3 text-[#843c5c]/80">
                <Phone size={18} className="text-[#843c5c]" />
                <span className="text-sm">028 4461 2266</span>
              </div>
              <div className="flex items-center gap-3 text-[#843c5c]/80">
                <Mail size={18} className="text-[#843c5c]" />
                <span className="text-sm">info@eastdownyc.co.uk</span>
              </div>
            </div>
            <Link to="/join" className="bg-[#843c5c] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#a05a7a] transition-colors">
              Join Our Community
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubPage;