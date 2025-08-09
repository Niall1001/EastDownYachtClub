import React, { useState, useEffect } from 'react';
import { Plus, Save, X, Eye, Calendar, User, ArrowLeft, MapPin, Clock, Sailboat, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useStories } from '../hooks/useStories';
import { useEvents } from '../hooks/useEvents';

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

  const handleStorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!storyFormData.title || !storyFormData.excerpt || !storyFormData.content || !storyFormData.author) {
      alert('Please fill in all required fields');
      return;
    }

    const newStory: Story = {
      id: editingStory ? editingStory.id : Date.now(),
      title: storyFormData.title,
      excerpt: storyFormData.excerpt,
      content: storyFormData.content,
      author: storyFormData.author,
      category: storyFormData.category,
      date: new Date().toISOString().split('T')[0],
      image: storyFormData.image || 'https://images.unsplash.com/photo-1565194481104-39d1ee1b8bcc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    };

    if (editingStory) {
      setStories(prev => prev.map(story => story.id === editingStory.id ? newStory : story));
    } else {
      setStories(prev => [newStory, ...prev]);
    }

    resetStoryForm();
    setEditingStory(null);
    setActiveSection('list');
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

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleEventSubmit called with:', { eventFormData, editingEvent });
    
    if (!eventFormData.title || !eventFormData.description || !eventFormData.date || !eventFormData.time || !eventFormData.location) {
      console.error('Form validation failed:', {
        title: eventFormData.title,
        description: eventFormData.description,
        date: eventFormData.date,
        time: eventFormData.time,
        location: eventFormData.location
      });
      alert('Please fill in all required fields');
      return;
    }

    const eventDate = eventFormData.isRecurring ? null : new Date(eventFormData.date);
    const displayDate = eventFormData.isRecurring 
      ? eventFormData.date 
      : new Date(eventFormData.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

    const newEvent: Event = {
      id: editingEvent ? editingEvent.id : Date.now(),
      title: eventFormData.title,
      description: eventFormData.description,
      date: displayDate,
      dateObj: eventDate,
      time: eventFormData.time,
      location: eventFormData.location,
      category: eventFormData.category,
      image: eventFormData.image || 'https://images.unsplash.com/photo-1565194481104-39d1ee1b8bcc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      hasResults: eventFormData.hasResults,
      resultsUrl: eventFormData.resultsUrl || undefined,
      isRecurring: eventFormData.isRecurring,
      noticeOfRacePdf: eventFormData.noticeOfRacePdf || undefined,
      sailingInstructionsPdf: eventFormData.sailingInstructionsPdf || undefined,
      boatEntries: eventFormData.boatEntries
    };
    
    console.log('Created newEvent:', newEvent);
    if (editingEvent) {
      console.log('Updating existing event with id:', editingEvent.id);
      setEvents(prev => {
        const updated = prev.map(event => event.id === editingEvent.id ? newEvent : event);
        console.log('Updated events array:', updated);
        return updated;
      });
    } else {
      console.log('Creating new event');
      setEvents(prev => [newEvent, ...prev]);
    }

    resetEventForm();
    setEditingEvent(null);
    setActiveSection('list');
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
    
    // Convert start_date to YYYY-MM-DD format for date input
    let dateValue = '';
    if (event.start_date) {
      try {
        const date = new Date(event.start_date);
        if (!isNaN(date.getTime())) {
          dateValue = date.toISOString().split('T')[0];
        }
      } catch (error) {
        console.warn('Could not parse event start_date:', event.start_date);
        dateValue = '';
      }
    }
    
    const formData = {
      title: event.title || '',
      description: event.description || '',
      date: dateValue,
      time: event.start_time || '',
      location: event.location || '',
      category: event.event_type || 'Racing',
      image: '',
      hasResults: false,
      resultsUrl: '',
      isRecurring: false,
      recurringFrequency: '',
      noticeOfRacePdf: '',
      sailingInstructionsPdf: '',
      boatEntries: []
    };
    
    console.log('Setting eventFormData:', formData);
    setEventFormData(formData);
    setActiveTab('events'); // Ensure we're on the events tab
    setActiveSection('edit');
  };

  const handleDeleteStory = (id: string) => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      // In a real app, this would call the API to delete the story
      alert('Delete functionality would be implemented with API call');
    }
  };

  const handleDeleteEvent = (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      // In a real app, this would call the API to delete the event
      alert('Delete functionality would be implemented with API call');
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      name="isRecurring"
                      checked={eventFormData.isRecurring}
                      onChange={handleEventInputChange}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Recurring Event</span>
                  </label>
                  
                  {eventFormData.isRecurring && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frequency *
                      </label>
                      <select
                        name="recurringFrequency"
                        value={eventFormData.recurringFrequency || ''}
                        onChange={handleEventInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required={eventFormData.isRecurring}
                      >
                        <option value="">Select frequency</option>
                        <option value="1 week">Every Week</option>
                        <option value="2 weeks">Every 2 Weeks</option>
                        <option value="3 weeks">Every 3 Weeks</option>
                        <option value="1 month">Every Month</option>
                      </select>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="hasResults"
                      checked={eventFormData.hasResults}
                      onChange={handleEventInputChange}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Has Results</span>
                  </label>
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