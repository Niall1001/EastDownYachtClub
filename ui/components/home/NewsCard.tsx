import React from 'react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NewsCardProps {
  id: number | string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  readTime?: number;
  slug?: string;
}

const NewsCard: React.FC<NewsCardProps> = ({ 
  id, 
  title, 
  excerpt, 
  date, 
  category, 
  image, 
  readTime = 3,
  slug 
}) => {
  return (
    <article className="group card-luxury overflow-hidden hover-lift">
      {/* Premium Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-maritime-midnight/80 via-transparent to-transparent"></div>
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center glass-luxury rounded-full px-3 py-1 text-xs font-medium text-white border border-maritime-gold-400/30">
            {category}
          </span>
        </div>
        
        {/* Date Badge */}
        <div className="absolute bottom-4 right-4 glass-luxury rounded-lg px-3 py-2">
          <div className="flex items-center gap-2 text-white text-xs">
            <Calendar size={12} />
            <span>{date}</span>
          </div>
        </div>
        
        {/* Read Time Indicator (shown on hover) */}
        <div className="absolute bottom-4 left-4 glass-luxury rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-2 text-white text-xs">
            <Clock size={12} />
            <span>{readTime} min read</span>
          </div>
        </div>
      </div>
      
      {/* Premium Content Container */}
      <div className="p-6 bg-gradient-to-b from-white to-maritime-mist/30">
        {/* Title with Premium Typography */}
        <h3 className="font-display text-xl font-semibold mb-3 text-maritime-midnight group-hover:text-maritime-deep-navy transition-colors duration-300 leading-tight">
          {title}
        </h3>
        
        {/* Excerpt */}
        <p className="text-maritime-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {excerpt}
        </p>
        
        {/* Premium CTA */}
        <Link 
          to={`/news/id/${id}`}
          className="inline-flex items-center gap-2 text-maritime-gold-600 hover:text-maritime-gold-700 font-medium text-sm transition-all duration-300 group/link"
        >
          <span>Read Full Story</span>
          <ArrowRight 
            size={16} 
            className="transition-transform duration-300 group-hover/link:translate-x-1" 
          />
        </Link>
        
        {/* Subtle Shimmer Effect on Hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-maritime-gold-100/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </div>
      </div>
      
      {/* Premium Border Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-maritime-gold-400 to-maritime-gold-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
    </article>
  );
};

export default NewsCard;