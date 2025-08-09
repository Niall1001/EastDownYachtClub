import React, { useState, useEffect } from 'react';
import { Plus, Save, X, Eye, Calendar, User, ArrowLeft, MapPin, Clock, Sailboat, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useStories } from '../hooks/useStories';
import { useEvents } from '../hooks/useEvents';
import { storyService, CreateStoryRequest, UpdateStoryRequest } from '../services/storyService';
import { eventService, CreateEventRequest, UpdateEventRequest } from '../services/eventService';

interface Story {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author_name?: string;
  story_type: string;
  created_at: string;
  featured_image_url?: string;
  published?: boolean;
}

interface BoatEntry {
  id: string;
  boat: string;
  skipper: string;
  sailNumber: string;
  class: string;
}

interface Event {
  id: string;
  title: string;
  description?: string;
  event_type: string;
  start_date: string;
  end_date?: string;
  start_time?: string;
  location?: string;
  created_at: string;
  updated_at: string;
}





const AdminPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'stories' | 'events'>('stories');
  const [activeSection, setActiveSection] = useState<'list' | 'new' | 'edit'>('list');
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  
  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Fetch stories and events from API
  const { stories, isLoading: storiesLoading, error: storiesError } = useStories({ 
    limit: 50 // Get all stories for admin view
  });
  
  const { events, isLoading: eventsLoading, error: eventsError } = useEvents({ 
    limit: 50 // Get all events for admin view
  });



  // Note: Events now loaded from API via useEvents hook above

  // Story form state
  const [storyFormData, setStoryFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    category: 'Club News',
    image: ''
  });

  // Event form state
  const [eventFormData, setEventFormData] = useState({
    title: '',
    description: '',
    date: '',
    endDate: '',
    time: '',
    location: '',
    category: 'Racing',
    image: '',
    hasResults: false,
    resultsUrl: '',
    isRecurring: false,
    recurringFrequency: '',
    noticeOfRacePdf: '',
    sailingInstructionsPdf: '',
    boatEntries: [] as BoatEntry[]
  });





  const storyCategories = ['Club News', 'Racing', 'Training', 'Social', 'Announcements'];
  const eventCategories = ['Racing', 'Training', 'Social', 'Cruising', 'Committee'];

  const resetStoryForm = () => {
    setStoryFormData({
      title: '',
      excerpt: '',
      content: '',
      author: '',
      category: 'Club News',
      image: ''
    });
  };

  const resetEventForm = () => {
    setEventFormData({
      title: '',
      description: '',
      date: '',
      endDate: '',
      time: '',
      location: '',
      category: 'Racing',
      image: '',
      hasResults: false,
      resultsUrl: '',
      isRecurring: false,
      recurringFrequency: '',
      noticeOfRacePdf: '',
      sailingInstructionsPdf: '',
      boatEntries: []
    });
  };



  // Story handlers
  const handleStoryInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStoryFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!storyFormData.title || !storyFormData.excerpt || !storyFormData.content || !storyFormData.author) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingStory) {
        // Update existing story
        const updateData: UpdateStoryRequest = {
          title: storyFormData.title,
          excerpt: storyFormData.excerpt,
          content: storyFormData.content,
          authorName: storyFormData.author,
          storyType: storyFormData.category.toLowerCase().replace(' ', '_'),
          featuredImageUrl: storyFormData.image || undefined,
          published: true
        };
        
        await storyService.updateStory(editingStory.id, updateData);
        alert('Story updated successfully!');
      } else {
        // Create new story
        const createData: CreateStoryRequest = {
          title: storyFormData.title,
          excerpt: storyFormData.excerpt,
          content: storyFormData.content,
          authorName: storyFormData.author,
          storyType: storyFormData.category.toLowerCase().replace(' ', '_'),
          featuredImageUrl: storyFormData.image || undefined,
          published: true
        };
        
        await storyService.createStory(createData);
        alert('Story created successfully!');
      }
      
      resetStoryForm();
      setEditingStory(null);
      setActiveSection('list');
      
      // Refresh the stories list
      window.location.reload();
      
    } catch (error) {
      console.error('Error saving story:', error);
      alert('Failed to save story. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Event handlers
  const handleEventInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setEventFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'file') {
      const files = (e.target as HTMLInputElement).files;
      if (files && files[0]) {
        // For now, store the file object. In a real app, you'd upload it to a server
        setEventFormData(prev => ({ ...prev, [name]: files[0] }));
      }
    } else {
      setEventFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventFormData.title || !eventFormData.description || !eventFormData.date || !eventFormData.location) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      // Convert time from "10:00 AM" format to "10:00:00" format
      let startTime: string | undefined;
      if (eventFormData.time) {
        const timeMatch = eventFormData.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
        if (timeMatch) {
          let hours = parseInt(timeMatch[1]);
          const minutes = timeMatch[2];
          const period = timeMatch[3].toUpperCase();
          
          if (period === 'PM' && hours !== 12) hours += 12;
          if (period === 'AM' && hours === 12) hours = 0;
          
          startTime = `${hours.toString().padStart(2, '0')}:${minutes}:00`;
        } else {
          startTime = eventFormData.time;
        }
      }

      if (editingEvent) {
        // Update existing event
        const updateData: UpdateEventRequest = {
          title: eventFormData.title,
          description: eventFormData.description,
          eventType: eventFormData.category.toLowerCase().replace(' ', '_'),
          startDate: eventFormData.date,
          endDate: eventFormData.endDate || undefined,
          startTime: startTime,
          location: eventFormData.location
        };
        
        await eventService.updateEvent(editingEvent.id, updateData);
        alert('Event updated successfully!');
      } else {
        // Create new event
        const createData: CreateEventRequest = {
          title: eventFormData.title,
          description: eventFormData.description,
          eventType: eventFormData.category.toLowerCase().replace(' ', '_'),
          startDate: eventFormData.date,
          endDate: eventFormData.endDate || undefined,
          startTime: startTime,
          location: eventFormData.location
        };
        
        await eventService.createEvent(createData);
        alert('Event created successfully!');
      }
      
      resetEventForm();
      setEditingEvent(null);
      setActiveSection('list');
      
      // Refresh the events list
      window.location.reload();
      
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditStory = (story: Story) => {
    setEditingStory(story);
    setStoryFormData({
      title: story.title,
      excerpt: story.excerpt || '',
      content: story.content,
      author: story.author_name || '',
      category: story.story_type?.charAt(0).toUpperCase() + story.story_type?.slice(1) || 'Club News',
      image: story.featured_image_url || ''
    });
    setActiveTab('stories'); // Ensure we're on the stories tab
    setActiveSection('edit');
  };

  const handleEditEvent = (event: Event) => {
    console.log('handleEditEvent called with event:', event);
    setEditingEvent(event);
    
    // Handle both snake_case (API format) and camelCase (transformed format)
    const startDateField = event.start_date || event.startDate;
    const endDateField = event.end_date || event.endDate;
    const startTimeField = event.start_time || event.startTime;
    const eventTypeField = event.event_type || event.eventType;
    
    // Convert startDate to YYYY-MM-DD format for date input
    let dateValue = '';
    if (startDateField) {
      try {
        const date = new Date(startDateField);
        if (!isNaN(date.getTime())) {
          dateValue = date.toISOString().split('T')[0];
        }
      } catch (error) {
        console.warn('Could not parse event startDate:', startDateField);
        dateValue = '';
      }
    }
    
    // Convert endDate to YYYY-MM-DD format for date input
    let endDateValue = '';
    if (endDateField) {
      try {
        const endDate = new Date(endDateField);
        if (!isNaN(endDate.getTime())) {
          endDateValue = endDate.toISOString().split('T')[0];
        }
      } catch (error) {
        console.warn('Could not parse event endDate:', endDateField);
        endDateValue = '';
      }
    }
    
    // Convert start_time to display format (e.g., "11:00 AM")
    let timeValue = '';
    if (startTimeField) {
      try {
        const timeDate = new Date(startTimeField);
        if (!isNaN(timeDate.getTime())) {
          timeValue = timeDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          });
        }
      } catch (error) {
        console.warn('Could not parse event start_time:', startTimeField);
        timeValue = '';
      }
    }
    
    // Determine frequency based on existing event data
    let recurringFrequency = '';
    if (endDateField && startDateField) {
      try {
        const startDate = new Date(startDateField);
        const endDate = new Date(endDateField);
        
        if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
          const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          // For now, assume weekly since that's what our current implementation supports
          // In the future, we could enhance this based on actual event pattern analysis
          if (diffDays >= 7) {
            recurringFrequency = 'weekly';
          }
        }
      } catch (error) {
        console.warn('Could not determine frequency for recurring event');
      }
    }

    const formData = {
      title: event.title || '',
      description: event.description || '',
      date: dateValue,
      endDate: endDateValue,
      time: timeValue,
      location: event.location || '',
      category: eventTypeField ? eventTypeField.charAt(0).toUpperCase() + eventTypeField.slice(1) : 'Racing',
      image: '',
      hasResults: false,
      resultsUrl: '',
      isRecurring: !!endDateField, // If there's an end date, it's recurring
      recurringFrequency: recurringFrequency,
      noticeOfRacePdf: '',
      sailingInstructionsPdf: '',
      boatEntries: []
    };
    
    console.log('Raw event data:', event);
    console.log('Extracted fields:', {
      startDateField,
      endDateField,
      startTimeField,
      eventTypeField
    });
    console.log('Formatted form data:', formData);
    setEventFormData(formData);
    setActiveTab('events'); // Ensure we're on the events tab
    setActiveSection('edit');
  };

  const handleDeleteStory = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      setIsDeleting(id);
      try {
        await storyService.deleteStory(id);
        alert('Story deleted successfully!');
        // Refresh the page to update the list
        window.location.reload();
      } catch (error) {
        console.error('Error deleting story:', error);
        alert('Failed to delete story. Please try again.');
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setIsDeleting(id);
      try {
        await eventService.deleteEvent(id);
        alert('Event deleted successfully!');
        // Refresh the page to update the list
        window.location.reload();
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event. Please try again.');
      } finally {
        setIsDeleting(null);
      }
    }
  };




  const handleNewItem = () => {
    if (activeTab === 'stories') {
      resetStoryForm();
      setEditingStory(null);
    } else if (activeTab === 'events') {
      resetEventForm();
      setEditingEvent(null);
    }
    setActiveSection('new');
  };

  const handleCancel = () => {
    if (activeTab === 'stories') {
      resetStoryForm();
      setEditingStory(null);
    } else if (activeTab === 'events') {
      resetEventForm();
      setEditingEvent(null);
    }
    setActiveSection('list');
  };

  const handleTabSwitch = (tab: 'stories' | 'events') => {
    setActiveTab(tab);
    setActiveSection('list');
    resetStoryForm();
    resetEventForm();
    setEditingStory(null);
    setEditingEvent(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#1e3a8a]">Admin Console</h1>
              <p className="text-gray-600 mt-1">
                Manage stories and events • Logged in as <span className="font-medium text-[#1e3a8a]">{user?.name}</span>
              </p>
            </div>
            {activeSection === 'list' && (
              <button
                onClick={handleNewItem}
                className="bg-[#0284c7] hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
              >
                <Plus size={20} className="mr-2" />
                New {activeTab === 'stories' ? 'Story' : 'Event'}
              </button>
            )}
            {(activeSection === 'new' || activeSection === 'edit') && (
              <button
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
              >
                <ArrowLeft size={20} className="mr-2" />
                Back to List
              </button>
            )}
          </div>

          {/* Tab Navigation */}
          {activeSection === 'list' && (
            <div className="flex space-x-1 mt-6 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => handleTabSwitch('stories')}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'stories'
                    ? 'bg-white text-[#1e3a8a] shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <FileText size={16} className="mr-2" />
                Stories ({stories.length})
              </button>
              <button
                onClick={() => handleTabSwitch('events')}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'events'
                    ? 'bg-white text-[#1e3a8a] shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Sailboat size={16} className="mr-2" />
                Events ({events.length})
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stories List */}
        {activeSection === 'list' && activeTab === 'stories' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">All Stories ({stories.length})</h2>
            </div>
            
            {storiesLoading ? (
              <div className="text-center py-12">
                <div className="text-maritime-slate-600">Loading stories...</div>
              </div>
            ) : storiesError ? (
              <div className="text-center py-12">
                <div className="text-red-600">Error loading stories: {storiesError}</div>
              </div>
            ) : (
              <div className="grid gap-6">
                {stories.map(story => (
                <div key={story.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                          {story.story_type?.charAt(0).toUpperCase() + story.story_type?.slice(1)}
                        </span>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar size={14} className="mr-1" />
                          {new Date(story.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <User size={14} className="mr-1" />
                          {story.author_name || 'Club Admin'}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">{story.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{story.excerpt}</p>
                    </div>
                    {story.featured_image_url && (
                      <img
                        src={story.featured_image_url}
                        alt={story.title}
                        className="w-24 h-16 object-cover rounded ml-4 flex-shrink-0"
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t">
                    <button
                      onClick={() => handleEditStory(story)}
                      className="text-[#0284c7] hover:text-blue-700 text-sm font-medium flex items-center"
                    >
                      <Eye size={14} className="mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteStory(story.id)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center"
                    >
                      <X size={14} className="mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Events List */}
        {activeSection === 'list' && activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Published Events ({events.length})</h2>
            </div>
            
            {eventsLoading ? (
              <div className="text-center py-12">
                <div className="text-maritime-slate-600">Loading events...</div>
              </div>
            ) : eventsError ? (
              <div className="text-center py-12">
                <div className="text-red-600">Error loading events: {eventsError}</div>
              </div>
            ) : (
              <div className="grid gap-6">
                {events.map(event => (
                  <div key={event.id} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                            {event.event_type?.charAt(0).toUpperCase() + event.event_type?.slice(1) || 'Event'}
                          </span>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar size={14} className="mr-1" />
                            {new Date(event.start_date).toLocaleDateString()}
                            {event.end_date && event.end_date !== event.start_date && (
                              <span> - {new Date(event.end_date).toLocaleDateString()}</span>
                            )}
                          </div>
                          {event.start_time && (
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock size={14} className="mr-1" />
                              {event.start_time}
                            </div>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">{event.title}</h3>
                        {event.description && (
                          <p className="text-gray-600 mb-2 line-clamp-2">{event.description}</p>
                        )}
                        {event.location && (
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin size={14} className="mr-1" />
                            {event.location}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 pt-4 border-t">
                      <button
                        onClick={() => handleEditEvent(event)}
                        className="text-[#0284c7] hover:text-blue-700 text-sm font-medium flex items-center"
                      >
                        <Eye size={14} className="mr-1" />
                        View Details
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        disabled={isDeleting === event.id}
                        className={`text-sm font-medium flex items-center ${
                          isDeleting === event.id
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-red-600 hover:text-red-700'
                        }`}
                      >
                        <X size={14} className="mr-1" />
                        {isDeleting === event.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Story Form */}
        {(activeSection === 'new' || activeSection === 'edit') && activeTab === 'stories' && (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              {editingStory ? 'Edit Story' : 'Create New Story'}
            </h2>
            
            <form onSubmit={handleStorySubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={storyFormData.title}
                  onChange={handleStoryInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter story title..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt *
                </label>
                <textarea
                  name="excerpt"
                  value={storyFormData.excerpt}
                  onChange={handleStoryInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief summary of the story..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <textarea
                  name="content"
                  value={storyFormData.content}
                  onChange={handleStoryInputChange}
                  rows={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Full story content..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author *
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={storyFormData.author}
                    onChange={handleStoryInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Author name..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={storyFormData.category}
                    onChange={handleStoryInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {storyCategories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image URL
                </label>
                <input
                  type="url"
                  name="image"
                  value={storyFormData.image}
                  onChange={handleStoryInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Leave empty to use default yacht image
                </p>
              </div>

              <div className="flex items-center gap-4 pt-6 border-t">
                <button
                  type="submit"
                  className="bg-[#0284c7] hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center transition-colors"
                >
                  <Save size={18} className="mr-2" />
                  {editingStory ? 'Update Story' : 'Publish Story'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Event Form */}
        {(activeSection === 'new' || activeSection === 'edit') && activeTab === 'events' && (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              {editingEvent ? 'Edit Event' : 'Create New Event'}
            </h2>
            
            <form onSubmit={handleEventSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={eventFormData.title}
                  onChange={handleEventInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter event title..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={eventFormData.description}
                  onChange={handleEventInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Event description..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={eventFormData.category}
                    onChange={handleEventInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {eventCategories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time *
                  </label>
                  <select
                    name="time"
                    value={eventFormData.time}
                    onChange={handleEventInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select start time</option>
                    <option value="8:00 AM">8:00 AM</option>
                    <option value="9:00 AM">9:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="2:00 PM">2:00 PM</option>
                    <option value="3:00 PM">3:00 PM</option>
                    <option value="4:00 PM">4:00 PM</option>
                    <option value="5:00 PM">5:00 PM</option>
                    <option value="6:00 PM">6:00 PM</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={eventFormData.date}
                    onChange={handleEventInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date {eventFormData.category === 'Series' ? '*' : '(Optional)'}
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={eventFormData.endDate}
                    onChange={handleEventInputChange}
                    min={eventFormData.date}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required={eventFormData.category === 'Series'}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {eventFormData.category === 'Series' ? 'Required for series events' : 'Leave empty for single-day events'}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={eventFormData.location}
                  onChange={handleEventInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Event location..."
                  required
                />
              </div>

              {/* Recurring Frequency Selection */}
              {eventFormData.endDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recurring Frequency *
                  </label>
                  <select
                    name="recurringFrequency"
                    value={eventFormData.recurringFrequency}
                    onChange={handleEventInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required={!!eventFormData.endDate}
                  >
                    <option value="">Select frequency</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    How often should this event repeat between the start and end dates?
                  </p>
                </div>
              )}

              {/* Recurring Event Indicator */}
              {eventFormData.endDate && eventFormData.recurringFrequency && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Calendar size={20} className="text-blue-600 mr-3" />
                    <div>
                      <h4 className="font-medium text-blue-900">Recurring Event Series</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        This event will repeat {eventFormData.recurringFrequency} from {eventFormData.date} to {eventFormData.endDate}.
                        Each occurrence will appear as a separate entry on the calendar.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Results URL
                </label>
                <input
                  type="url"
                  name="resultsUrl"
                  value={eventFormData.resultsUrl}
                  onChange={handleEventInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/results"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notice of Race PDF
                  </label>
                  <input
                    type="file"
                    name="noticeOfRacePdf"
                    onChange={handleEventInputChange}
                    accept=".pdf"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="text-sm text-gray-500 mt-1">Upload PDF document (Max 10MB)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sailing Instructions PDF
                  </label>
                  <input
                    type="file"
                    name="sailingInstructionsPdf"
                    onChange={handleEventInputChange}
                    accept=".pdf"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="text-sm text-gray-500 mt-1">Upload PDF document (Max 10MB)</p>
                </div>
              </div>



              <div className="flex items-center gap-4 pt-6 border-t">
                <button
                  type="submit"
                  className="bg-[#0284c7] hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center transition-colors"
                >
                  <Save size={18} className="mr-2" />
                  {editingEvent ? 'Update Event' : 'Create Event'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminPage;