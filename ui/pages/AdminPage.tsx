import React, { useState, useEffect } from 'react';
import { Plus, Save, X, Eye, Calendar, User, ArrowLeft, MapPin, Clock, Sailboat, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Story {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  date: string;
  image: string;
}

interface BoatEntry {
  id: string;
  boat: string;
  skipper: string;
  sailNumber: string;
  class: string;
}

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  dateObj: Date | null;
  time: string;
  location: string;
  category: string;
  image: string;
  hasResults: boolean;
  resultsUrl?: string;
  isRecurring: boolean;
  recurringFrequency?: string;
  noticeOfRacePdf?: string;
  sailingInstructionsPdf?: string;
  boatEntries: BoatEntry[];
}





const AdminPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'stories' | 'events'>('stories');
  const [activeSection, setActiveSection] = useState<'list' | 'new' | 'edit'>('list');
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // Stories state
  const [stories, setStories] = useState<Story[]>([
    {
      id: 1,
      title: 'East Down Yacht Club Hosts Successful Strangford Lough Regatta',
      excerpt: "This year's Strangford Lough Regatta was a tremendous success with record participation and perfect sailing conditions throughout the weekend.",
      content: "This year's Strangford Lough Regatta was a tremendous success with record participation and perfect sailing conditions throughout the weekend. Over 50 boats competed across multiple classes, with sailors traveling from across Ireland to participate in one of the most anticipated events in the Northern Irish sailing calendar.\n\nThe event kicked off on Saturday morning with a skipper's briefing, followed by three races throughout the day.",
      author: 'Sarah Thompson',
      category: 'Racing',
      date: '2023-08-15',
      image: 'https://images.unsplash.com/photo-1565194481104-39d1ee1b8bcc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 2,
      title: 'New Training Courses Announced for Spring Season',
      excerpt: "We're excited to announce our spring training schedule, featuring courses for all skill levels from beginners to advanced racers.",
      content: "We're excited to announce our comprehensive spring training schedule, featuring courses designed for all skill levels from complete beginners to advanced competitive racers. Our certified instructors will guide participants through progressive learning modules.",
      author: 'Mike Johnson',
      category: 'Training',
      date: '2023-08-10',
      image: 'https://images.unsplash.com/photo-1534438097545-a2c22c57f2ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    }
  ]);



  // Load events from localStorage with migration
  const loadEvents = (): Event[] => {
    try {
      const stored = localStorage.getItem('adminEvents');
      if (!stored) return [];
      
      const events = JSON.parse(stored);
      
      // Migrate old event format
      return events.map((event: any) => ({
        ...event,
        boatEntries: event.boatEntries || []
      }));
    } catch (error) {
      console.error('Error loading events:', error);
      return [];
    }
  };

  const saveEvents = (events: Event[]) => {
    try {
      localStorage.setItem('adminEvents', JSON.stringify(events));
    } catch (error) {
      console.error('Error saving events:', error);
    }
  };





  // Initialize events from localStorage or use default
  const initializeEvents = (): Event[] => {
    const storedEvents = loadEvents();
    if (storedEvents.length > 0) {
      return storedEvents;
    }
    
    // Default events with comprehensive dummy data
    return [
      {
        id: 1,
        title: 'Strangford Lough Championship',
        description: 'Annual championship race featuring multiple classes. Premium racing event with IRC rated boats, cruisers, and dinghies competing across Strangford Lough.',
        date: 'August 15, 2024',
        dateObj: new Date(2024, 7, 15),
        time: '10:00 AM - 5:00 PM',
        location: 'Strangford Lough, Main Race Area',
        category: 'Racing',
        image: 'https://images.unsplash.com/photo-1565194481104-39d1ee1b8bcc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        hasResults: true,
        resultsUrl: 'https://hallsailing.com/results/event1',
        isRecurring: false,
        boatEntries: [
          // IRC Class 1
          { id: '1', boat: 'Storm Petrel', skipper: 'James Morrison', sailNumber: 'IRL4217', class: 'IRC Class 1' },
          { id: '2', boat: 'Checkmate', skipper: 'Sarah Thompson', sailNumber: 'IRL3845', class: 'IRC Class 1' },
          { id: '3', boat: 'Wild Spirit', skipper: 'Michael O\'Brien', sailNumber: 'IRL5621', class: 'IRC Class 1' },
          { id: '4', boat: 'Artemis', skipper: 'David Wilson', sailNumber: 'IRL2978', class: 'IRC Class 1' },
          
          // IRC Class 2
          { id: '5', boat: 'Sea Dreams', skipper: 'Emma Clarke', sailNumber: 'IRL1234', class: 'IRC Class 2' },
          { id: '6', boat: 'Celtic Warrior', skipper: 'Patrick Kelly', sailNumber: 'IRL5678', class: 'IRC Class 2' },
          { id: '7', boat: 'Northern Light', skipper: 'Rachel Hughes', sailNumber: 'IRL9012', class: 'IRC Class 2' },
          { id: '8', boat: 'Maverick', skipper: 'Thomas Reid', sailNumber: 'IRL3456', class: 'IRC Class 2' },
          { id: '9', boat: 'Windchaser', skipper: 'Jennifer Adams', sailNumber: 'IRL7890', class: 'IRC Class 2' },
          
          // Cruiser Class
          { id: '10', boat: 'Morning Mist', skipper: 'Robert Anderson', sailNumber: 'IRL246', class: 'Cruiser Class' },
          { id: '11', boat: 'Serendipity', skipper: 'Catherine Murphy', sailNumber: 'IRL135', class: 'Cruiser Class' },
          { id: '12', boat: 'Blue Horizon', skipper: 'Mark Stewart', sailNumber: 'IRL579', class: 'Cruiser Class' },
          { id: '13', boat: 'Ocean Breeze', skipper: 'Lisa Campbell', sailNumber: 'IRL864', class: 'Cruiser Class' }
        ]
      },
      {
        id: 2,
        title: 'Wednesday Evening Series',
        description: 'Weekly club racing series every Wednesday evening. Mixed fleet racing with handicap starts for all classes.',
        date: 'Every Wednesday',
        dateObj: null,
        time: '6:30 PM - 9:00 PM',
        location: 'Strangford Lough, Club Waters',
        category: 'Racing',
        image: 'https://images.unsplash.com/photo-1565194481104-39d1ee1b8bcc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        hasResults: false,
        isRecurring: true,
        boatEntries: [
          // IRC Class 2
          { id: '14', boat: 'Seaspray', skipper: 'Alan Foster', sailNumber: 'IRL4321', class: 'IRC Class 2' },
          { id: '15', boat: 'Mistral', skipper: 'Helen Douglas', sailNumber: 'IRL8765', class: 'IRC Class 2' },
          
          // Cruiser Class  
          { id: '16', boat: 'Fair Winds', skipper: 'George Patterson', sailNumber: 'IRL975', class: 'Cruiser Class' },
          { id: '17', boat: 'Tranquility', skipper: 'Mary O\'Connor', sailNumber: 'IRL531', class: 'Cruiser Class' },
          { id: '18', boat: 'Starlight', skipper: 'Kevin Brady', sailNumber: 'IRL642', class: 'Cruiser Class' },
          
          // Dinghy Class
          { id: '19', boat: 'Lightning', skipper: 'Sophie Turner', sailNumber: '14257', class: 'Dinghy Class' },
          { id: '20', boat: 'Quicksilver', skipper: 'Jamie Collins', sailNumber: '16834', class: 'Dinghy Class' },
          { id: '21', boat: 'Zephyr', skipper: 'Alex Murray', sailNumber: '19246', class: 'Dinghy Class' }
        ]
      },
      {
        id: 3,
        title: 'Junior Sailing Program',
        description: 'Our popular junior sailing program continues with sessions for beginners, improvers and advanced young sailors aged 8-16.',
        date: 'September 17, 2024',
        dateObj: new Date(2024, 8, 17),
        time: '9:00 AM - 1:00 PM',
        location: 'East Down YC Training Area',
        category: 'Training',
        image: 'https://images.unsplash.com/photo-1540946485063-a40da27545f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        hasResults: false,
        isRecurring: false,
        boatEntries: []
      },
      {
        id: 4,
        title: 'Classic Yacht Regatta',
        description: 'Special regatta for classic and vintage yachts. A celebration of traditional sailing with boats built before 1975.',
        date: 'July 20, 2024',
        dateObj: new Date(2024, 6, 20),
        time: '11:00 AM - 6:00 PM',
        location: 'Strangford Lough, Heritage Waters',
        category: 'Racing',
        image: 'https://images.unsplash.com/photo-1565194481104-39d1ee1b8bcc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        hasResults: true,
        resultsUrl: 'https://hallsailing.com/results/classic2024',
        isRecurring: false,
        boatEntries: [
          // Classic Class
          { id: '22', boat: 'Shamrock', skipper: 'Declan O\'Sullivan', sailNumber: 'IRL1947', class: 'Classic Class' },
          { id: '23', boat: 'Erin\'s Dream', skipper: 'Brendan Fitzgerald', sailNumber: 'IRL1962', class: 'Classic Class' },
          { id: '24', boat: 'Heritage', skipper: 'Norah McBride', sailNumber: 'IRL1955', class: 'Classic Class' },
          { id: '25', boat: 'Vintage Rose', skipper: 'Conor Gallagher', sailNumber: 'IRL1968', class: 'Classic Class' },
          { id: '26', boat: 'Celtic Cross', skipper: 'Siobhan Walsh', sailNumber: 'IRL1971', class: 'Classic Class' }
        ]
      }
    ];
  };

  // Events state
  const [events, setEvents] = useState<Event[]>(initializeEvents);



  // Save events to localStorage when state changes
  useEffect(() => {
    saveEvents(events);
  }, [events]);

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
      excerpt: story.excerpt,
      content: story.content,
      author: story.author,
      category: story.category,
      image: story.image
    });
    setActiveTab('stories'); // Ensure we're on the stories tab
    setActiveSection('edit');
  };

  const handleEditEvent = (event: Event) => {
    console.log('handleEditEvent called with event:', event);
    setEditingEvent(event);
    
    // Improved date handling with better fallbacks
    let dateValue = '';
    if (event.isRecurring) {
      dateValue = event.date || '';
    } else if (event.dateObj && event.dateObj instanceof Date) {
      dateValue = event.dateObj.toISOString().split('T')[0];
    } else if (event.date && !event.isRecurring) {
      // Try to parse the display date back to YYYY-MM-DD format
      try {
        const parsedDate = new Date(event.date);
        if (!isNaN(parsedDate.getTime())) {
          dateValue = parsedDate.toISOString().split('T')[0];
        } else {
          dateValue = '';
        }
      } catch (error) {
        console.warn('Could not parse event date:', event.date);
        dateValue = '';
      }
    }
    
    const formData = {
      title: event.title || '',
      description: event.description || '',
      date: dateValue,
      time: event.time || '',
      location: event.location || '',
      category: event.category || 'Racing',
      image: event.image || '',
      hasResults: event.hasResults || false,
      resultsUrl: event.resultsUrl || '',
      isRecurring: event.isRecurring || false,
      recurringFrequency: event.recurringFrequency || '',
      noticeOfRacePdf: event.noticeOfRacePdf || '',
      sailingInstructionsPdf: event.sailingInstructionsPdf || '',
      boatEntries: event.boatEntries || []
    };
    
    console.log('Setting eventFormData:', formData);
    setEventFormData(formData);
    setActiveTab('events'); // Ensure we're on the events tab
    setActiveSection('edit');
  };

  const handleDeleteStory = (id: number) => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      setStories(prev => prev.filter(story => story.id !== id));
    }
  };

  const handleDeleteEvent = (id: number) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(prev => prev.filter(event => event.id !== id));
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
              <h2 className="text-xl font-semibold text-gray-800">Published Stories ({stories.length})</h2>
            </div>
            
            <div className="grid gap-6">
              {stories.map(story => (
                <div key={story.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                          {story.category}
                        </span>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar size={14} className="mr-1" />
                          {story.date}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <User size={14} className="mr-1" />
                          {story.author}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">{story.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{story.excerpt}</p>
                    </div>
                    {story.image && (
                      <img
                        src={story.image}
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
          </div>
        )}

        {/* Events List */}
        {activeSection === 'list' && activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Published Events ({events.length})</h2>
            </div>
            
            <div className="grid gap-6">
              {events.map(event => (
                <div key={event.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                          {event.category}
                        </span>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar size={14} className="mr-1" />
                          {event.date}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock size={14} className="mr-1" />
                          {event.time}
                        </div>
                        {event.isRecurring && (
                          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                            Recurring
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">{event.title}</h3>
                      <p className="text-gray-600 mb-2 line-clamp-2">{event.description}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin size={14} className="mr-1" />
                        {event.location}
                      </div>
                    </div>
                    {event.image && (
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-24 h-16 object-cover rounded ml-4 flex-shrink-0"
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t">
                    <button
                      onClick={() => handleEditEvent(event)}
                      className="text-[#0284c7] hover:text-blue-700 text-sm font-medium flex items-center"
                    >
                      <Eye size={14} className="mr-1" />
                      Edit
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