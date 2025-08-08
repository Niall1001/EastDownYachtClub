import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, MapPin, ChevronLeft, FileText, ExternalLink, Share2 } from 'lucide-react';
const EventDetailPage = () => {
  const {
    id
  } = useParams();
  // In a real application, this would fetch data from an API
  // For this example, we'll use mock data
  const eventData = {
    id: parseInt(id || '0'),
    title: id === '8' ? 'Wednesday Club Racing' : 'Weekend Racing Series',
    description: id === '8' ? 'Our weekly club racing series held every Wednesday evening throughout the sailing season. All classes welcome with separate starts for cruisers, dinghies, and keelboats. This is a great opportunity for members to participate in competitive sailing in a friendly atmosphere.' : 'Join us for our weekend club racing series. All classes welcome with separate starts for cruisers, dinghies, and keelboats. This event is part of our seasonal racing calendar and counts towards the club championship.',
    date: id === '8' ? 'Every Wednesday' : 'September 16, 2023',
    time: id === '8' ? '6:30 PM - 9:00 PM' : '10:00 AM - 4:00 PM',
    location: 'Strangford Lough, Main Race Area',
    category: 'Racing',
    image: id === '8' ? 'https://images.unsplash.com/photo-1500627965408-b5f2c5f9168a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' : 'https://images.unsplash.com/photo-1565194481104-39d1ee1b8bcc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    hasResults: true,
    resultsUrl: 'https://hallsailing.com/results/event1',
    isRecurring: id === '8',
    noticeOfRacePdf: '/events/racing-nor.pdf',
    sailingInstructionsPdf: '/events/racing-si.pdf',
    organizer: 'Racing Committee',
    contact: 'racing@eastdownyc.co.uk',
    entryFee: id === '8' ? 'Free for members / £10 for visitors' : '£15 per boat',
    schedule: [{
      time: id === '8' ? '6:00 PM' : '9:00 AM',
      activity: 'Registration opens'
    }, {
      time: id === '8' ? '6:30 PM' : '10:00 AM',
      activity: 'Briefing'
    }, {
      time: id === '8' ? '7:00 PM' : '11:00 AM',
      activity: 'First warning signal'
    }, {
      time: id === '8' ? '9:00 PM' : '4:00 PM',
      activity: 'No warning signal after this time'
    }, {
      time: id === '8' ? '9:30 PM' : '5:00 PM',
      activity: 'Prize giving'
    }],
    classes: ['IRC Racing', 'NHC Cruisers', 'Flying Fifteen', 'Laser/ILCA', 'RS200/400', 'Dinghy Handicap'],
    additionalInfo: id === '8' ? 'Wednesday Club Racing runs throughout the sailing season from April to September. Races are typically windward-leeward courses with separate starts for keelboats and dinghies.' : 'This event is part of our seasonal racing series. Points will count towards the club championship. Light refreshments will be available in the clubhouse after racing.'
  };
  // Check if we're showing the Wednesday Club Racing page
  const isWednesdayRacing = id === '8';
  return <div className="bg-white">
      {/* Page Header */}
      <div className="bg-cover bg-center h-64 md:h-96 relative" style={{
      backgroundImage: `url(${eventData.image})`,
      backgroundBlendMode: 'overlay',
      backgroundColor: 'rgba(0,0,0,0.4)'
    }}>
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl text-white">
              <span className="bg-[#843c5c] text-white text-xs px-2 py-1 rounded mb-3 inline-block">
                {eventData.category}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
                {eventData.title}
              </h1>
              {eventData.isRecurring ? <p className="text-lg md:text-xl">
                  Recurring Event - {eventData.date}
                </p> : <p className="text-lg md:text-xl">{eventData.date}</p>}
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/events" className="inline-flex items-center text-[#843c5c] hover:text-[#a05a7a]">
            <ChevronLeft size={16} className="mr-1" />
            Back to Events
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
              <h2 className="text-2xl font-bold text-[#843c5c] mb-4">
                Event Details
              </h2>
              <p className="text-gray-600 mb-6">{eventData.description}</p>
              {/* Schedule */}
              <h3 className="text-xl font-semibold text-[#843c5c] mb-3">
                Schedule
              </h3>
              <div className="space-y-2 mb-6">
                {eventData.schedule.map((item, index) => <div key={index} className="flex">
                    <span className="font-medium text-gray-700 w-24">
                      {item.time}
                    </span>
                    <span className="text-gray-600">{item.activity}</span>
                  </div>)}
              </div>
              {/* Classes */}
              <h3 className="text-xl font-semibold text-[#843c5c] mb-3">
                Classes
              </h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {eventData.classes.map((cls, index) => <span key={index} className="bg-[#843c5c]/10 text-[#843c5c] px-3 py-1 rounded-full text-sm">
                    {cls}
                  </span>)}
              </div>
              {/* Additional Information */}
              <h3 className="text-xl font-semibold text-[#843c5c] mb-3">
                Additional Information
              </h3>
              <p className="text-gray-600 mb-6">{eventData.additionalInfo}</p>
              {/* Documents Section */}
              <h3 className="text-xl font-semibold text-[#843c5c] mb-3">
                Event Documents
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <a href={eventData.noticeOfRacePdf} download className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-[#843c5c]/10">
                  <FileText size={20} className="mr-3 text-[#843c5c]" />
                  <div>
                    <span className="block font-medium">Notice of Race</span>
                    <span className="text-sm text-gray-500">PDF Document</span>
                  </div>
                </a>
                <a href={eventData.sailingInstructionsPdf} download className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-[#843c5c]/10">
                  <FileText size={20} className="mr-3 text-[#843c5c]" />
                  <div>
                    <span className="block font-medium">
                      Sailing Instructions
                    </span>
                    <span className="text-sm text-gray-500">PDF Document</span>
                  </div>
                </a>
              </div>
              {/* Results Link */}
              {eventData.hasResults && <div className="bg-[#843c5c]/10 border border-[#843c5c]/20 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-[#843c5c] mb-2">
                    Race Results
                  </h3>
                  <p className="text-gray-600 mb-4">
                    View the latest results for this event with detailed standings, weather conditions, and performance statistics.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link 
                      to={`/results?event=${encodeURIComponent(eventData.title)}`}
                      className="inline-flex items-center justify-center px-4 py-2 bg-[#843c5c] text-white font-medium rounded-lg hover:bg-[#a05a7a] transition-colors duration-200"
                    >
                      View Race Results
                    </Link>
                    <a 
                      href={eventData.resultsUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center justify-center px-4 py-2 text-[#843c5c] font-medium border border-[#843c5c] rounded-lg hover:bg-[#843c5c] hover:text-white transition-colors duration-200"
                    >
                      Hall Sailing
                      <ExternalLink size={16} className="ml-2" />
                    </a>
                  </div>
                </div>}
              {/* Wednesday Racing Special Section */}
              {isWednesdayRacing && <div className="bg-[#843c5c]/5 border border-[#843c5c]/10 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-[#843c5c] mb-3">
                    About Wednesday Club Racing
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Our Wednesday Club Racing series is a cornerstone of East
                    Down Yacht Club's racing calendar. Taking place every
                    Wednesday evening throughout the sailing season, it provides
                    members with regular competitive racing in a friendly
                    atmosphere.
                  </p>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-start">
                      <span className="text-[#843c5c] mr-2 font-bold">•</span>
                      <span className="text-gray-600">
                        Series runs from April to September
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-[#843c5c] mr-2 font-bold">•</span>
                      <span className="text-gray-600">
                        Points accumulate throughout the season for series
                        prizes
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-[#843c5c] mr-2 font-bold">•</span>
                      <span className="text-gray-600">
                        Social gathering in the clubhouse after racing
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-[#843c5c] mr-2 font-bold">•</span>
                      <span className="text-gray-600">
                        Separate starts for keelboats and dinghies
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    New members and visitors are always welcome to join our
                    Wednesday racing. If you're interested in crewing, please
                    arrive at the club by 6:00 PM and speak to the Officer of
                    the Day who can help match you with a boat.
                  </p>
                </div>}
            </div>
            {/* Social Sharing */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Share this event:</span>
                <div className="flex space-x-3">
                  <button className="text-gray-500 hover:text-[#843c5c]">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6 sticky top-4">
              <h3 className="text-xl font-semibold text-[#843c5c] mb-4">
                Event Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CalendarIcon size={18} className="mr-3 text-[#843c5c] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-gray-600">{eventData.date}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock size={18} className="mr-3 text-[#843c5c] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">Time</p>
                    <p className="text-gray-600">{eventData.time}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin size={18} className="mr-3 text-[#843c5c] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-gray-600">{eventData.location}</p>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <p className="font-medium">Organizer</p>
                  <p className="text-gray-600">{eventData.organizer}</p>
                </div>
                <div>
                  <p className="font-medium">Contact</p>
                  <a href={`mailto:${eventData.contact}`} className="text-[#843c5c] hover:text-[#a05a7a]">
                    {eventData.contact}
                  </a>
                </div>
                <div>
                  <p className="font-medium">Entry Fee</p>
                  <p className="text-gray-600">{eventData.entryFee}</p>
                </div>
              </div>
              {/* Call to action button */}
              <div className="mt-6">
                <Link to="/join" className="block w-full bg-[#843c5c] hover:bg-[#a05a7a] text-white text-center px-4 py-2 rounded transition-colors">
                  Join to Participate
                </Link>
              </div>
            </div>
            {/* Related Events */}
            <div className="bg-[#843c5c]/5 rounded-lg p-6 border border-[#843c5c]/10">
              <h3 className="font-semibold text-[#843c5c] mb-3">
                Upcoming Events
              </h3>
              <div className="space-y-3">
                <Link to="/events/5" className="block hover:bg-[#843c5c]/10 p-2 rounded">
                  <p className="font-medium text-[#843c5c]">
                    Autumn Series Racing
                  </p>
                  <p className="text-sm text-gray-500">October 8, 2023</p>
                </Link>
                <Link to="/events/3" className="block hover:bg-[#843c5c]/10 p-2 rounded">
                  <p className="font-medium text-[#843c5c]">
                    End of Summer BBQ
                  </p>
                  <p className="text-sm text-gray-500">September 23, 2023</p>
                </Link>
                <Link to="/events/6" className="block hover:bg-[#843c5c]/10 p-2 rounded">
                  <p className="font-medium text-[#843c5c]">
                    Cruising Group Meeting
                  </p>
                  <p className="text-sm text-gray-500">October 12, 2023</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default EventDetailPage;