import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Calendar, ArrowLeft, User, Tag, Clock, AlertCircle } from 'lucide-react';
import { useStory } from '../hooks/useStories';

const StoryPage: React.FC = () => {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const { story, isLoading, error, fetchStory } = useStory();

  // Fetch story on mount based on slug or id (backend handles both)
  React.useEffect(() => {
    const identifier = slug || id;
    if (identifier) {
      fetchStory(identifier);
    }
  }, [id, slug, fetchStory]);

  // If no id or slug provided, redirect to news page
  if (!id && !slug) {
    return <Navigate to="/news" replace />;
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string): string => {
    const categoryLower = category.toLowerCase();
    switch (categoryLower) {
      case 'racing': return 'bg-red-100 text-red-800';
      case 'training': return 'bg-green-100 text-green-800';
      case 'social': return 'bg-purple-100 text-purple-800';
      case 'announcement': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getDefaultImage = (storyType: string): string => {
    switch (storyType.toLowerCase()) {
      case 'racing': return 'https://images.unsplash.com/photo-1565194481104-39d1ee1b8bcc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
      case 'training': return 'https://images.unsplash.com/photo-1534438097545-a2c22c57f2ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
      case 'social': return 'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
      case 'announcement': return 'https://images.unsplash.com/photo-1500627965408-b5f2c5f9168a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
      default: return 'https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4 w-1/4"></div>
              <div className="h-12 bg-gray-200 rounded mb-6"></div>
              <div className="h-64 bg-gray-200 rounded mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Story Not Found</h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <Link 
                to="/news" 
                className="inline-flex items-center gap-2 bg-maritime-deep-navy hover:bg-maritime-royal text-white px-6 py-3 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
                Back to News
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No story found
  if (!story) {
    return (
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <AlertCircle size={48} className="mx-auto text-gray-500 mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Story Not Found</h1>
              <p className="text-gray-600 mb-6">The story you're looking for doesn't exist or has been removed.</p>
              <Link 
                to="/news" 
                className="inline-flex items-center gap-2 bg-maritime-deep-navy hover:bg-maritime-royal text-white px-6 py-3 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
                Back to News
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const categoryName = story.story_type.charAt(0).toUpperCase() + story.story_type.slice(1);
  const featuredImage = story.featured_image_url || getDefaultImage(story.story_type);

  return (
    <div className="bg-white min-h-screen">
      {/* Header with back navigation */}
      <div className="bg-maritime-mist/30 border-b border-maritime-silver/20">
        <div className="container mx-auto px-4 py-4">
          <Link 
            to="/news" 
            className="inline-flex items-center gap-2 text-maritime-slate-600 hover:text-maritime-deep-navy transition-colors"
          >
            <ArrowLeft size={20} />
            Back to News
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <article className="max-w-4xl mx-auto">
          {/* Story Header */}
          <header className="mb-8">
            <div className="mb-4">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(categoryName)}`}>
                <Tag size={12} />
                {categoryName}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-maritime-midnight mb-6 leading-tight">
              {story.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-maritime-slate-600">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{formatDate(story.created_at)}</span>
              </div>
              
              {story.author_name && (
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>{story.author_name}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>5 min read</span>
              </div>
            </div>
            
            {story.publish_date && story.publish_date !== story.created_at && (
              <div className="mt-2 text-sm text-maritime-slate-500">
                Published: {formatDate(story.publish_date)}
              </div>
            )}
          </header>

          {/* Featured Image */}
          <div className="mb-8">
            <img 
              src={featuredImage} 
              alt={story.title}
              className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg"
            />
          </div>

          {/* Story Excerpt */}
          {story.excerpt && (
            <div className="mb-8 p-6 bg-maritime-mist/20 rounded-xl border-l-4 border-maritime-gold-400">
              <p className="text-lg text-maritime-slate-700 italic leading-relaxed">
                {story.excerpt}
              </p>
            </div>
          )}

          {/* Story Content */}
          <div className="prose prose-lg prose-maritime max-w-none">
            {story.content.split('\n').map((paragraph, index) => (
              paragraph.trim() && (
                <p key={index} className="mb-6 text-maritime-slate-700 leading-relaxed">
                  {paragraph}
                </p>
              )
            ))}
          </div>

          {/* Tags */}
          {story.tags && story.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-maritime-silver/20">
              <div className="flex items-center gap-2 mb-4">
                <Tag size={16} className="text-maritime-slate-500" />
                <span className="text-sm font-medium text-maritime-slate-600">Tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {story.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-maritime-mist/40 text-maritime-slate-600 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Footer Navigation */}
          <div className="mt-12 pt-8 border-t border-maritime-silver/20">
            <Link 
              to="/news" 
              className="inline-flex items-center gap-2 bg-maritime-deep-navy hover:bg-maritime-royal text-white px-6 py-3 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
              Back to All Stories
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
};

export default StoryPage;