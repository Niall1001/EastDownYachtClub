import React, { useState, useEffect } from 'react';
import { Plus, Save, X, Eye, Calendar, User, ArrowLeft, MapPin, Clock, Sailboat, FileText, Trophy, Wind, Thermometer, Users, Trash2, Edit, ChevronDown, ChevronUp } from 'lucide-react';
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
  noticeOfRacePdf?: string;
  sailingInstructionsPdf?: string;
}

// Race Results interfaces (matching RaceResultsPage)
interface RaceResult {
  position: number;
  boat: string;
  skipper: string;
  sailNumber?: string;
  points?: number;
  finishTime?: string;
  correctedTime?: string;
  note?: string;
}

interface RaceClass {
  name: string;
  results: RaceResult[];
  startTime?: string;
  course?: string;
  distance?: number;
  finishers?: number;
}

interface WeatherConditions {
  windSpeed: number;
  windDirection: string;
  temperature: number;
  visibility: string;
  conditions: string;
}

interface RaceResultEvent {
  id: number;
  title: string;
  date: string;
  location: string;
  eventId: number; // Links back to the original event
  classes: RaceClass[];
  weather?: WeatherConditions;
  organizer: string;
  officer?: string;
  startTime: string;
  participants: number;
  type: 'Championship' | 'Series' | 'Fun Race' | 'Regatta';
  status: 'Completed' | 'Provisional' | 'Cancelled' | 'Postponed';
  documents?: {
    results?: string;
    photos?: string;
    report?: string;
  };
}

const AdminPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'stories' | 'events' | 'results'>('stories');
  const [activeSection, setActiveSection] = useState<'list' | 'new' | 'edit'>('list');
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingResult, setEditingResult] = useState<RaceResultEvent | null>(null);

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

  // Load race results from localStorage
  const loadRaceResults = (): RaceResultEvent[] => {
    try {
      const stored = localStorage.getItem('adminRaceResults');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading race results:', error);
      return [];
    }
  };

  const saveRaceResults = (results: RaceResultEvent[]) => {
    try {
      localStorage.setItem('adminRaceResults', JSON.stringify(results));
    } catch (error) {
      console.error('Error saving race results:', error);
    }
  };

  // Race results state
  const [raceResults, setRaceResults] = useState<RaceResultEvent[]>(loadRaceResults);

  // Events state
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: 'Weekend Racing Series',
      description: 'Join us for our weekly club racing series. All classes welcome with separate starts for cruisers, dinghies, and keelboats.',
      date: 'September 16, 2023',
      dateObj: new Date(2023, 8, 16),
      time: '10:00 AM - 4:00 PM',
      location: 'Strangford Lough, Main Race Area',
      category: 'Racing',
      image: 'https://images.unsplash.com/photo-1565194481104-39d1ee1b8bcc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      hasResults: true,
      resultsUrl: 'https://hallsailing.com/results/event1',
      isRecurring: false
    },
    {
      id: 2,
      title: 'Junior Sailing Program',
      description: 'Our popular junior sailing program continues with sessions for beginners, improvers and advanced young sailors aged 8-16.',
      date: 'September 17, 2023',
      dateObj: new Date(2023, 8, 17),
      time: '9:00 AM - 1:00 PM',
      location: 'East Down YC Training Area',
      category: 'Training',
      image: 'https://images.unsplash.com/photo-1540946485063-a40da27545f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      hasResults: false,
      isRecurring: false
    }
  ]);

  // Save race results to localStorage when state changes
  useEffect(() => {
    saveRaceResults(raceResults);
  }, [raceResults]);

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
    noticeOfRacePdf: '',
    sailingInstructionsPdf: ''
  });

  // Race results form state
  const [resultFormData, setResultFormData] = useState({
    title: '',
    date: '',
    location: '',
    eventId: 0,
    organizer: 'East Down Yacht Club',
    officer: '',
    startTime: '',
    participants: 0,
    type: 'Racing' as 'Championship' | 'Series' | 'Fun Race' | 'Regatta',
    status: 'Completed' as 'Completed' | 'Provisional' | 'Cancelled' | 'Postponed',
    weather: {
      windSpeed: 0,
      windDirection: '',
      temperature: 0,
      visibility: '',
      conditions: ''
    },
    classes: [] as RaceClass[],
    documents: {
      results: '',
      photos: '',
      report: ''
    }
  });

  // Current class being edited
  const [currentClass, setCurrentClass] = useState<RaceClass>({
    name: '',
    results: [],
    startTime: '',
    course: '',
    distance: 0,
    finishers: 0
  });

  // Current result being edited
  const [currentResult, setCurrentResult] = useState<RaceResult>({
    position: 1,
    boat: '',
    skipper: '',
    sailNumber: '',
    points: 1,
    finishTime: '',
    correctedTime: '',
    note: ''
  });

  const [showClassForm, setShowClassForm] = useState(false);
  const [showResultForm, setShowResultForm] = useState(false);
  const [editingClassIndex, setEditingClassIndex] = useState<number | null>(null);
  const [editingResultIndex, setEditingResultIndex] = useState<number | null>(null);

  const storyCategories = ['Club News', 'Racing', 'Training', 'Social', 'Announcements'];
  const eventCategories = ['Racing', 'Training', 'Social', 'Cruising', 'Committee'];
  const resultTypes: ('Championship' | 'Series' | 'Fun Race' | 'Regatta')[] = ['Championship', 'Series', 'Fun Race', 'Regatta'];
  const resultStatuses: ('Completed' | 'Provisional' | 'Cancelled' | 'Postponed')[] = ['Completed', 'Provisional', 'Cancelled', 'Postponed'];
  const windDirections = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

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
      noticeOfRacePdf: '',
      sailingInstructionsPdf: ''
    });
  };

  const resetResultForm = () => {
    setResultFormData({
      title: '',
      date: '',
      location: '',
      eventId: 0,
      organizer: 'East Down Yacht Club',
      officer: '',
      startTime: '',
      participants: 0,
      type: 'Regatta',
      status: 'Completed',
      weather: {
        windSpeed: 0,
        windDirection: '',
        temperature: 0,
        visibility: '',
        conditions: ''
      },
      classes: [],
      documents: {
        results: '',
        photos: '',
        report: ''
      }
    });
    setCurrentClass({
      name: '',
      results: [],
      startTime: '',
      course: '',
      distance: 0,
      finishers: 0
    });
    setCurrentResult({
      position: 1,
      boat: '',
      skipper: '',
      sailNumber: '',
      points: 1,
      finishTime: '',
      correctedTime: '',
      note: ''
    });
    setShowClassForm(false);
    setShowResultForm(false);
    setEditingClassIndex(null);
    setEditingResultIndex(null);
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
    } else {
      setEventFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventFormData.title || !eventFormData.description || !eventFormData.date || !eventFormData.time || !eventFormData.location) {
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
      sailingInstructionsPdf: eventFormData.sailingInstructionsPdf || undefined
    };

    if (editingEvent) {
      setEvents(prev => prev.map(event => event.id === editingEvent.id ? newEvent : event));
    } else {
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
    setActiveSection('edit');
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    const dateValue = event.isRecurring ? event.date : (event.dateObj ? event.dateObj.toISOString().split('T')[0] : '');
    setEventFormData({
      title: event.title,
      description: event.description,
      date: dateValue,
      time: event.time,
      location: event.location,
      category: event.category,
      image: event.image,
      hasResults: event.hasResults,
      resultsUrl: event.resultsUrl || '',
      isRecurring: event.isRecurring,
      noticeOfRacePdf: event.noticeOfRacePdf || '',
      sailingInstructionsPdf: event.sailingInstructionsPdf || ''
    });
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

  // Race Results handlers
  const handleResultInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith('weather.')) {
      const weatherField = name.split('.')[1];
      setResultFormData(prev => ({
        ...prev,
        weather: {
          ...prev.weather,
          [weatherField]: type === 'number' ? parseFloat(value) || 0 : value
        }
      }));
    } else if (name.startsWith('documents.')) {
      const docField = name.split('.')[1];
      setResultFormData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [docField]: value
        }
      }));
    } else {
      const processedValue = type === 'number' ? parseFloat(value) || 0 : value;
      setResultFormData(prev => ({ ...prev, [name]: processedValue }));
    }
  };

  const handleResultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resultFormData.title || !resultFormData.date || !resultFormData.location) {
      alert('Please fill in all required fields');
      return;
    }

    const newResult: RaceResultEvent = {
      id: editingResult ? editingResult.id : Date.now(),
      title: resultFormData.title,
      date: resultFormData.date,
      location: resultFormData.location,
      eventId: resultFormData.eventId,
      organizer: resultFormData.organizer,
      officer: resultFormData.officer,
      startTime: resultFormData.startTime,
      participants: resultFormData.participants,
      type: resultFormData.type,
      status: resultFormData.status,
      weather: resultFormData.weather.windSpeed > 0 ? resultFormData.weather : undefined,
      classes: resultFormData.classes,
      documents: {
        results: resultFormData.documents.results || undefined,
        photos: resultFormData.documents.photos || undefined,
        report: resultFormData.documents.report || undefined
      }
    };

    if (editingResult) {
      setRaceResults(prev => prev.map(result => result.id === editingResult.id ? newResult : result));
    } else {
      setRaceResults(prev => [newResult, ...prev]);
    }

    resetResultForm();
    setEditingResult(null);
    setActiveSection('list');
  };

  const handleEditResult = (result: RaceResultEvent) => {
    setEditingResult(result);
    setResultFormData({
      title: result.title,
      date: result.date,
      location: result.location,
      eventId: result.eventId,
      organizer: result.organizer,
      officer: result.officer || '',
      startTime: result.startTime,
      participants: result.participants,
      type: result.type,
      status: result.status,
      weather: result.weather || {
        windSpeed: 0,
        windDirection: '',
        temperature: 0,
        visibility: '',
        conditions: ''
      },
      classes: result.classes,
      documents: {
        results: result.documents?.results || '',
        photos: result.documents?.photos || '',
        report: result.documents?.report || ''
      }
    });
    setActiveSection('edit');
  };

  const handleDeleteRaceResult = (id: number) => {
    if (window.confirm('Are you sure you want to delete this race result?')) {
      setRaceResults(prev => prev.filter(result => result.id !== id));
    }
  };

  // Class management handlers
  const handleClassInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const processedValue = type === 'number' ? parseFloat(value) || 0 : value;
    setCurrentClass(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleAddClass = () => {
    if (!currentClass.name) {
      alert('Please enter a class name');
      return;
    }

    if (editingClassIndex !== null) {
      const updatedClasses = [...resultFormData.classes];
      updatedClasses[editingClassIndex] = { ...currentClass, results: currentClass.results };
      setResultFormData(prev => ({ ...prev, classes: updatedClasses }));
      setEditingClassIndex(null);
    } else {
      setResultFormData(prev => ({
        ...prev,
        classes: [...prev.classes, { ...currentClass, results: [] }]
      }));
    }

    setCurrentClass({
      name: '',
      results: [],
      startTime: '',
      course: '',
      distance: 0,
      finishers: 0
    });
    setShowClassForm(false);
  };

  const handleEditClass = (index: number) => {
    const classToEdit = resultFormData.classes[index];
    setCurrentClass({ ...classToEdit });
    setEditingClassIndex(index);
    setShowClassForm(true);
  };

  const handleDeleteClass = (index: number) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      const updatedClasses = resultFormData.classes.filter((_, i) => i !== index);
      setResultFormData(prev => ({ ...prev, classes: updatedClasses }));
    }
  };

  // Result management handlers
  const handleResultItemInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const processedValue = type === 'number' ? parseFloat(value) || 0 : value;
    setCurrentResult(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleAddResult = (classIndex: number) => {
    if (!currentResult.boat || !currentResult.skipper) {
      alert('Please enter boat name and skipper');
      return;
    }

    const updatedClasses = [...resultFormData.classes];
    
    if (editingResultIndex !== null) {
      updatedClasses[classIndex].results[editingResultIndex] = { ...currentResult };
      setEditingResultIndex(null);
    } else {
      // Auto-assign position based on existing results
      const nextPosition = updatedClasses[classIndex].results.length + 1;
      updatedClasses[classIndex].results.push({ 
        ...currentResult, 
        position: currentResult.position || nextPosition,
        points: currentResult.points || nextPosition
      });
    }

    // Sort results by position
    updatedClasses[classIndex].results.sort((a, b) => a.position - b.position);
    
    // Update finishers count
    updatedClasses[classIndex].finishers = updatedClasses[classIndex].results.length;
    
    setResultFormData(prev => ({ ...prev, classes: updatedClasses }));
    setCurrentResult({
      position: 1,
      boat: '',
      skipper: '',
      sailNumber: '',
      points: 1,
      finishTime: '',
      correctedTime: '',
      note: ''
    });
    setShowResultForm(false);
  };

  const handleEditResultItem = (classIndex: number, resultIndex: number) => {
    const resultToEdit = resultFormData.classes[classIndex].results[resultIndex];
    setCurrentResult({ ...resultToEdit });
    setEditingResultIndex(resultIndex);
    setShowResultForm(true);
  };

  const handleDeleteResultItem = (classIndex: number, resultIndex: number) => {
    if (window.confirm('Are you sure you want to delete this result?')) {
      const updatedClasses = [...resultFormData.classes];
      updatedClasses[classIndex].results.splice(resultIndex, 1);
      
      // Reassign positions
      updatedClasses[classIndex].results.forEach((result, index) => {
        result.position = index + 1;
        result.points = index + 1;
      });
      
      // Update finishers count
      updatedClasses[classIndex].finishers = updatedClasses[classIndex].results.length;
      
      setResultFormData(prev => ({ ...prev, classes: updatedClasses }));
    }
  };

  const handleNewItem = () => {
    if (activeTab === 'stories') {
      resetStoryForm();
      setEditingStory(null);
    } else if (activeTab === 'events') {
      resetEventForm();
      setEditingEvent(null);
    } else if (activeTab === 'results') {
      resetResultForm();
      setEditingResult(null);
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
    } else if (activeTab === 'results') {
      resetResultForm();
      setEditingResult(null);
    }
    setActiveSection('list');
  };

  const handleTabSwitch = (tab: 'stories' | 'events' | 'results') => {
    setActiveTab(tab);
    setActiveSection('list');
    resetStoryForm();
    resetEventForm();
    resetResultForm();
    setEditingStory(null);
    setEditingEvent(null);
    setEditingResult(null);
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
                New {activeTab === 'stories' ? 'Story' : activeTab === 'events' ? 'Event' : 'Race Result'}
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
              <button
                onClick={() => handleTabSwitch('results')}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'results'
                    ? 'bg-white text-[#1e3a8a] shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Trophy size={16} className="mr-2" />
                Race Results ({raceResults.length})
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

        {/* Race Results List */}
        {activeSection === 'list' && activeTab === 'results' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Race Results ({raceResults.length})</h2>
            </div>
            
            <div className="grid gap-6">
              {raceResults.map(result => (
                <div key={result.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <span className={`text-sm px-3 py-1 rounded-full ${
                          result.type === 'Championship' ? 'bg-yellow-100 text-yellow-800' :
                          result.type === 'Series' ? 'bg-blue-100 text-blue-800' :
                          result.type === 'Fun Race' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {result.type}
                        </span>
                        <span className={`text-sm px-3 py-1 rounded-full ${
                          result.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          result.status === 'Provisional' ? 'bg-yellow-100 text-yellow-800' :
                          result.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {result.status}
                        </span>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar size={14} className="mr-1" />
                          {result.date}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock size={14} className="mr-1" />
                          {result.startTime}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Users size={14} className="mr-1" />
                          {result.participants} participants
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">{result.title}</h3>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <MapPin size={14} className="mr-1" />
                        {result.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Trophy size={14} className="mr-1" />
                        {result.classes.length} classes • {result.classes.reduce((sum, cls) => sum + cls.results.length, 0)} total results
                      </div>
                      {result.weather && (
                        <div className="flex items-center text-sm text-gray-500 mt-2">
                          <Wind size={14} className="mr-1" />
                          {result.weather.windSpeed}kt {result.weather.windDirection} • {result.weather.temperature}°C
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 pt-4 border-t">
                    <button
                      onClick={() => handleEditResult(result)}
                      className="text-[#0284c7] hover:text-blue-700 text-sm font-medium flex items-center"
                    >
                      <Edit size={14} className="mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteRaceResult(result.id)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center"
                    >
                      <Trash2 size={14} className="mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              
              {raceResults.length === 0 && (
                <div className="text-center py-12">
                  <Trophy size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No race results yet</h3>
                  <p className="text-gray-500">Create your first race result to get started.</p>
                </div>
              )}
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
                    Date/Pattern *
                  </label>
                  <input
                    type={eventFormData.isRecurring ? 'text' : 'date'}
                    name="date"
                    value={eventFormData.date}
                    onChange={handleEventInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={eventFormData.isRecurring ? "e.g., 'Every Wednesday'" : ''}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time *
                  </label>
                  <input
                    type="text"
                    name="time"
                    value={eventFormData.time}
                    onChange={handleEventInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., '10:00 AM - 4:00 PM'"
                    required
                  />
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Featured Image URL
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={eventFormData.image}
                    onChange={handleEventInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notice of Race PDF URL
                  </label>
                  <input
                    type="url"
                    name="noticeOfRacePdf"
                    value={eventFormData.noticeOfRacePdf}
                    onChange={handleEventInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/notice-of-race.pdf"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sailing Instructions PDF URL
                  </label>
                  <input
                    type="url"
                    name="sailingInstructionsPdf"
                    value={eventFormData.sailingInstructionsPdf}
                    onChange={handleEventInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/sailing-instructions.pdf"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isRecurring"
                    checked={eventFormData.isRecurring}
                    onChange={handleEventInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Recurring Event</span>
                </label>

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

        {/* Race Results Form */}
        {(activeSection === 'new' || activeSection === 'edit') && activeTab === 'results' && (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              {editingResult ? 'Edit Race Result' : 'Create New Race Result'}
            </h2>
            
            <form onSubmit={handleResultSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Event Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={resultFormData.title}
                      onChange={handleResultInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter event title..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Link to Event
                    </label>
                    <select
                      name="eventId"
                      value={resultFormData.eventId}
                      onChange={handleResultInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value={0}>Select an event (optional)</option>
                      {events.map(event => (
                        <option key={event.id} value={event.id}>
                          {event.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={resultFormData.date}
                      onChange={handleResultInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time *
                    </label>
                    <input
                      type="text"
                      name="startTime"
                      value={resultFormData.startTime}
                      onChange={handleResultInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 10:00 AM"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Participants
                    </label>
                    <input
                      type="number"
                      name="participants"
                      value={resultFormData.participants}
                      onChange={handleResultInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={resultFormData.location}
                    onChange={handleResultInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Event location..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      name="type"
                      value={resultFormData.type}
                      onChange={handleResultInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {resultTypes.map(type => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={resultFormData.status}
                      onChange={handleResultInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {resultStatuses.map(status => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organizer
                    </label>
                    <input
                      type="text"
                      name="organizer"
                      value={resultFormData.organizer}
                      onChange={handleResultInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Event organizer..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Officer of the Day
                    </label>
                    <input
                      type="text"
                      name="officer"
                      value={resultFormData.officer}
                      onChange={handleResultInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Officer name..."
                    />
                  </div>
                </div>
              </div>

              {/* Weather Conditions */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                  <Wind className="mr-2" size={20} />
                  Weather Conditions
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Wind Speed (knots)
                    </label>
                    <input
                      type="number"
                      name="weather.windSpeed"
                      value={resultFormData.weather.windSpeed}
                      onChange={handleResultInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Wind Direction
                    </label>
                    <select
                      name="weather.windDirection"
                      value={resultFormData.weather.windDirection}
                      onChange={handleResultInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select direction</option>
                      {windDirections.map(direction => (
                        <option key={direction} value={direction}>
                          {direction}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Temperature (°C)
                    </label>
                    <input
                      type="number"
                      name="weather.temperature"
                      value={resultFormData.weather.temperature}
                      onChange={handleResultInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Visibility
                    </label>
                    <select
                      name="weather.visibility"
                      value={resultFormData.weather.visibility}
                      onChange={handleResultInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select visibility</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Poor">Poor</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Conditions Description
                  </label>
                  <textarea
                    name="weather.conditions"
                    value={resultFormData.weather.conditions}
                    onChange={handleResultInputChange}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description of conditions..."
                  />
                </div>
              </div>

              {/* Race Classes */}
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-800 flex items-center">
                    <Trophy className="mr-2" size={20} />
                    Race Classes ({resultFormData.classes.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowClassForm(!showClassForm)}
                    className="bg-[#0284c7] hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center text-sm"
                  >
                    <Plus size={16} className="mr-1" />
                    {editingClassIndex !== null ? 'Edit Class' : 'Add Class'}
                  </button>
                </div>

                {/* Class Form */}
                {showClassForm && (
                  <div className="bg-white p-4 rounded-lg border-2 border-green-200 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Class Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={currentClass.name}
                          onChange={handleClassInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., IRC Class 1"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Start Time
                        </label>
                        <input
                          type="text"
                          name="startTime"
                          value={currentClass.startTime}
                          onChange={handleClassInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., 10:00 AM"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Course
                        </label>
                        <input
                          type="text"
                          name="course"
                          value={currentClass.course}
                          onChange={handleClassInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Windward/Leeward"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Distance (nm)
                        </label>
                        <input
                          type="number"
                          name="distance"
                          value={currentClass.distance}
                          onChange={handleClassInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                          step="0.1"
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleAddClass}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                      >
                        {editingClassIndex !== null ? 'Update Class' : 'Add Class'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowClassForm(false);
                          setEditingClassIndex(null);
                          setCurrentClass({
                            name: '',
                            results: [],
                            startTime: '',
                            course: '',
                            distance: 0,
                            finishers: 0
                          });
                        }}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Classes List */}
                <div className="space-y-4">
                  {resultFormData.classes.map((raceClass, classIndex) => (
                    <div key={classIndex} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 border-b">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{raceClass.name}</h4>
                            <p className="text-sm text-gray-500">
                              {raceClass.startTime && `Start: ${raceClass.startTime}`}
                              {raceClass.course && ` • Course: ${raceClass.course}`}
                              {raceClass.distance && ` • Distance: ${raceClass.distance}nm`}
                              {` • ${raceClass.results.length} results`}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setShowResultForm(!showResultForm);
                                setCurrentResult({
                                  position: raceClass.results.length + 1,
                                  boat: '',
                                  skipper: '',
                                  sailNumber: '',
                                  points: raceClass.results.length + 1,
                                  finishTime: '',
                                  correctedTime: '',
                                  note: ''
                                });
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs flex items-center"
                            >
                              <Plus size={12} className="mr-1" />
                              Add Result
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEditClass(classIndex)}
                              className="text-blue-600 hover:text-blue-700 text-xs flex items-center"
                            >
                              <Edit size={12} className="mr-1" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteClass(classIndex)}
                              className="text-red-600 hover:text-red-700 text-xs flex items-center"
                            >
                              <Trash2 size={12} className="mr-1" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Results Form */}
                      {showResultForm && (
                        <div className="bg-blue-50 p-4 border-b">
                          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Position *
                              </label>
                              <input
                                type="number"
                                name="position"
                                value={currentResult.position}
                                onChange={handleResultItemInputChange}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                min="1"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Boat Name *
                              </label>
                              <input
                                type="text"
                                name="boat"
                                value={currentResult.boat}
                                onChange={handleResultItemInputChange}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Skipper *
                              </label>
                              <input
                                type="text"
                                name="skipper"
                                value={currentResult.skipper}
                                onChange={handleResultItemInputChange}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Sail Number
                              </label>
                              <input
                                type="text"
                                name="sailNumber"
                                value={currentResult.sailNumber}
                                onChange={handleResultItemInputChange}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Finish Time
                              </label>
                              <input
                                type="text"
                                name="finishTime"
                                value={currentResult.finishTime}
                                onChange={handleResultItemInputChange}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                placeholder="HH:MM:SS"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Points
                              </label>
                              <input
                                type="number"
                                name="points"
                                value={currentResult.points}
                                onChange={handleResultItemInputChange}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                min="0"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Corrected Time
                              </label>
                              <input
                                type="text"
                                name="correctedTime"
                                value={currentResult.correctedTime}
                                onChange={handleResultItemInputChange}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                placeholder="HH:MM:SS"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Notes
                              </label>
                              <input
                                type="text"
                                name="note"
                                value={currentResult.note}
                                onChange={handleResultItemInputChange}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                placeholder="Any additional notes..."
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleAddResult(classIndex)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                            >
                              {editingResultIndex !== null ? 'Update Result' : 'Add Result'}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowResultForm(false);
                                setEditingResultIndex(null);
                                setCurrentResult({
                                  position: 1,
                                  boat: '',
                                  skipper: '',
                                  sailNumber: '',
                                  points: 1,
                                  finishTime: '',
                                  correctedTime: '',
                                  note: ''
                                });
                              }}
                              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Results Table */}
                      {raceClass.results.length > 0 && (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Pos</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Boat</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Skipper</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Sail</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Finish</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Points</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {raceClass.results.map((result, resultIndex) => (
                                <tr key={resultIndex} className="hover:bg-gray-50">
                                  <td className="px-3 py-2 font-medium">{result.position}</td>
                                  <td className="px-3 py-2">{result.boat}</td>
                                  <td className="px-3 py-2">{result.skipper}</td>
                                  <td className="px-3 py-2">{result.sailNumber || '-'}</td>
                                  <td className="px-3 py-2">{result.finishTime || result.correctedTime || '-'}</td>
                                  <td className="px-3 py-2">{result.points}</td>
                                  <td className="px-3 py-2">
                                    <div className="flex items-center gap-1">
                                      <button
                                        type="button"
                                        onClick={() => handleEditResultItem(classIndex, resultIndex)}
                                        className="text-blue-600 hover:text-blue-700"
                                      >
                                        <Edit size={12} />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteResultItem(classIndex, resultIndex)}
                                        className="text-red-600 hover:text-red-700"
                                      >
                                        <Trash2 size={12} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Documents (Optional)</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Results PDF URL
                    </label>
                    <input
                      type="url"
                      name="documents.results"
                      value={resultFormData.documents.results}
                      onChange={handleResultInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/results.pdf"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Photos URL
                    </label>
                    <input
                      type="url"
                      name="documents.photos"
                      value={resultFormData.documents.photos}
                      onChange={handleResultInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/gallery"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Report URL
                    </label>
                    <input
                      type="url"
                      name="documents.report"
                      value={resultFormData.documents.report}
                      onChange={handleResultInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/report"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center gap-4 pt-6 border-t">
                <button
                  type="submit"
                  className="bg-[#0284c7] hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center transition-colors"
                >
                  <Save size={18} className="mr-2" />
                  {editingResult ? 'Update Race Result' : 'Publish Race Result'}
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