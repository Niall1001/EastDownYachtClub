import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar as CalendarIcon, Download, ChevronLeft, Share2, FileText, Printer } from 'lucide-react';
const NewsletterPage = () => {
  const {
    id
  } = useParams();
  // In a real application, this would fetch data from an API
  // For this example, we'll use mock data
  const newsletters = {
    '1': {
      id: 1,
      title: 'Summer 2023 Newsletter',
      date: 'June 2023',
      image: 'https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      description: 'Our Summer 2023 newsletter covers all the exciting events and achievements from the start of the sailing season.',
      pdfUrl: '/newsletters/summer_2023.pdf',
      highlights: ['Summer Regatta Results', 'New Committee Members Introduction', 'Upcoming Training Courses', 'Cruising Fleet Update', 'Junior Sailing Program Success'],
      commodoreMessage: "Dear Members, I'm delighted to welcome you to another fantastic sailing season at East Down Yacht Club. The summer months ahead promise exciting racing, social events, and plenty of opportunities to enjoy our beautiful Strangford Lough..."
    },
    '2': {
      id: 2,
      title: 'Spring 2023 Newsletter',
      date: 'March 2023',
      image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      description: 'The Spring 2023 newsletter brings you updates on club improvements, the sailing calendar, and preparation for the new season.',
      pdfUrl: '/newsletters/spring_2023.pdf',
      highlights: ['Season Opening Event Details', 'Clubhouse Renovation Update', 'New Safety Boat Announcement', 'Training Schedule for 2023', 'AGM Summary'],
      commodoreMessage: "Dear Members, As we prepare to launch the 2023 sailing season, I'm pleased to report on the progress of our winter projects and the exciting calendar of events we have planned..."
    },
    '3': {
      id: 3,
      title: 'Winter 2022 Newsletter',
      date: 'December 2022',
      image: 'https://images.unsplash.com/photo-1534437088728-d816f38288a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      description: 'Our Winter 2022 newsletter reflects on a successful year of sailing and previews winter activities and plans for the coming year.',
      pdfUrl: '/newsletters/winter_2022.pdf',
      highlights: ['Annual Prize Giving Results', 'Winter Social Calendar', 'Boat Storage Arrangements', 'Membership Renewal Information', 'Winter Maintenance Schedule'],
      commodoreMessage: "Dear Members, As we wrap up another successful year at East Down Yacht Club, I'd like to extend my sincere thanks to everyone who contributed to our vibrant community..."
    },
    '4': {
      id: 4,
      title: 'Autumn 2022 Newsletter',
      date: 'September 2022',
      image: 'https://images.unsplash.com/photo-1565194481104-39d1ee1b8bcc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      description: 'The Autumn 2022 newsletter covers end-of-season events, racing results, and preparation for winter activities.',
      pdfUrl: '/newsletters/autumn_2022.pdf',
      highlights: ['End of Season Regatta Coverage', 'Autumn Series Racing Results', 'Winter Program Preview', 'Club Championship Standings', 'Cruising Fleet Adventures'],
      commodoreMessage: 'Dear Members, As the main sailing season draws to a close, we can look back with pride on a summer full of successful events and great sailing...'
    }
  };
  const newsletter = newsletters[id || '1'];
  if (!newsletter) {
    return <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-[#1e3a8a] mb-4">
          Newsletter not found
        </h2>
        <p className="text-gray-600 mb-6">
          The newsletter you're looking for doesn't exist.
        </p>
        <Link to="/news" className="inline-flex items-center text-[#0284c7] hover:text-blue-700">
          <ChevronLeft size={16} className="mr-1" />
          Back to News
        </Link>
      </div>;
  }
  return <div className="bg-white">
      {/* Page Header with Wave Animation */}
      <div className="bg-gradient-to-br from-[#843c5c] via-[#843c5c] to-[#843c5c]/90 text-white py-16 relative overflow-hidden">
        {/* Background Wave Pattern */}
        <div className="absolute inset-0 opacity-10 animate-fade-in">
          <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="newsletter-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M10 2L18 18L2 18Z" fill="currentColor" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#newsletter-pattern)"/>
          </svg>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Newsletter Signup
            </h1>
            <p className="text-lg md:text-xl mb-12 text-white/90">
              Stay connected with the latest news, events, and updates from East Down Yacht Club
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
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/news" className="inline-flex items-center text-[#0284c7] hover:text-blue-700">
            <ChevronLeft size={16} className="mr-1" />
            Back to News
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
              <h2 className="text-2xl font-bold text-[#1e3a8a] mb-4">
                Newsletter Overview
              </h2>
              <p className="text-gray-600 mb-6">{newsletter.description}</p>
              {/* Highlights */}
              <h3 className="text-xl font-semibold text-[#1e3a8a] mb-3">
                Highlights in this Issue
              </h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600 mb-6">
                {newsletter.highlights.map((highlight: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined, index: React.Key | null | undefined) => <li key={index}>{highlight}</li>)}
              </ul>
              {/* Commodore's Message */}
              <h3 className="text-xl font-semibold text-[#1e3a8a] mb-3">
                Commodore's Message
              </h3>
              <div className="bg-gray-50 p-4 border-l-4 border-[#0284c7] italic mb-6">
                <p className="text-gray-600">{newsletter.commodoreMessage}</p>
              </div>
              {/* Preview Image */}
              <h3 className="text-xl font-semibold text-[#1e3a8f] mb-3">
                Newsletter Preview
              </h3>
              <div className="bg-gray-100 p-4 rounded-lg mb-6 text-center">
                <img src={newsletter.image} alt={`Preview of ${newsletter.title}`} className="max-w-full h-auto rounded-lg shadow-md inline-block" />
              </div>
              {/* Download Section */}
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
                <h3 className="font-semibold text-[#1e3a8a] mb-3 text-center">
                  Download Full Newsletter
                </h3>
                <p className="text-gray-600 text-center mb-4">
                  Download the complete newsletter to read all articles and see
                  photos from recent events.
                </p>
                <div className="flex justify-center">
                  <a href={newsletter.pdfUrl} download className="inline-flex items-center bg-[#1e3a8a] hover:bg-blue-900 text-white px-6 py-3 rounded transition-colors">
                    <Download size={18} className="mr-2" />
                    Download PDF
                  </a>
                </div>
              </div>
            </div>
            {/* Social Sharing */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Share this newsletter:</span>
                <div className="flex space-x-3">
                  <button className="text-gray-500 hover:text-[#1e3a8a]">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6 sticky top-4">
              <h3 className="text-xl font-semibold text-[#1e3a8a] mb-4">
                Newsletter Actions
              </h3>
              <div className="space-y-4">
                <a href={newsletter.pdfUrl} download className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Download size={20} className="mr-3 text-[#0284c7]" />
                  <span className="font-medium">Download PDF</span>
                </a>
                <button onClick={() => window.print()} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 w-full">
                  <Printer size={20} className="mr-3 text-[#0284c7]" />
                  <span className="font-medium">Print Newsletter</span>
                </button>
                <a href={`mailto:?subject=EDYC Newsletter: ${newsletter.title}&body=Check out the latest newsletter from East Down Yacht Club: ${window.location.href}`} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Share2 size={20} className="mr-3 text-[#0284c7]" />
                  <span className="font-medium">Share by Email</span>
                </a>
              </div>
            </div>
            {/* Other Newsletters */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="font-semibold text-[#1e3a8a] mb-3">
                Other Newsletters
              </h3>
              <div className="space-y-3">
                {Object.values(newsletters).filter(n => n.id !== newsletter.id).map(n => <Link key={n.id} to={`/newsletters/${n.id}`} className="flex items-start p-2 hover:bg-gray-100 rounded">
                      <FileText size={16} className="mr-2 text-[#0284c7] flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-medium text-[#1e3a8a]">{n.title}</p>
                        <p className="text-xs text-gray-500">{n.date}</p>
                      </div>
                    </Link>)}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                <Link to="/news" className="text-[#0284c7] hover:text-blue-700 font-medium">
                  View All Newsletters
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default NewsletterPage;