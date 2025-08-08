import React from 'react';
import { 
  Anchor, Award, Calendar, 
  Wind, Thermometer, Eye, ArrowRight, 
  Shield, Star, Compass, Navigation
} from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/home/HeroSection';
import NewsCard from '../components/home/NewsCard';
import { useStories } from '../hooks/useStories';
import { useEvents } from '../hooks/useEvents';

const HomePage: React.FC = () => {
  // Fetch real stories and events data
  const { stories, isLoading: storiesLoading, error: storiesError } = useStories({ 
    published: true, 
    limit: 3,
    type: 'news'
  });
  
  const { events, isLoading: eventsLoading, error: eventsError } = useEvents({ 
    limit: 3,
    startDate: new Date().toISOString().split('T')[0] // Today and future events
  });

  // Transform stories to match the expected format (only if stories are loaded)
  const featuredNews = stories?.map((story, index) => ({
    id: story.id,
    title: story.title,
    excerpt: story.excerpt || story.content.substring(0, 150) + '...',
    date: new Date(story.createdAt).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    category: story.storyType.charAt(0).toUpperCase() + story.storyType.slice(1),
    image: story.featuredImageUrl || `https://images.unsplash.com/photo-${
      index === 0 ? '1565194481104-39d1ee1b8bcc' : 
      index === 1 ? '1534438097545-a2c22c57f2ad' : 
      '1540541338287-41700207dee6'
    }?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80`,
    readTime: Math.max(1, Math.ceil(story.content.length / 1000)), // Rough reading time calculation
    slug: story.slug
  })) || [];

  return (
    <div className="min-h-screen bg-white">
      {/* Premium Hero Section */}
      <HeroSection />


      {/* Latest News & Updates */}
      <section className="py-24 bg-gradient-to-b from-maritime-mist/20 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 animate-fade-in">
              <div>
                <h2 className="font-display text-display-sm font-bold text-maritime-midnight mb-4">
                  Latest News & Updates
                </h2>
                <p className="text-lg text-maritime-slate-600 max-w-2xl">
                  Stay informed with the latest happenings, achievements, and announcements from our sailing community.
                </p>
              </div>
              <Link 
                to="/news" 
                className="inline-flex items-center gap-2 text-maritime-gold-600 hover:text-maritime-gold-700 font-semibold mt-4 md:mt-0 group"
              >
                <span>View All Stories</span>
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Premium News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
              {storiesLoading ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-maritime-slate-600">Loading latest stories...</div>
                </div>
              ) : storiesError ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-red-600">Failed to load stories. Please try again later.</div>
                </div>
              ) : featuredNews.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-maritime-slate-600">No published stories available.</div>
                </div>
              ) : (
                featuredNews.map((article) => (
                  <NewsCard key={article.id} {...article} />
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Premium Services Panel */}
      <section className="py-24 bg-gradient-to-b from-white to-maritime-mist/10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Upcoming Events - Dark Luxury Card */}
              <div className="card-luxury-dark p-8 text-white lg:col-span-1">
                <div className="flex items-center gap-3 mb-6">
                  <Calendar size={24} className="text-maritime-gold-400" />
                  <h3 className="font-display text-xl font-semibold">Upcoming Events</h3>
                </div>
                
                <div className="space-y-4">
                  {eventsLoading ? (
                    <div className="text-maritime-silver/80 text-sm text-center py-4">
                      Loading events...
                    </div>
                  ) : eventsError ? (
                    <div className="text-red-400 text-sm text-center py-4">
                      Failed to load events
                    </div>
                  ) : events.length === 0 ? (
                    <div className="text-maritime-silver/80 text-sm text-center py-4">
                      No upcoming events
                    </div>
                  ) : (
                    events.slice(0, 3).map((event) => (
                      <div key={event.id} className="flex items-start gap-3 p-3 glass-luxury rounded-lg">
                        <div className="w-2 h-2 bg-maritime-gold-400 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm mb-1">{event.title}</h4>
                          <p className="text-maritime-silver/80 text-xs">
                            {new Date(event.startDate).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                <Link 
                  to="/events" 
                  className="inline-flex items-center gap-2 text-maritime-gold-400 hover:text-maritime-gold-300 font-medium text-sm mt-6 group"
                >
                  <span>View All Events</span>
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Weather & Conditions */}
              <div className="card-luxury p-8 lg:col-span-1">
                <div className="flex items-center gap-3 mb-6">
                  <Wind size={24} className="text-maritime-deep-navy" />
                  <h3 className="font-display text-xl font-semibold text-maritime-midnight">
                    Current Conditions
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-maritime-mist/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Wind size={18} className="text-maritime-royal" />
                      <span className="text-sm font-medium text-maritime-slate-700">Wind Speed</span>
                    </div>
                    <span className="font-semibold text-maritime-deep-navy">15 knots</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-maritime-mist/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Navigation size={18} className="text-maritime-royal" />
                      <span className="text-sm font-medium text-maritime-slate-700">Direction</span>
                    </div>
                    <span className="font-semibold text-maritime-deep-navy">SW</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-maritime-mist/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Thermometer size={18} className="text-maritime-royal" />
                      <span className="text-sm font-medium text-maritime-slate-700">Temperature</span>
                    </div>
                    <span className="font-semibold text-maritime-deep-navy">18°C</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-maritime-mist/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Eye size={18} className="text-maritime-royal" />
                      <span className="text-sm font-medium text-maritime-slate-700">Visibility</span>
                    </div>
                    <span className="font-semibold text-maritime-deep-navy">Excellent</span>
                  </div>
                </div>
              </div>

              {/* Membership Excellence */}
              <div className="card-luxury p-8 lg:col-span-1 relative overflow-hidden">
                {/* Floating decorative elements */}
                <div className="absolute -top-2 -right-2 text-maritime-gold-200/20">
                  <Star size={48} />
                </div>
                <div className="absolute -bottom-4 -left-4 text-maritime-gold-200/20">
                  <Anchor size={64} />
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <Award size={24} className="text-maritime-gold-600" />
                    <h3 className="font-display text-xl font-semibold text-maritime-midnight">
                      Join Our Community
                    </h3>
                  </div>
                  
                  <p className="text-maritime-slate-600 mb-6 leading-relaxed">
                    Experience the prestige of membership at Northern Ireland's premier yacht club. 
                    Enjoy world-class facilities, expert training, and an exclusive sailing community.
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-maritime-gold-500 rounded-full"></div>
                      <span className="text-maritime-slate-700">Full marina access & berthing</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-maritime-gold-500 rounded-full"></div>
                      <span className="text-maritime-slate-700">Exclusive clubhouse facilities</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-maritime-gold-500 rounded-full"></div>
                      <span className="text-maritime-slate-700">Priority event registration</span>
                    </div>
                  </div>
                  
                  <Link 
                    to="/join" 
                    className="btn-primary-luxury text-sm py-3 px-6"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Training Excellence Section */}
      <section className="py-24 bg-ocean-gradient text-white relative overflow-hidden">
        {/* Background Maritime Elements */}
        <div className="absolute inset-0 bg-wave-pattern opacity-10"></div>
        <div className="absolute top-10 right-10 text-maritime-gold-400/10 animate-float">
          <Compass size={120} />
        </div>
        <div className="absolute bottom-20 left-10 text-maritime-gold-400/10 animate-float" style={{animationDelay: '2s'}}>
          <Anchor size={80} />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              
              {/* Content */}
              <div className="animate-fade-in">
                <div className="inline-flex items-center gap-2 glass-luxury rounded-full px-6 py-3 mb-6">
                  <Shield size={18} className="text-maritime-gold-400" />
                  <span className="text-sm font-medium">RYA Training Centre</span>
                </div>
                
                <h2 className="font-display text-display-sm font-bold mb-6 text-shadow-luxury">
                  Excellence in 
                  <span className="text-gradient-gold"> Sailing Education</span>
                </h2>
                
                <p className="text-lg text-maritime-silver/90 mb-8 leading-relaxed">
                  Master the art of sailing with our comprehensive training programs. From complete beginners 
                  to advanced racing techniques, our certified RYA instructors provide world-class education 
                  in one of the most beautiful sailing locations in Ireland.
                </p>
                
                {/* Training Stats */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="glass-luxury rounded-xl p-4 text-center">
                    <div className="text-2xl font-display font-bold text-maritime-gold-400 mb-1">500+</div>
                    <div className="text-maritime-silver/80 text-xs">Students Trained</div>
                  </div>
                  <div className="glass-luxury rounded-xl p-4 text-center">
                    <div className="text-2xl font-display font-bold text-maritime-gold-400 mb-1">15+</div>
                    <div className="text-maritime-silver/80 text-xs">Course Options</div>
                  </div>
                </div>
                
                <Link to="/club" className="btn-secondary-luxury">
                  <span className="flex items-center gap-3">
                    Explore Training
                    <ArrowRight size={18} />
                  </span>
                </Link>
              </div>

              {/* Premium Training Image */}
              <div className="relative animate-fade-in">
                <div className="relative overflow-hidden rounded-2xl shadow-luxury">
                  <img 
                    src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="RYA Training at East Down Yacht Club"
                    className="w-full h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-maritime-midnight/30 to-transparent"></div>
                </div>
                
                {/* Floating Achievement Cards */}
                <div className="absolute -top-6 -right-6 glass-luxury rounded-xl p-4 text-center animate-float">
                  <div className="text-lg font-display font-bold text-maritime-gold-400 mb-1">RYA</div>
                  <div className="text-maritime-deep-navy text-xs font-medium">Certified</div>
                </div>
                
                <div className="absolute -bottom-6 -left-6 glass-luxury rounded-xl p-4 text-center animate-float" style={{animationDelay: '1.5s'}}>
                  <div className="text-lg font-display font-bold text-maritime-gold-400 mb-1">95+</div>
                  <div className="text-maritime-deep-navy text-xs font-medium">Years</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup - Premium */}
      <section className="py-16 bg-gradient-to-b from-maritime-mist/30 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="card-luxury p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-maritime-gradient rounded-full mb-6">
                <Anchor size={28} className="text-white" />
              </div>
              
              <h2 className="font-display text-2xl font-bold text-maritime-midnight mb-4">
                Stay Connected with Our Maritime Community
              </h2>
              
              <p className="text-maritime-slate-600 mb-8 max-w-2xl mx-auto">
                Receive exclusive updates on upcoming events, training opportunities, and club news 
                delivered directly to your inbox.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-1 px-4 py-3 rounded-lg border border-maritime-silver focus:border-maritime-gold-400 focus:outline-none focus:ring-2 focus:ring-maritime-gold-400/20 transition-all"
                />
                <button className="btn-primary-luxury text-sm py-3 px-6">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;