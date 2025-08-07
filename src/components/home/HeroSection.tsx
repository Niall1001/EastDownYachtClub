import React from 'react';
import { Anchor, Award, Users, Calendar, Star, Compass } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen bg-maritime-gradient overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-wave-pattern opacity-30"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-maritime-midnight/20 to-maritime-midnight/40"></div>
      
      {/* Floating Maritime Elements */}
      <div className="absolute top-20 left-10 text-maritime-gold-400/20 animate-float">
        <Anchor size={32} />
      </div>
      <div className="absolute top-32 right-20 text-maritime-gold-400/20 animate-float" style={{animationDelay: '1s'}}>
        <Star size={24} />
      </div>
      <div className="absolute bottom-40 left-20 text-maritime-gold-400/20 animate-float" style={{animationDelay: '2s'}}>
        <Compass size={28} />
      </div>
      <div className="absolute bottom-60 right-10 text-maritime-gold-400/20 animate-float" style={{animationDelay: '3s'}}>
        <Award size={30} />
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 flex items-center min-h-screen">
        <div className="w-full max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 glass-luxury rounded-full px-6 py-3 mb-8 text-white">
              <Award size={20} className="text-maritime-gold-400" />
              <span className="text-sm font-medium">Established 1928 • RYA Training Centre</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="font-display text-responsive-xl font-bold mb-6 text-white text-shadow-luxury">
              East Down{' '}
              <span className="text-gradient-gold bg-clip-text text-transparent bg-gradient-to-r from-maritime-gold-400 to-maritime-gold-300">
                Yacht Club
              </span>
            </h1>
            
            {/* Elegant Tagline */}
            <p className="text-responsive-lg text-maritime-mist/90 font-light mb-12 max-w-3xl mx-auto leading-relaxed">
              Set sail with excellence on the pristine waters of Strangford Lough.
              <span className="block mt-2 text-maritime-silver/80 text-lg">
                Where maritime tradition meets modern luxury.
              </span>
            </p>
            
            {/* Premium CTAs */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <button className="btn-primary-luxury group">
                <span className="relative z-10 flex items-center gap-3">
                  Discover Membership
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
              
              <button className="btn-secondary-luxury group">
                <span className="flex items-center gap-3">
                  Explore Events
                  <Calendar size={18} className="transition-transform group-hover:scale-110" />
                </span>
              </button>
            </div>
            
            {/* Premium Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="glass-luxury rounded-2xl p-6 hover-lift">
                <div className="flex items-center justify-center mb-3">
                  <div className="bg-maritime-gold-500/20 p-3 rounded-full">
                    <Award size={24} className="text-maritime-gold-400" />
                  </div>
                </div>
                <div className="text-2xl font-display font-bold text-white mb-1">95+</div>
                <div className="text-maritime-silver/80 text-sm">Years of Excellence</div>
              </div>
              
              <div className="glass-luxury rounded-2xl p-6 hover-lift">
                <div className="flex items-center justify-center mb-3">
                  <div className="bg-maritime-gold-500/20 p-3 rounded-full">
                    <Users size={24} className="text-maritime-gold-400" />
                  </div>
                </div>
                <div className="text-2xl font-display font-bold text-white mb-1">300+</div>
                <div className="text-maritime-silver/80 text-sm">Active Members</div>
              </div>
              
              <div className="glass-luxury rounded-2xl p-6 hover-lift">
                <div className="flex items-center justify-center mb-3">
                  <div className="bg-maritime-gold-500/20 p-3 rounded-full">
                    <Calendar size={24} className="text-maritime-gold-400" />
                  </div>
                </div>
                <div className="text-2xl font-display font-bold text-white mb-1">50+</div>
                <div className="text-maritime-silver/80 text-sm">Annual Events</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Premium Wave Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32">
        <svg 
          className="absolute bottom-0 w-full h-auto text-white animate-wave" 
          style={{animationDelay: '0s'}}
          preserveAspectRatio="none" 
          viewBox="0 0 1440 120" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            fill="currentColor" 
            fillOpacity="0.8"
            d="M0,64L60,53.3C120,43,240,21,360,21.3C480,21,600,43,720,53.3C840,64,960,64,1080,58.7C1200,53,1320,43,1380,37.3L1440,32L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
          />
        </svg>
        
        <svg 
          className="absolute bottom-0 w-full h-auto text-white animate-wave" 
          style={{animationDelay: '1s'}}
          preserveAspectRatio="none" 
          viewBox="0 0 1440 120" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            fill="currentColor" 
            fillOpacity="0.6"
            d="M0,32L60,37.3C120,43,240,53,360,58.7C480,64,600,64,720,53.3C840,43,960,21,1080,21.3C1200,21,1320,43,1380,53.3L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
          />
        </svg>
        
        <svg 
          className="absolute bottom-0 w-full h-auto text-white animate-wave" 
          style={{animationDelay: '2s'}}
          preserveAspectRatio="none" 
          viewBox="0 0 1440 120" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            fill="currentColor" 
            fillOpacity="0.4"
            d="M0,96L60,85.3C120,75,240,53,360,53.3C480,53,600,75,720,85.3C840,96,960,96,1080,90.7C1200,85,1320,75,1380,69.3L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;