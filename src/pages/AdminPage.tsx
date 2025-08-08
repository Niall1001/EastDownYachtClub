import React, { useState, useEffect } from 'react';
import { Plus, Save, X, Eye, Calendar, User, ArrowLeft, MapPin, Clock, Sailboat, FileText, Trophy, Trash2, Edit } from 'lucide-react';
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
  noticeOfRacePdf?: string;
  sailingInstructionsPdf?: string;
  boatEntries: BoatEntry[];
}

// Race Results interfaces (matching RaceResultsPage)
interface RaceResult {
  boat: string;
  skipper: string;
  sailNumber?: string;
  finishTime?: string;
  correctedTime?: string;
  dnf: boolean;
  note?: string;
}

interface RaceClass {
  name: string;
  results: RaceResult[];
}


interface RaceResultEvent {
  id: number;
  date: string;
  organizer: string;
  officer?: string;
  classes: RaceClass[];
  documents?: {
    results?: string;
    photos?: string;
    report?: string;
  };
}

// Predefined sailing classes for consistent classification across the application
const SAILING_CLASSES = [
  'IRC Class 1',
  'IRC Class 2', 
  'IRC Class 3',
  'Cruiser Class',
  'Dinghy Class',
  'Multihull Class',
  'Classic Class',
  'J24 Class'
];

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

  // Load race results from localStorage with migration
  const loadRaceResults = (): RaceResultEvent[] => {
    try {
      const stored = localStorage.getItem('adminRaceResults');
      if (!stored) return [];
      
      const results = JSON.parse(stored);
      
      // Migrate old race results format
      return results.map((result: any) => ({
        ...result,
        classes: result.classes.map((raceClass: any) => ({
          ...raceClass,
          results: raceClass.results.map((raceResult: any) => ({
            boat: raceResult.boat || '',
            skipper: raceResult.skipper || '',
            sailNumber: raceResult.sailNumber || '',
            finishTime: raceResult.finishTime || '',
            correctedTime: raceResult.correctedTime || '',
            dnf: raceResult.dnf !== undefined ? raceResult.dnf : false,
            note: raceResult.note || ''
          }))
        }))
      }));
    } catch (error) {
      console.error('Error loading race results:', error);
      return [];
    }
  };

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

  const saveRaceResults = (results: RaceResultEvent[]) => {
    try {
      localStorage.setItem('adminRaceResults', JSON.stringify(results));
    } catch (error) {
      console.error('Error saving race results:', error);
    }
  };

  // Race results state
  const [raceResults, setRaceResults] = useState<RaceResultEvent[]>(loadRaceResults);

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

  // Save race results to localStorage when state changes
  useEffect(() => {
    saveRaceResults(raceResults);
  }, [raceResults]);

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
    noticeOfRacePdf: '',
    sailingInstructionsPdf: '',
    boatEntries: [] as BoatEntry[]
  });

  // Race results form state
  const [resultFormData, setResultFormData] = useState({
    date: '',
    organizer: 'East Down Yacht Club',
    officer: '',
    eventId: null as number | null,
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
    results: []
  });

  // Current result being edited
  const [currentResult, setCurrentResult] = useState<RaceResult>({
    boat: '',
    skipper: '',
    sailNumber: '',
    finishTime: '',
    correctedTime: '',
    dnf: false,
    note: ''
  });

  const [showClassForm, setShowClassForm] = useState(false);
  const [showResultForm, setShowResultForm] = useState(false);
  const [editingClassIndex, setEditingClassIndex] = useState<number | null>(null);
  const [editingResultIndex, setEditingResultIndex] = useState<number | null>(null);

  // Boat entry management state
  const [showBoatEntryForm, setShowBoatEntryForm] = useState(false);
  const [currentBoatEntry, setCurrentBoatEntry] = useState<BoatEntry>({
    id: '',
    boat: '',
    skipper: '',
    sailNumber: '',
    class: ''
  });
  const [editingBoatEntryIndex, setEditingBoatEntryIndex] = useState<number | null>(null);

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
      noticeOfRacePdf: '',
      sailingInstructionsPdf: '',
      boatEntries: []
    });
    setShowBoatEntryForm(false);
    setCurrentBoatEntry({
      id: '',
      boat: '',
      skipper: '',
      sailNumber: '',
      class: ''
    });
    setEditingBoatEntryIndex(null);
  };

  const resetResultForm = () => {
    setResultFormData({
      date: '',
      organizer: 'East Down Yacht Club',
      officer: '',
      eventId: null,
      classes: [],
      documents: {
        results: '',
        photos: '',
        report: ''
      }
    });
    setCurrentClass({
      name: '',
      results: []
    });
    setCurrentResult({
      boat: '',
      skipper: '',
      sailNumber: '',
      finishTime: '',
      correctedTime: '',
      dnf: false,
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

  // Race Results handlers
  const handleResultInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('documents.')) {
      const docField = name.split('.')[1];
      setResultFormData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [docField]: value
        }
      }));
    } else if (name === 'eventId') {
      const eventId = value ? parseInt(value) : null;
      setResultFormData(prev => ({ ...prev, [name]: eventId }));
      
      // Auto-populate classes with boats from selected event
      if (eventId) {
        handleEventSelection(eventId);
      }
    } else {
      setResultFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEventSelection = (eventId: number) => {
    const selectedEvent = events.find(event => event.id === eventId);
    if (!selectedEvent || !selectedEvent.boatEntries.length) {
      return;
    }

    // Group boats by class
    const classesByName = selectedEvent.boatEntries.reduce((acc, entry) => {
      if (!acc[entry.class]) {
        acc[entry.class] = {
          name: entry.class,
          results: []
        };
      }
      
      // Create a result entry for each boat (with empty times, not DNF by default)
      acc[entry.class].results.push({
        boat: entry.boat,
        skipper: entry.skipper,
        sailNumber: entry.sailNumber || '',
        finishTime: '',
        correctedTime: '',
        dnf: false,
        note: ''
      });
      
      return acc;
    }, {} as { [key: string]: RaceClass });

    const populatedClasses = Object.values(classesByName);
    setResultFormData(prev => ({
      ...prev,
      classes: populatedClasses
    }));
  };

  const handleResultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resultFormData.date || !resultFormData.organizer) {
      alert('Please fill in all required fields');
      return;
    }

    const newResult: RaceResultEvent = {
      id: editingResult ? editingResult.id : Date.now(),
      date: resultFormData.date,
      organizer: resultFormData.organizer,
      officer: resultFormData.officer,
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
      date: result.date,
      organizer: result.organizer,
      officer: result.officer || '',
      eventId: null, // Can't determine original event from result
      classes: result.classes,
      documents: {
        results: result.documents?.results || '',
        photos: result.documents?.photos || '',
        report: result.documents?.report || ''
      }
    });
    setActiveTab('results'); // Ensure we're on the results tab
    setActiveSection('edit');
  };

  const handleDeleteRaceResult = (id: number) => {
    if (window.confirm('Are you sure you want to delete this race result?')) {
      setRaceResults(prev => prev.filter(result => result.id !== id));
    }
  };

  // Class management handlers
  const handleClassInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentClass(prev => ({ ...prev, [name]: value }));
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
      results: []
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
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setCurrentResult(prev => ({ ...prev, [name]: checked }));
    } else {
      const processedValue = type === 'number' ? parseFloat(value) || 0 : value;
      setCurrentResult(prev => ({ ...prev, [name]: processedValue }));
    }
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
      updatedClasses[classIndex].results.push({ ...currentResult });
    }
    
    setResultFormData(prev => ({ ...prev, classes: updatedClasses }));
    setCurrentResult({
      boat: '',
      skipper: '',
      sailNumber: '',
      finishTime: '',
      correctedTime: '',
      dnf: false,
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
      setResultFormData(prev => ({ ...prev, classes: updatedClasses }));
    }
  };

  // Boat entry handlers
  const handleBoatEntryInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentBoatEntry(prev => ({ ...prev, [name]: value }));
  };

  const handleAddBoatEntry = () => {
    if (!currentBoatEntry.boat || !currentBoatEntry.skipper || !currentBoatEntry.class) {
      alert('Please fill in boat name, skipper, and class');
      return;
    }

    const newEntry: BoatEntry = {
      ...currentBoatEntry,
      id: editingBoatEntryIndex !== null ? currentBoatEntry.id : Date.now().toString()
    };

    if (editingBoatEntryIndex !== null) {
      const updatedEntries = [...eventFormData.boatEntries];
      updatedEntries[editingBoatEntryIndex] = newEntry;
      setEventFormData(prev => ({ ...prev, boatEntries: updatedEntries }));
      setEditingBoatEntryIndex(null);
    } else {
      setEventFormData(prev => ({
        ...prev,
        boatEntries: [...prev.boatEntries, newEntry]
      }));
    }

    setCurrentBoatEntry({
      id: '',
      boat: '',
      skipper: '',
      sailNumber: '',
      class: ''
    });
    setShowBoatEntryForm(false);
  };

  const handleEditBoatEntry = (index: number) => {
    const entryToEdit = eventFormData.boatEntries[index];
    setCurrentBoatEntry({ ...entryToEdit });
    setEditingBoatEntryIndex(index);
    setShowBoatEntryForm(true);
  };

  const handleDeleteBoatEntry = (index: number) => {
    if (window.confirm('Are you sure you want to delete this boat entry?')) {
      const updatedEntries = eventFormData.boatEntries.filter((_, i) => i !== index);
      setEventFormData(prev => ({ ...prev, boatEntries: updatedEntries }));
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
              <h1 className="text-2xl font-bold text-[#843c5c]">Admin Console</h1>
              <p className="text-gray-600 mt-1">
                Manage stories and events • Logged in as <span className="font-medium text-[#843c5c]">{user?.name}</span>
              </p>
            </div>
            {activeSection === 'list' && (
              <button
                onClick={handleNewItem}
                className="bg-[#843c5c] hover:bg-[#a05a7a] text-white px-4 py-2 rounded-lg flex items-center transition-colors"
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
                    ? 'bg-white text-[#843c5c] shadow-sm'
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
                    ? 'bg-white text-[#843c5c] shadow-sm'
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
                    ? 'bg-white text-[#843c5c] shadow-sm'
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
                        <span className="bg-[#843c5c] text-white text-sm px-3 py-1 rounded-full">
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
                      <h3 className="text-lg font-semibold text-[#843c5c] mb-2">{story.title}</h3>
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
                      className="text-[#843c5c] hover:text-[#a05a7a] text-sm font-medium flex items-center"
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
                        <span className="bg-[#843c5c] text-white text-sm px-3 py-1 rounded-full">
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
                      <h3 className="text-lg font-semibold text-[#843c5c] mb-2">{event.title}</h3>
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
                      className="text-[#843c5c] hover:text-[#a05a7a] text-sm font-medium flex items-center"
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
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar size={14} className="mr-1" />
                          {result.date}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <User size={14} className="mr-1" />
                          {result.organizer}
                        </div>
                        {result.officer && (
                          <div className="flex items-center text-sm text-gray-500">
                            <User size={14} className="mr-1" />
                            Officer: {result.officer}
                          </div>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-[#843c5c] mb-2">
                        Race Results - {new Date(result.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600">
                        <Trophy size={14} className="mr-1" />
                        {result.classes.length} classes • {result.classes.reduce((sum, cls) => sum + cls.results.length, 0)} total results
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 pt-4 border-t">
                    <button
                      onClick={() => handleEditResult(result)}
                      className="text-[#843c5c] hover:text-[#a05a7a] text-sm font-medium flex items-center"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#843c5c] focus:border-transparent"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#843c5c] focus:border-transparent"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#843c5c] focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#843c5c] focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#843c5c] focus:border-transparent"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#843c5c] focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Leave empty to use default yacht image
                </p>
              </div>

              <div className="flex items-center gap-4 pt-6 border-t">
                <button
                  type="submit"
                  className="bg-[#843c5c] hover:bg-[#a05a7a] text-white px-6 py-2 rounded-lg flex items-center transition-colors"
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
        {(() => {
          console.log('Event Form Render Check:', {
            activeSection,
            activeTab,
            editingEvent,
            shouldRender: (activeSection === 'new' || activeSection === 'edit') && activeTab === 'events'
          });
          return (activeSection === 'new' || activeSection === 'edit') && activeTab === 'events';
        })() && (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              {editingEvent ? 'Edit Event' : 'Create New Event'}
            </h2>
            
            <form onSubmit={handleEventSubmit} className="space-y-6">
              {(() => {
                console.log('Event Form Fields - eventFormData:', eventFormData);
                return null;
              })()}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={eventFormData.title}
                  onChange={handleEventInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#843c5c] focus:border-transparent"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#843c5c] focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#843c5c] focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#843c5c] focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#843c5c] focus:border-transparent"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#843c5c] focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#843c5c] focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#843c5c] focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#843c5c] focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#843c5c] focus:border-transparent"
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

              {/* Boat Entries Section */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-800 flex items-center">
                    <Sailboat className="mr-2" size={20} />
                    Boat Entries ({eventFormData.boatEntries.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowBoatEntryForm(!showBoatEntryForm)}
                    className="bg-[#843c5c] hover:bg-[#a05a7a] text-white px-4 py-2 rounded-lg flex items-center text-sm"
                  >
                    <Plus size={16} className="mr-1" />
                    {editingBoatEntryIndex !== null ? 'Edit Entry' : 'Add Boat'}
                  </button>
                </div>

                {/* Boat Entry Form */}
                {showBoatEntryForm && (
                  <div className="bg-white p-4 rounded-lg border-2 border-blue-200 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Boat Name *
                        </label>
                        <input
                          type="text"
                          name="boat"
                          value={currentBoatEntry.boat}
                          onChange={handleBoatEntryInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#843c5c]"
                          placeholder="e.g., Sea Sprite"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Skipper *
                        </label>
                        <input
                          type="text"
                          name="skipper"
                          value={currentBoatEntry.skipper}
                          onChange={handleBoatEntryInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#843c5c]"
                          placeholder="Skipper name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sail Number
                        </label>
                        <input
                          type="text"
                          name="sailNumber"
                          value={currentBoatEntry.sailNumber}
                          onChange={handleBoatEntryInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#843c5c]"
                          placeholder="e.g., IRL123"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Class *
                        </label>
                        <select
                          name="class"
                          value={currentBoatEntry.class}
                          onChange={handleBoatEntryInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#843c5c]"
                          required
                        >
                          <option value="">Select a class</option>
                          {SAILING_CLASSES.map(sailingClass => (
                            <option key={sailingClass} value={sailingClass}>
                              {sailingClass}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleAddBoatEntry}
                        className="bg-[#843c5c] hover:bg-[#a05a7a] text-white px-4 py-2 rounded text-sm"
                      >
                        {editingBoatEntryIndex !== null ? 'Update Entry' : 'Add Entry'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowBoatEntryForm(false);
                          setEditingBoatEntryIndex(null);
                          setCurrentBoatEntry({
                            id: '',
                            boat: '',
                            skipper: '',
                            sailNumber: '',
                            class: ''
                          });
                        }}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Boat Entries Table */}
                {eventFormData.boatEntries.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Boat</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Skipper</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Sail Number</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Class</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {eventFormData.boatEntries.map((entry, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-3 py-2 font-medium">{entry.boat}</td>
                            <td className="px-3 py-2">{entry.skipper}</td>
                            <td className="px-3 py-2">{entry.sailNumber || '-'}</td>
                            <td className="px-3 py-2">{entry.class}</td>
                            <td className="px-3 py-2">
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleEditBoatEntry(index)}
                                  className="text-blue-600 hover:text-blue-700"
                                >
                                  <Edit size={12} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteBoatEntry(index)}
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

                {eventFormData.boatEntries.length === 0 && !showBoatEntryForm && (
                  <div className="text-center py-8">
                    <Sailboat size={48} className="mx-auto text-gray-400 mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No boats entered yet</h4>
                    <p className="text-gray-500">Add boats that have entered this event in advance.</p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 pt-6 border-t">
                <button
                  type="submit"
                  className="bg-[#843c5c] hover:bg-[#a05a7a] text-white px-6 py-2 rounded-lg flex items-center transition-colors"
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Link to Event (Optional)
                    </label>
                    <select
                      name="eventId"
                      value={resultFormData.eventId || ''}
                      onChange={handleResultInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#843c5c] focus:border-transparent"
                    >
                      <option value="">Select an event (optional)</option>
                      {events
                        .filter(event => event.boatEntries && event.boatEntries.length > 0)
                        .map(event => (
                          <option key={event.id} value={event.id}>
                            {event.title} ({event.date})
                          </option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Select an event to auto-populate boats that entered
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={resultFormData.date}
                      onChange={handleResultInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#843c5c] focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organizer *
                    </label>
                    <input
                      type="text"
                      name="organizer"
                      value={resultFormData.organizer}
                      onChange={handleResultInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#843c5c] focus:border-transparent"
                      placeholder="Event organizer..."
                      required
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#843c5c] focus:border-transparent"
                      placeholder="Officer name..."
                    />
                  </div>
                </div>
                
                {resultFormData.eventId && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start">
                      <Sailboat className="text-blue-600 mr-3 mt-1 flex-shrink-0" size={20} />
                      <div>
                        <h4 className="text-sm font-medium text-blue-900 mb-2">Auto-populated from selected event</h4>
                        <p className="text-sm text-blue-800 mb-3">
                          All boat entries have been loaded automatically from the selected event. 
                          You can now add finish times, corrected times, and DNF status for each boat.
                        </p>
                        {resultFormData.classes.length > 0 && (
                          <div className="text-sm text-blue-700">
                            <strong>Classes loaded:</strong> {resultFormData.classes.map(cls => cls.name).join(', ')}
                            <br />
                            <strong>Total boats:</strong> {resultFormData.classes.reduce((sum, cls) => sum + cls.results.length, 0)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
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
                    className="bg-[#843c5c] hover:bg-[#a05a7a] text-white px-4 py-2 rounded-lg flex items-center text-sm"
                  >
                    <Plus size={16} className="mr-1" />
                    {editingClassIndex !== null ? 'Edit Class' : 'Add Class'}
                  </button>
                </div>

                {/* Class Form */}
                {showClassForm && (
                  <div className="bg-white p-4 rounded-lg border-2 border-green-200 mb-4">
                    <div className="grid grid-cols-1 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Class Name *
                        </label>
                        <select
                          name="name"
                          value={currentClass.name}
                          onChange={handleClassInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#843c5c]"
                          required
                        >
                          <option value="">Select a class</option>
                          {SAILING_CLASSES.map(sailingClass => (
                            <option key={sailingClass} value={sailingClass}>
                              {sailingClass}
                            </option>
                          ))}
                        </select>
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
                            results: []
                          });
                        }}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Classes List - Improved UX with better organization */}
                <div className="space-y-4">
                  {resultFormData.classes.map((raceClass, classIndex) => (
                    <div key={classIndex} className="bg-white rounded-lg border-2 border-green-200 shadow-sm overflow-hidden">
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 px-4 py-3 border-b border-green-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Trophy className="text-green-600 mr-3" size={20} />
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">{raceClass.name}</h4>
                              <p className="text-sm text-gray-600">
                                {raceClass.results.length} boat{raceClass.results.length !== 1 ? 's' : ''} entered
                                {raceClass.results.filter(r => r.finishTime || r.dnf).length > 0 && (
                                  <span className="ml-2 text-green-600">• {raceClass.results.filter(r => r.finishTime || r.dnf).length} results recorded</span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setShowResultForm(!showResultForm);
                                setCurrentResult({
                                  boat: '',
                                  skipper: '',
                                  sailNumber: '',
                                  finishTime: '',
                                  correctedTime: '',
                                  dnf: false,
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
                          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-3">
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
                                Finish Time {currentResult.dnf ? '' : '*'}
                              </label>
                              <input
                                type="text"
                                name="finishTime"
                                value={currentResult.finishTime}
                                onChange={handleResultItemInputChange}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                placeholder="HH:MM:SS"
                                disabled={currentResult.dnf}
                                required={!currentResult.dnf}
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                DNF
                              </label>
                              <label className="flex items-center mt-1">
                                <input
                                  type="checkbox"
                                  name="dnf"
                                  checked={currentResult.dnf}
                                  onChange={handleResultItemInputChange}
                                  className="mr-2"
                                />
                                <span className="text-xs">Did Not Finish</span>
                              </label>
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
                                disabled={currentResult.dnf}
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
                                  boat: '',
                                  skipper: '',
                                  sailNumber: '',
                                  finishTime: '',
                                  correctedTime: '',
                                  dnf: false,
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

                      {/* Results Table - Enhanced UX with better styling */}
                      {raceClass.results.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Boat</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Skipper</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Sail #</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Finish Time</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Corrected Time</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Notes</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {raceClass.results.map((result, resultIndex) => {
                                const hasResult = result.finishTime || result.dnf;
                                return (
                                  <tr key={resultIndex} className={`hover:bg-blue-50 transition-colors ${
                                    hasResult ? 'bg-green-25' : 'bg-yellow-25'
                                  }`}>
                                    <td className="px-4 py-3">
                                      <div className="flex items-center">
                                        <Sailboat className="text-blue-500 mr-2" size={14} />
                                        <span className="font-medium text-gray-900">{result.boat}</span>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">{result.skipper}</td>
                                    <td className="px-4 py-3 text-gray-600 font-mono text-sm">{result.sailNumber || '-'}</td>
                                    <td className="px-4 py-3">
                                      {result.dnf ? (
                                        <span className="text-gray-400">-</span>
                                      ) : result.finishTime ? (
                                        <span className="font-mono text-sm text-gray-900">{result.finishTime}</span>
                                      ) : (
                                        <span className="text-yellow-600 text-sm italic">Not recorded</span>
                                      )}
                                    </td>
                                    <td className="px-4 py-3">
                                      {result.dnf ? (
                                        <span className="text-gray-400">-</span>
                                      ) : result.correctedTime ? (
                                        <span className="font-mono text-sm text-green-700 font-medium">{result.correctedTime}</span>
                                      ) : (
                                        <span className="text-gray-400">-</span>
                                      )}
                                    </td>
                                    <td className="px-4 py-3">
                                      {result.dnf ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                          DNF
                                        </span>
                                      ) : result.finishTime ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                          Finished
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                          Pending
                                        </span>
                                      )}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{result.note || '-'}</td>
                                    <td className="px-4 py-3">
                                      <div className="flex items-center gap-2">
                                        <button
                                          type="button"
                                          onClick={() => handleEditResultItem(classIndex, resultIndex)}
                                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 p-1 rounded transition-colors"
                                          title="Edit result"
                                        >
                                          <Edit size={14} />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteResultItem(classIndex, resultIndex)}
                                          className="text-red-600 hover:text-red-800 hover:bg-red-100 p-1 rounded transition-colors"
                                          title="Delete result"
                                        >
                                          <Trash2 size={14} />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="p-8 text-center">
                          <Sailboat size={48} className="mx-auto text-gray-400 mb-4" />
                          <h5 className="text-lg font-medium text-gray-900 mb-2">No boats in this class yet</h5>
                          <p className="text-gray-500">Add boats to this class by selecting an event with entries or manually adding results.</p>
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#843c5c] focus:border-transparent"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#843c5c] focus:border-transparent"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#843c5c] focus:border-transparent"
                      placeholder="https://example.com/report"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center gap-4 pt-6 border-t">
                <button
                  type="submit"
                  className="bg-[#843c5c] hover:bg-[#a05a7a] text-white px-6 py-2 rounded-lg flex items-center transition-colors"
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