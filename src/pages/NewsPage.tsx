import React, { useState } from 'react';
import { Calendar, Search, Filter, ChevronRight, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
const NewsPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const categories = ['All', 'Club News', 'Racing', 'Training', 'Social', 'Announcements'];
  const featuredArticle = {
    id: 1,
    title: 'East Down Yacht Club Hosts Successful Strangford Lough Regatta',
    excerpt: "This year's Strangford Lough Regatta was a tremendous success with record participation and perfect sailing conditions throughout the weekend. Over 50 boats competed across multiple classes.",
    content: "This year's Strangford Lough Regatta was a tremendous success with record participation and perfect sailing conditions throughout the weekend. Over 50 boats competed across multiple classes, with sailors traveling from across Ireland to participate in one of the most anticipated events in the Northern Irish sailing calendar.\n\nThe event kicked off on Saturday morning with a skipper's briefing, followed by three races throughout the day. Sunday saw an additional two races before the prize-giving ceremony at the clubhouse.\n\nIn the competitive IRC class, 'Sea Wolf' skippered by John McDowell took top honors, while 'Blue Jay' with the Henderson family claimed victory in the family cruiser category.",
    date: 'August 15, 2023',
    author: 'Sarah Thompson',
    category: 'Racing',
    image: 'https://images.unsplash.com/photo-1565194481104-39d1ee1b8bcc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  };
  const newsArticles = [{
    id: 2,
    title: 'New Training Courses Announced for Spring Season',
    excerpt: "We're excited to announce our spring training schedule, featuring courses for all skill levels from beginners to advanced racers.",
    date: 'August 10, 2023',
    category: 'Training',
    image: 'https://images.unsplash.com/photo-1534438097545-a2c22c57f2ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  }, {
    id: 3,
    title: 'Clubhouse Renovation Complete',
    excerpt: 'After months of work, our clubhouse renovation is finally complete. Come join us for the grand reopening celebration.',
    date: 'August 5, 2023',
    category: 'Club News',
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  }, {
    id: 4,
    title: 'Junior Sailors Shine at Regional Championships',
    excerpt: 'Our junior sailing team brought home multiple trophies from the Regional Youth Championships held last weekend.',
    date: 'July 28, 2023',
    category: 'Racing',
    image: 'https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  }, {
    id: 5,
    title: "Annual Commodore's Dinner Set for September",
    excerpt: "Join us for our annual Commodore's Dinner, a celebration of the season's achievements and camaraderie.",
    date: 'July 20, 2023',
    category: 'Social',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  }, {
    id: 6,
    title: 'Safety Equipment Inspection Day Scheduled',
    excerpt: 'Ensure your boat is ready for the season with our comprehensive safety equipment inspection day.',
    date: 'July 15, 2023',
    category: 'Announcements',
    image: 'https://images.unsplash.com/photo-1500627965408-b5f2c5f9168a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  }, {
    id: 7,
    title: 'New Committee Members Elected',
    excerpt: "We're pleased to announce the results of our recent committee elections. Meet the team who will lead the club forward.",
    date: 'July 10, 2023',
    category: 'Club News',
    image: 'https://images.unsplash.com/photo-1533558587600-b2f7f7a75518?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  }];
  const filteredArticles = newsArticles.filter(article => {
    const matchesCategory = activeCategory === 'All' || article.category === activeCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  const newsletters = [{
    id: 1,
    title: 'Summer 2023 Newsletter',
    date: 'June 2023',
    image: 'https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  }, {
    id: 2,
    title: 'Spring 2023 Newsletter',
    date: 'March 2023',
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  }, {
    id: 3,
    title: 'Winter 2022 Newsletter',
    date: 'December 2022',
    image: 'https://images.unsplash.com/photo-1534437088728-d816f38288a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  }, {
    id: 4,
    title: 'Autumn 2022 Newsletter',
    date: 'September 2022',
    image: 'https://images.unsplash.com/photo-1565194481104-39d1ee1b8bcc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  }];
  return <div className="bg-white">
      {/* Page Header - Moved wave down for better visibility */}
      <div className="bg-[#1e3a8a] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Sailing Stories
            </h1>
            <p className="text-lg md:text-xl mb-12">
              Stay updated with the latest news, events, and stories from East
              Down Yacht Club
            </p>
          </div>
        </div>
        {/* Wave decoration - moved down */}
        <div className="relative h-16 mt-12">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="absolute bottom-0 w-full h-auto">
            <path fill="#ffffff" fillOpacity="1" d="M0,64L60,53.3C120,43,240,21,360,21.3C480,21,600,43,720,53.3C840,64,960,64,1080,58.7C1200,53,1320,43,1380,37.3L1440,32L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z"></path>
          </svg>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        {/* Featured Article */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#1e3a8a] mb-6">
            Featured Story
          </h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img src={featuredArticle.image} alt={featuredArticle.title} className="w-full h-64 md:h-full object-cover" />
              </div>
              <div className="md:w-1/2 p-6 md:p-8">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Calendar size={14} className="mr-1" />
                  <span>{featuredArticle.date}</span>
                  <span className="mx-2">•</span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {featuredArticle.category}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-[#1e3a8a] mb-3">
                  {featuredArticle.title}
                </h3>
                <p className="text-gray-600 mb-4">{featuredArticle.excerpt}</p>
                <Link to={`/news/${featuredArticle.id}`} className="inline-block bg-[#0284c7] hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
                  Read Full Story
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="relative w-full md:w-auto">
              <input type="text" placeholder="Search news..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto">
              <Filter size={18} className="text-gray-500 flex-shrink-0" />
              {categories.map(category => <button key={category} onClick={() => setActiveCategory(category)} className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${activeCategory === category ? 'bg-[#1e3a8a] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  {category}
                </button>)}
            </div>
          </div>
        </div>
        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredArticles.map(article => <div key={article.id} className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-md">
              <div className="aspect-w-16 aspect-h-9">
                <img src={article.image} alt={article.title} className="w-full h-48 object-cover" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    <span>{article.date}</span>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {article.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#1e3a8a] mb-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                <Link to={`/news/${article.id}`} className="text-[#0284c7] font-medium hover:text-blue-700 inline-flex items-center">
                  Read More
                  <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>)}
        </div>
        {/* Newsletter Section */}
        <div className="bg-gray-50 rounded-lg p-8 mb-16">
          <div className="md:flex justify-between items-center">
            <div className="md:w-2/3 mb-6 md:mb-0">
              <h3 className="text-2xl font-bold text-[#1e3a8a] mb-2">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-gray-600">
                Stay up-to-date with all the latest news, events, and updates
                from East Down Yacht Club.
              </p>
            </div>
            <div className="md:w-1/3">
              <div className="flex">
                <input type="email" placeholder="Your email address" className="flex-grow px-4 py-2 rounded-l-lg border-y border-l border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button className="bg-[#0284c7] hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg transition-colors flex items-center">
                  <Mail size={18} className="mr-2" /> Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Newsletter Archive */}
        <div>
          <h2 className="text-2xl font-bold text-[#1e3a8a] mb-6">
            Newsletter Archive
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newsletters.map(newsletter => <Link key={newsletter.id} to={`/newsletters/${newsletter.id}`} className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-md">
                <div className="aspect-w-16 aspect-h-9">
                  <img src={newsletter.image} alt={newsletter.title} className="w-full h-36 object-cover" />
                </div>
                <div className="p-4">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Calendar size={14} className="mr-1" />
                    <span>{newsletter.date}</span>
                  </div>
                  <h3 className="font-bold text-[#1e3a8a]">
                    {newsletter.title}
                  </h3>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-[#0284c7] text-sm font-medium">
                      View Newsletter
                    </span>
                    <ChevronRight size={16} className="text-[#0284c7]" />
                  </div>
                </div>
              </Link>)}
          </div>
        </div>
      </div>
    </div>;
};
export default NewsPage;