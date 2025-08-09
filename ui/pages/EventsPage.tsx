import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Users, ChevronLeft, ChevronRight, Sailboat, LifeBuoy, Trophy, GraduationCap, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEvents } from '../hooks/useEvents';

/**
 * EventsPage Component
 * 
 * This component displays yacht club events with:
 * - A calendar view showing events from the events API
 * - Event listings with details from real API data
 * - Proper handling of database snake_case vs TypeScript camelCase
 * - Type-safe event transformations and null checks
 * - Navigation to individual event detail pages
 * 
 * The calendar only displays events fetched from the backend API,
 * removing any hardcoded or recurring event logic.
 */

// Interface for transformed event data used in this component
interface TransformedEvent {
  id: string;
  title: string;
  description: string;
  eventType: string;
  date: string;
  startDate: Date;
  endDate: Date | null;
  time: string;
  location: string;
  category: string;
  image: string;
  hasResults: boolean;
}
const EventsPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Fetch real events data
  const { events, isLoading, error } = useEvents({
    startDate: new Date().toISOString().split('T')[0], // Today and future events
    limit: 50
  });

  // Helper function to generate recurring event instances for series events
  const generateRecurringEvents = (event: any): TransformedEvent[] => {
    // Safety check for event object
    if (!event || typeof event !== 'object') {
      return [];
    }

    // Handle database fields (snake_case) and TypeScript types (camelCase)
    const eventData = event as any;
    const eventType = eventData.event_type || event.eventType || 'general';
    const safeEventType = typeof eventType === 'string' ? eventType : 'general';
    
    // Safely handle dates
    const startDateStr = eventData.start_date || event.startDate;
    const endDateStr = eventData.end_date || event.endDate;
    const startTimeStr = eventData.start_time || event.startTime;
    
    const startDate = startDateStr ? new Date(startDateStr) : new Date();
    const endDate = endDateStr ? new Date(endDateStr) : null;
    
    // Format the start time properly
    let formattedTime = 'Time TBD';
    if (startTimeStr) {
      try {
        const timeDate = new Date(startTimeStr);
        formattedTime = timeDate.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
      } catch (error) {
        console.warn('Failed to parse start time:', startTimeStr);
        formattedTime = 'Time TBD';
      }
    }
    
    const baseEvent: TransformedEvent = {
      id: event.id,
      title: event.title || 'Untitled Event',
      description: event.description || 'No description available.',
      eventType: safeEventType,
      date: '', // Will be set for each occurrence
      startDate: startDate,
      endDate: endDate,
      time: formattedTime,
      location: event.location || 'Location TBD',
      category: safeEventType.charAt(0).toUpperCase() + safeEventType.slice(1),
      image: `https://images.unsplash.com/photo-${
        safeEventType === 'racing' ? '1565194481104-39d1ee1b8bcc' :
        safeEventType === 'training' ? '1534438097545-a2c22c57f2ad' :
        safeEventType === 'social' ? '1470337458703-46ad1756a187' :
        safeEventType === 'cruising' ? '1541789094913-f3809a8f3ba5' :
        '1540946485063-a40da27545f8'
      }?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80`,
      hasResults: false
    };

    // Check if this is a recurring event (has both start and end date)
    if (endDate && endDate > startDate) {
      const occurrences: TransformedEvent[] = [];
      const currentDate = new Date(startDate);
      
      // Generate weekly occurrences between start and end date
      while (currentDate <= endDate) {
        const occurrence: TransformedEvent = {
          ...baseEvent,
          id: `${event.id}-${currentDate.toISOString().split('T')[0]}`, // Unique ID for each occurrence
          startDate: new Date(currentDate),
          endDate: new Date(currentDate), // Set end date to same day for individual occurrence
          date: currentDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        };
        
        occurrences.push(occurrence);
        
        // Move to next week
        currentDate.setDate(currentDate.getDate() + 7);
      }
      
      return occurrences;
    } else {
      // Single occurrence event
      return [{
        ...baseEvent,
        date: startDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      }];
    }
  };

  // Transform events from API to display format with recurring event support
  const transformedEvents: TransformedEvent[] = events?.flatMap((event) => {
    return generateRecurringEvents(event);
  }).filter((event): event is TransformedEvent => event !== null) || []; // Type-safe filter

  // Use only real API events data
  const finalEvents = Array.isArray(transformedEvents) ? transformedEvents : [];
  const trainingPrograms = [{
    id: 1,
    title: 'RYA Level 1 & 2 - Start Sailing',
    description: 'Our beginner course covers the basics of sailing, from rigging to steering and basic maneuvers.',
    duration: '4 days',
    nextDates: 'October 14-15 & 21-22',
    price: '£220 members / £280 non-members',
    image: 'https://images.unsplash.com/photo-1534438097545-a2c22c57f2ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  }, {
    id: 2,
    title: 'RYA Level 3 - Better Sailing',
    description: 'For those who have completed Level 2, this course develops your skills and introduces sailing theory.',
    duration: '2 days',
    nextDates: 'October 28-29',
    price: '£150 members / £190 non-members',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  }, {
    id: 3,
    title: 'Junior Sailing Program',
    description: 'Our structured program for young sailors aged 8-16, covering all aspects of dinghy sailing.',
    duration: 'Weekly sessions',
    nextDates: 'Every Sunday morning',
    price: '£15 per session (members only)',
    image: 'https://images.unsplash.com/photo-1540946485063-a40da27545f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  }];
  // Find today's events
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of day for comparison
  const todaysEvents = finalEvents.filter(event => {
    if (event.startDate) {
      const eventDate = new Date(event.startDate);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate.getTime() === today.getTime();
    }
    return false;
  });

  // Calendar functions
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };
  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };
  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    const monthName = currentMonth.toLocaleString('default', {
      month: 'long'
    });
    // Create array of dates with events from API
    const datesWithEvents = finalEvents.map(event => {
      if (event.startDate) {
        const date = new Date(event.startDate);
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      }
      return null;
    }).filter(Boolean) as string[];
    // Generate calendar grid
    const days = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-12 border border-gray-100"></div>);
    }
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      // Check if this date has events from API
      const hasEvent = datesWithEvents.includes(dateStr);
      const isToday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
      
      days.push(<div key={day} className={`h-12 border border-gray-100 relative flex items-center justify-center cursor-pointer
            ${hasEvent ? 'bg-blue-50' : ''}
            ${isToday ? 'border-2 border-[#0284c7]' : ''}
            hover:bg-gray-50
          `} onClick={() => {
        if (hasEvent) {
          // Find the event for this date and navigate to its detail page
          const clickedDate = new Date(year, month, day);
          const eventsForDate = finalEvents.filter(event => {
            if (event && event.startDate) {
              const eventDate = new Date(event.startDate);
              eventDate.setHours(0, 0, 0, 0);
              clickedDate.setHours(0, 0, 0, 0);
              return eventDate.getTime() === clickedDate.getTime();
            }
            return false;
          });
          
          if (eventsForDate.length > 0 && eventsForDate[0]) {
            // Navigate to the first event's detail page
            navigate(`/events/${eventsForDate[0].id}`);
          }
        }
      }}>
          <span className="text-sm">{day}</span>
          {hasEvent && <div className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#0284c7]`}></div>}
        </div>);
    }
    return <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#1e3a8a]">Event Calendar</h2>
          <div className="flex items-center">
            <button onClick={handlePrevMonth} className="p-1 rounded-full hover:bg-gray-100">
              <ChevronLeft size={20} />
            </button>
            <span className="mx-2 font-medium">
              {monthName} {year}
            </span>
            <button onClick={handleNextMonth} className="p-1 rounded-full hover:bg-gray-100">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="h-8 flex items-center justify-center font-medium text-sm text-gray-500">
              {day}
            </div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">{days}</div>
        <div className="mt-4 flex justify-end">
          <div className="flex items-center text-xs text-gray-500">
            <div className="flex items-center mr-4">
              <div className="w-2 h-2 bg-blue-50 border border-gray-200 mr-1"></div>
              <span>Event day (clickable)</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 border-2 border-[#0284c7] mr-1"></div>
              <span>Today</span>
            </div>
          </div>
        </div>
      </div>;
  };
  // Loading and Error states
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="text-2xl font-bold text-maritime-midnight mb-4">Loading Events...</div>
            <div className="text-maritime-slate-600">Please wait while we fetch the latest events.</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 mb-4">Error Loading Events</div>
            <div className="text-maritime-slate-600 mb-4">
              Sorry, we couldn't load the events at this time. Please try again later.
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-maritime-deep-navy hover:bg-maritime-royal text-white px-6 py-2 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Premium Hero Section */}
      <div className="relative bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#0284c7] text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="sailing-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M10 2L18 18L2 18Z" fill="currentColor" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#sailing-pattern)"/>
          </svg>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-24 sm:pb-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight px-2">
              On The <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Water</span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-12 text-white/90 max-w-3xl mx-auto leading-relaxed px-4">
              Discover racing events, training programs, and sailing opportunities
            </p>
            
            {/* Premium Quick Stats with Animations */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12">
              <div className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 text-center border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform duration-300">{isLoading ? '...' : finalEvents.length}</div>
                  <div className="text-xs md:text-sm text-white/90 font-medium">Upcoming Events</div>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
              </div>
              
              <div className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 text-center border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform duration-300">{trainingPrograms.length}</div>
                  <div className="text-xs md:text-sm text-white/90 font-medium">Training Programs</div>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
              </div>
              
              <div className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 text-center border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform duration-300">15+</div>
                  <div className="text-xs md:text-sm text-white/90 font-medium">Club Boats</div>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Modern Wave Decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-20">
          <svg viewBox="0 0 1440 120" className="w-full h-full" preserveAspectRatio="none">
            <path fill="#f8fafc" d="M0,96L60,85.3C120,75,240,53,360,48C480,43,600,53,720,69.3C840,85,960,107,1080,112C1200,117,1320,107,1380,101.3L1440,96L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"/>
          </svg>
        </div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 -mt-8 sm:-mt-12 relative z-20">
        {/* Today's Events - Premium Featured Section */}
        {todaysEvents.length > 0 && (
          <div className="mb-12 sm:mb-16">
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-[#1e3a8a] to-[#0284c7] p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center">
                    <div className="bg-white/20 rounded-full p-2 sm:p-3 mr-3 sm:mr-4">
                      <CalendarIcon size={20} className="text-white sm:hidden" />
                      <CalendarIcon size={24} className="text-white hidden sm:block" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                        Today's Events
                      </h2>
                      <p className="text-sm sm:text-base text-white/80">
                        Don't miss what's happening today
                      </p>
                    </div>
                  </div>
                  <div className="bg-white/20 rounded-full px-3 sm:px-4 py-1 sm:py-2 self-start sm:self-auto">
                    <span className="text-white font-semibold text-sm sm:text-base">
                      {todaysEvents.length} Event{todaysEvents.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {todaysEvents.filter(Boolean).map(event => (
                    <div key={`featured-${event.id}`} className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-blue-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-3 sm:gap-0">
                        <div className="bg-[#1e3a8a] text-white px-3 py-1 rounded-full text-sm font-medium self-start">
                          {event.category}
                        </div>
                        {event.hasResults && (
                          <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium self-start">
                            Results Available
                          </div>
                        )}
                      </div>
                      
                      <h3 className="text-lg sm:text-xl font-bold text-[#1e3a8a] mb-3 group-hover:text-[#0284c7] transition-colors leading-tight">
                        {event.title}
                      </h3>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-gray-600">
                          <CalendarIcon size={18} className="mr-3 text-[#0284c7] flex-shrink-0" />
                          <span className="text-sm font-medium">
                            {event.date}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock size={18} className="mr-3 text-[#0284c7] flex-shrink-0" />
                          <span className="text-sm font-medium">{event.time}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin size={18} className="mr-3 text-[#0284c7] flex-shrink-0" />
                          <span className="text-sm font-medium">{event.location}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Link 
                          to={`/events/${event.id}`} 
                          className="flex-1 bg-[#0284c7] hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium text-center transition-all duration-300 hover:shadow-lg min-h-[44px] flex items-center justify-center"
                        >
                          View Details
                        </Link>
                        {event.hasResults && (
                          <Link
                            to={`/results?event=${encodeURIComponent(event.title)}`}
                            className="bg-[#1e3a8a] hover:bg-blue-900 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg min-h-[44px] flex items-center justify-center"
                          >
                            View Results
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Calendar Section */}
        <div className="mb-12 sm:mb-16">
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-[#1e3a8a] to-[#0284c7] p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center">
                  <div className="bg-white/20 rounded-full p-2 sm:p-3 mr-3 sm:mr-4">
                    <CalendarIcon size={20} className="text-white sm:hidden" />
                    <CalendarIcon size={24} className="text-white hidden sm:block" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Event Calendar</h2>
                    <p className="text-sm sm:text-base text-white/80">View all upcoming events</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 sm:p-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 shadow-lg">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/50">
                  {renderCalendar()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Quick Access Cards */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1e3a8a] text-center mb-8 sm:mb-12 px-4">What Would You Like To Do?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            
            {/* Training Programs Card */}
            <button 
              onClick={() => setActiveSection('training')} 
              className={`group relative bg-white rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-2 overflow-hidden ${
                activeSection === 'training' ? 'border-[#0284c7] ring-4 ring-[#0284c7]/20 shadow-2xl' : 'border-transparent hover:border-[#0284c7]/30'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-1/2 left-1/2 w-0 h-0 bg-green-400/10 rounded-full group-hover:w-96 group-hover:h-96 group-hover:-translate-x-48 group-hover:-translate-y-48 transition-all duration-700 ease-out"></div>
              </div>
              
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                  <GraduationCap size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#1e3a8a] mb-3 group-hover:text-green-600 transition-colors duration-300">Training Programs</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">Discover RYA-certified courses and improve your sailing skills with expert instruction</p>
                <div className="flex items-center justify-between">
                  <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm group-hover:shadow-md transition-shadow duration-300">
                    {trainingPrograms.length} courses
                  </span>
                  <div className="flex items-center text-[#0284c7] group-hover:text-green-600 transition-colors duration-300">
                    <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </button>
            
            {/* Book Boats Card */}
            <button 
              onClick={() => setActiveSection('booking')} 
              className={`group relative bg-white rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-2 overflow-hidden ${
                activeSection === 'booking' ? 'border-[#0284c7] ring-4 ring-[#0284c7]/20 shadow-2xl' : 'border-transparent hover:border-[#0284c7]/30'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-1/2 left-1/2 w-0 h-0 bg-purple-400/10 rounded-full group-hover:w-96 group-hover:h-96 group-hover:-translate-x-48 group-hover:-translate-y-48 transition-all duration-700 ease-out"></div>
              </div>
              
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                  <Sailboat size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#1e3a8a] mb-3 group-hover:text-purple-600 transition-colors duration-300">Book Club Boats</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">Reserve club boats for training, practice, or recreational sailing adventures</p>
                <div className="flex items-center justify-between">
                  <span className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm group-hover:shadow-md transition-shadow duration-300">
                    15+ boats
                  </span>
                  <div className="flex items-center text-[#0284c7] group-hover:text-purple-600 transition-colors duration-300">
                    <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
        
        {/* Overview Section - Default Landing */}
        {activeSection === 'overview' && (
          <div className="space-y-8 animate-in fade-in-50 duration-500">
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <div className="bg-yellow-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <Trophy size={24} className="text-white" />
                </div>
                <div className="text-2xl font-bold text-[#1e3a8a]">{isLoading ? '...' : finalEvents.length}</div>
                <div className="text-sm text-gray-600">Upcoming Events</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <div className="bg-green-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <GraduationCap size={24} className="text-white" />
                </div>
                <div className="text-2xl font-bold text-[#1e3a8a]">{trainingPrograms.length}</div>
                <div className="text-sm text-gray-600">Training Courses</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <div className="bg-purple-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <Sailboat size={24} className="text-white" />
                </div>
                <div className="text-2xl font-bold text-[#1e3a8a]">15+</div>
                <div className="text-sm text-gray-600">Club Boats</div>
              </div>
            </div>
            
            
            {/* Call to Action */}
            <div className="text-center mt-16">
              <h3 className="text-2xl font-bold text-[#1e3a8a] mb-4">Ready to Get On The Water?</h3>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Whether you're looking to race, learn, or simply enjoy time on the water, East Down Yacht Club has something for every sailor.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button 
                  onClick={() => setActiveSection('training')} 
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl"
                >
                  Start Learning
                </button>
                <button 
                  onClick={() => setActiveSection('booking')} 
                  className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl"
                >
                  Book a Boat
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Section Header with Back Button */}
        {activeSection !== 'overview' && (
          <div className="flex items-center gap-4 mb-6 sm:mb-8">
            <button 
              onClick={() => setActiveSection('overview')} 
              className="flex items-center gap-2 text-[#0284c7] hover:text-blue-700 font-medium transition-colors py-2 px-1 -ml-1 min-h-[44px]"
            >
              <ChevronLeft size={20} className="flex-shrink-0" />
              <span className="text-sm sm:text-base">Back to Overview</span>
            </button>
          </div>
        )}
        
        {/* Training Programs Section */}
        {activeSection === 'training' && <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 animate-in fade-in-50 slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-full p-3">
                <GraduationCap size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-[#1e3a8a] mb-1">Training Programs</h2>
                <p className="text-gray-600">RYA-certified courses for all ages and skill levels</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
              {trainingPrograms.map(program => (
                <div key={program.id} className="group bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-lg border border-green-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className="relative overflow-hidden">
                    <img 
                      src={program.image} 
                      alt={program.title} 
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <div className="absolute top-4 right-4">
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        RYA Certified
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#1e3a8a] mb-3 group-hover:text-green-700 transition-colors">
                      {program.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{program.description}</p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center">
                        <Clock size={16} className="mr-3 text-green-500" />
                        <div>
                          <span className="font-medium text-gray-700 text-sm">Duration: </span>
                          <span className="text-gray-600 text-sm">{program.duration}</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <CalendarIcon size={16} className="mr-3 text-green-500" />
                        <div>
                          <span className="font-medium text-gray-700 text-sm">Next Dates: </span>
                          <span className="text-gray-600 text-sm">{program.nextDates}</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Users size={16} className="mr-3 text-green-500" />
                        <div>
                          <span className="font-medium text-gray-700 text-sm">Price: </span>
                          <span className="text-green-700 font-semibold text-sm">{program.price}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Link 
                      to={`/training/${program.id}`} 
                      className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl font-semibold text-center block shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      Enroll Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            {/* Training Information */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
              <div className="md:flex items-center">
                <div className="md:w-3/4 mb-4 md:mb-0 md:pr-6">
                  <h3 className="text-xl font-semibold text-[#1e3a8a] mb-2">
                    Become an RYA Instructor
                  </h3>
                  <p className="text-gray-600">
                    East Down Yacht Club also offers instructor training courses
                    for those looking to take their sailing to the next level.
                    Our instructor development program provides a pathway to
                    becoming a qualified RYA instructor.
                  </p>
                </div>
                <div className="md:w-1/4 text-center">
                  <Link to="/training/instructor" className="inline-block bg-[#1e3a8a] hover:bg-blue-900 text-white px-4 py-2 rounded transition-colors">
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>}
        {/* Book Club Boats Section */}
        {activeSection === 'booking' && <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 animate-in fade-in-50 slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full p-3">
                <Sailboat size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-[#1e3a8a] mb-1">Book Club Boats</h2>
                <p className="text-gray-600">Reserve club boats for training, practice, and recreational sailing</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img src="https://images.unsplash.com/photo-1534438097545-a2c22c57f2ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" alt="Club boats" className="w-full h-64 md:h-full object-cover" />
                </div>
                <div className="md:w-1/2 p-6 md:p-8">
                  <h3 className="text-2xl font-bold text-[#1e3a8a] mb-4">
                    Book Online with PlainSailing
                  </h3>
                  <p className="text-gray-600 mb-6">
                    We've partnered with PlainSailing to provide an easy-to-use
                    online booking system for our club boats. The system allows
                    you to check availability, make reservations, and manage
                    your bookings.
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start">
                      <Sailboat size={18} className="mr-2 text-[#0284c7] mt-1 flex-shrink-0" />
                      <span className="text-gray-600">
                        View our fleet of available boats
                      </span>
                    </div>
                    <div className="flex items-start">
                      <CalendarIcon size={18} className="mr-2 text-[#0284c7] mt-1 flex-shrink-0" />
                      <span className="text-gray-600">
                        Check real-time availability
                      </span>
                    </div>
                    <div className="flex items-start">
                      <LifeBuoy size={18} className="mr-2 text-[#0284c7] mt-1 flex-shrink-0" />
                      <span className="text-gray-600">
                        Book safety boats for events
                      </span>
                    </div>
                  </div>
                  <a href="https://www.itsplainsailing.com/org/edyc" target="_blank" rel="noopener noreferrer" className="inline-block bg-[#0284c7] hover:bg-blue-700 text-white px-6 py-3 rounded transition-colors">
                    Book Now
                  </a>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-lg text-[#1e3a8a] mb-3">
                  Available Fleet
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <span className="text-[#0284c7] mr-2">•</span>
                    <span>RS Quests (4)</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-[#0284c7] mr-2">•</span>
                    <span>Laser/ILCA Dinghies (3)</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-[#0284c7] mr-2">•</span>
                    <span>Toppers (6)</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-[#0284c7] mr-2">•</span>
                    <span>Safety RIBs (2)</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-lg text-[#1e3a8a] mb-3">
                  Booking Requirements
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <span className="text-[#0284c7] mr-2">•</span>
                    <span>Club membership required</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-[#0284c7] mr-2">•</span>
                    <span>Appropriate qualification for boat type</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-[#0284c7] mr-2">•</span>
                    <span>Safety briefing completion</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-[#0284c7] mr-2">•</span>
                    <span>Booking at least 24 hours in advance</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-lg text-[#1e3a8a] mb-3">
                  Rental Fees
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <span className="text-[#0284c7] mr-2">•</span>
                    <span>Half day: £15 - £25</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-[#0284c7] mr-2">•</span>
                    <span>Full day: £25 - £40</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-[#0284c7] mr-2">•</span>
                    <span>Weekend: £45 - £70</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-[#0284c7] mr-2">•</span>
                    <span>Training boats: Discounted rates</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 text-center">
              <h3 className="text-xl font-semibold text-[#1e3a8a] mb-3">
                Need Help?
              </h3>
              <p className="text-gray-600 mb-4">
                If you have any questions about boat bookings or need
                assistance, please contact our Boat Officer.
              </p>
              <a href="mailto:boats@eastdownyc.co.uk" className="inline-block bg-[#1e3a8a] hover:bg-blue-900 text-white px-4 py-2 rounded transition-colors">
                Contact Boat Officer
              </a>
            </div>
          </div>}
      </div>
    </div>;
};
export default EventsPage;