import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Trophy, 
  Calendar as CalendarIcon, 
  MapPin, 
  Search, 
  Filter, 
  Wind, 
  Thermometer, 
  Eye,
  ArrowRight,
  ChevronDown,
  Download,
  Star,
  Users,
  Clock,
  Compass
} from 'lucide-react';

// TypeScript interfaces for race results data structure
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

const RaceResultsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedEvent, setSelectedEvent] = useState<string>(searchParams.get('event') || '');
  const [selectedClass, setSelectedClass] = useState<string>(searchParams.get('class') || '');
  const [selectedType, setSelectedType] = useState<string>(searchParams.get('type') || '');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Load race results from localStorage (created by admin) with fallback data
  const loadRaceResults = (): RaceResultEvent[] => {
    try {
      const stored = localStorage.getItem('adminRaceResults');
      if (stored) {
        const adminResults = JSON.parse(stored);
        if (adminResults.length > 0) {
          return adminResults;
        }
      }
    } catch (error) {
      console.error('Error loading admin race results:', error);
    }
    
    // Fallback to default data if no admin data exists
    return defaultRaceResults;
  };

  const [raceResults, setRaceResults] = useState<RaceResultEvent[]>([]);

  // Default race results data (fallback)
  const defaultRaceResults: RaceResultEvent[] = [
    {
      id: 1,
      title: 'Strangford Lough Regatta',
      date: 'August 15, 2024',
      location: 'Strangford Lough, Main Race Area',
      eventId: 1,
      type: 'Regatta',
      status: 'Completed',
      startTime: '10:00 AM',
      participants: 47,
      organizer: 'East Down Yacht Club',
      officer: 'John McDowell',
      weather: {
        windSpeed: 15,
        windDirection: 'SW',
        temperature: 18,
        visibility: 'Excellent',
        conditions: 'Perfect sailing conditions'
      },
      classes: [
        {
          name: 'IRC Class 1',
          startTime: '10:00 AM',
          course: 'Windward/Leeward',
          distance: 12.5,
          finishers: 8,
          results: [
            {
              position: 1,
              boat: 'Sea Wolf',
              skipper: 'John McDowell',
              sailNumber: 'GBR 1234',
              points: 1,
              finishTime: '14:25:32',
              correctedTime: '14:18:45'
            },
            {
              position: 2,
              boat: 'Wild Wind',
              skipper: 'Sarah Thompson',
              sailNumber: 'GBR 5678',
              points: 2,
              finishTime: '14:28:15',
              correctedTime: '14:19:22'
            },
            {
              position: 3,
              boat: 'Blue Horizon',
              skipper: 'Mark Anderson',
              sailNumber: 'GBR 9101',
              points: 3,
              finishTime: '14:31:44',
              correctedTime: '14:21:33'
            }
          ]
        },
        {
          name: 'Cruiser Class',
          startTime: '10:05 AM',
          course: 'Round the Cans',
          distance: 8.2,
          finishers: 12,
          results: [
            {
              position: 1,
              boat: 'Blue Jay',
              skipper: 'Henderson Family',
              sailNumber: 'GBR 2468',
              points: 1,
              finishTime: '13:45:18'
            },
            {
              position: 2,
              boat: 'Serendipity',
              skipper: 'David Wilson',
              sailNumber: 'GBR 1357',
              points: 2,
              finishTime: '13:48:22'
            },
            {
              position: 3,
              boat: 'Halcyon',
              skipper: 'Emma Roberts',
              sailNumber: 'GBR 9876',
              points: 3,
              finishTime: '13:52:07'
            }
          ]
        },
        {
          name: 'Flying Fifteen',
          startTime: '10:10 AM',
          course: 'Triangle',
          distance: 6.1,
          finishers: 9,
          results: [
            {
              position: 1,
              boat: 'Frequent Flyer',
              skipper: 'Robert Brown',
              sailNumber: 'FF 3847',
              points: 1,
              finishTime: '12:34:15'
            },
            {
              position: 2,
              boat: 'Full Flight',
              skipper: 'James Davis',
              sailNumber: 'FF 4952',
              points: 2,
              finishTime: '12:35:42'
            },
            {
              position: 3,
              boat: 'Firefly',
              skipper: 'Lisa Murphy',
              sailNumber: 'FF 3621',
              points: 3,
              finishTime: '12:37:28'
            }
          ]
        }
      ],
      documents: {
        results: '/results/strangford-regatta-2024.pdf',
        photos: '/gallery/strangford-regatta-2024',
        report: '/news/strangford-regatta-2024-report'
      }
    },
    {
      id: 2,
      title: 'Wednesday Evening Series - Round 5',
      date: 'August 9, 2024',
      location: 'Strangford Lough',
      eventId: 8,
      type: 'Series',
      status: 'Completed',
      startTime: '7:00 PM',
      participants: 23,
      organizer: 'Racing Committee',
      officer: 'Sarah Mitchell',
      weather: {
        windSpeed: 12,
        windDirection: 'NW',
        temperature: 16,
        visibility: 'Good',
        conditions: 'Light but steady breeze'
      },
      classes: [
        {
          name: 'Flying Fifteen',
          startTime: '7:00 PM',
          course: 'Windward/Leeward',
          distance: 4.5,
          finishers: 7,
          results: [
            {
              position: 1,
              boat: 'Frequent Flyer',
              skipper: 'Robert Brown',
              sailNumber: 'FF 3847',
              points: 1,
              finishTime: '20:25:33'
            },
            {
              position: 2,
              boat: 'Full Flight',
              skipper: 'James Davis',
              sailNumber: 'FF 4952',
              points: 2,
              finishTime: '20:26:18'
            },
            {
              position: 3,
              boat: 'Firefly',
              skipper: 'Lisa Murphy',
              sailNumber: 'FF 3621',
              points: 3,
              finishTime: '20:28:45'
            }
          ]
        },
        {
          name: 'Laser/ILCA',
          startTime: '7:05 PM',
          course: 'Triangle',
          distance: 3.2,
          finishers: 8,
          results: [
            {
              position: 1,
              boat: 'Laser 209871',
              skipper: 'Michael Johnson',
              sailNumber: '209871',
              points: 1,
              finishTime: '19:58:22'
            },
            {
              position: 2,
              boat: 'Laser 198342',
              skipper: 'Thomas White',
              sailNumber: '198342',
              points: 2,
              finishTime: '20:01:15'
            },
            {
              position: 3,
              boat: 'Laser 204567',
              skipper: 'Rebecca Green',
              sailNumber: '204567',
              points: 3,
              finishTime: '20:03:48'
            }
          ]
        },
        {
          name: 'Cruiser Handicap',
          startTime: '6:55 PM',
          course: 'Round the Cans',
          distance: 5.8,
          finishers: 8,
          results: [
            {
              position: 1,
              boat: 'Moonbeam',
              skipper: 'Patrick Kelly',
              sailNumber: 'GBR 7654',
              points: 1,
              correctedTime: '20:15:32'
            },
            {
              position: 2,
              boat: 'Celtic Spirit',
              skipper: 'Mary O\'Brien',
              sailNumber: 'GBR 3210',
              points: 2,
              correctedTime: '20:17:28'
            },
            {
              position: 3,
              boat: 'North Wind',
              skipper: 'Sean Murphy',
              sailNumber: 'GBR 8765',
              points: 3,
              correctedTime: '20:19:44'
            }
          ]
        }
      ]
    },
    {
      id: 3,
      title: 'Autumn Championship',
      date: 'October 8, 2024',
      location: 'Strangford Lough, Championship Course',
      eventId: 5,
      type: 'Championship',
      status: 'Completed',
      startTime: '11:00 AM',
      participants: 34,
      organizer: 'East Down Yacht Club',
      officer: 'David Clarke',
      weather: {
        windSpeed: 18,
        windDirection: 'W',
        temperature: 14,
        visibility: 'Good',
        conditions: 'Fresh breeze, some gusts'
      },
      classes: [
        {
          name: 'IRC Class 1',
          startTime: '11:00 AM',
          course: 'Championship Course',
          distance: 15.2,
          finishers: 6,
          results: [
            {
              position: 1,
              boat: 'Storm Rider',
              skipper: 'Alan Thompson',
              sailNumber: 'GBR 4321',
              points: 1,
              finishTime: '15:32:18',
              correctedTime: '15:22:45'
            },
            {
              position: 2,
              boat: 'Sea Wolf',
              skipper: 'John McDowell',
              sailNumber: 'GBR 1234',
              points: 2,
              finishTime: '15:35:22',
              correctedTime: '15:25:33'
            },
            {
              position: 3,
              boat: 'Wild Wind',
              skipper: 'Sarah Thompson',
              sailNumber: 'GBR 5678',
              points: 3,
              finishTime: '15:38:55',
              correctedTime: '15:28:17'
            }
          ]
        }
      ]
    },
    {
      id: 4,
      title: 'Junior Regatta',
      date: 'July 22, 2024',
      location: 'East Down YC Training Area',
      eventId: 2,
      type: 'Fun Race',
      status: 'Completed',
      startTime: '10:00 AM',
      participants: 18,
      organizer: 'Junior Sailing Committee',
      officer: 'Emma Clarke',
      weather: {
        windSpeed: 8,
        windDirection: 'SE',
        temperature: 20,
        visibility: 'Excellent',
        conditions: 'Perfect conditions for juniors'
      },
      classes: [
        {
          name: 'Topper',
          startTime: '10:00 AM',
          course: 'Junior Course',
          distance: 2.1,
          finishers: 8,
          results: [
            {
              position: 1,
              boat: 'Topper 45231',
              skipper: 'Lucy Henderson (Age 12)',
              sailNumber: '45231',
              points: 1
            },
            {
              position: 2,
              boat: 'Topper 38942',
              skipper: 'Jamie Wilson (Age 14)',
              sailNumber: '38942',
              points: 2
            },
            {
              position: 3,
              boat: 'Topper 52187',
              skipper: 'Sophie Brown (Age 13)',
              sailNumber: '52187',
              points: 3
            }
          ]
        },
        {
          name: 'Optimist',
          startTime: '10:15 AM',
          course: 'Junior Course',
          distance: 1.8,
          finishers: 10,
          results: [
            {
              position: 1,
              boat: 'Opti 6734',
              skipper: 'Alex Murphy (Age 10)',
              sailNumber: '6734',
              points: 1
            },
            {
              position: 2,
              boat: 'Opti 8921',
              skipper: 'Emily Davis (Age 9)',
              sailNumber: '8921',
              points: 2
            },
            {
              position: 3,
              boat: 'Opti 4567',
              skipper: 'Ryan Kelly (Age 11)',
              sailNumber: '4567',
              points: 3
            }
          ]
        }
      ]
    }
  ];

  // Load race results on component mount and set up listener for localStorage changes
  useEffect(() => {
    const loadResults = () => {
      setRaceResults(loadRaceResults());
    };

    loadResults();

    // Listen for localStorage changes to update when admin creates new results
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'adminRaceResults') {
        loadResults();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Get unique values for filters
  const uniqueEvents = [...new Set(raceResults.map(result => result.title))];
  const uniqueClasses = [...new Set(raceResults.flatMap(result => result.classes.map(c => c.name)))];
  const uniqueTypes = [...new Set(raceResults.map(result => result.type))];

  // Filter results based on search and filters
  const filteredResults = raceResults.filter(result => {
    const matchesSearch = searchTerm === '' || 
      result.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.classes.some(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      result.classes.some(c => c.results.some(r => 
        r.boat.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.skipper.toLowerCase().includes(searchTerm.toLowerCase())
      ));

    const matchesEvent = selectedEvent === '' || result.title === selectedEvent;
    const matchesClass = selectedClass === '' || result.classes.some(c => c.name === selectedClass);
    const matchesType = selectedType === '' || result.type === selectedType;

    return matchesSearch && matchesEvent && matchesClass && matchesType;
  });

  const handleFilterChange = (key: string, value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (value) {
      newSearchParams.set(key, value);
    } else {
      newSearchParams.delete(key);
    }
    setSearchParams(newSearchParams);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedEvent('');
    setSelectedClass('');
    setSelectedType('');
    setSearchParams(new URLSearchParams());
  };

  // Update status and type color helpers to use #843c5c and white
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Provisional':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      case 'Postponed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Championship':
        return 'bg-[#843c5c]/10 text-[#843c5c]';
      case 'Series':
        return 'bg-[#843c5c]/10 text-[#843c5c]';
      case 'Fun Race':
        return 'bg-green-100 text-green-800';
      case 'Regatta':
        return 'bg-[#843c5c]/10 text-[#843c5c]';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#843c5c]/10 to-white">
      {/* Premium Header */}
      <div className="relative bg-gradient-to-br from-[#843c5c] via-[#843c5c] to-[#843c5c]/90 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="trophy-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M10 2L18 18L2 18Z" fill="currentColor" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#trophy-pattern)"/>
          </svg>
        </div>

        <div className="container mx-auto px-4 pt-20 pb-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Premium Badge */}
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/20">
              <Trophy className="w-5 h-5 mr-2 text-white" />
              <span className="text-sm font-medium">Race Results</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Competition <span className="bg-gradient-to-r from-white to-white bg-clip-text text-transparent">Results</span>
            </h1>

            <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
              Discover race results, performance statistics, and championship standings from all our sailing competitions
            </p>

            {/* Premium Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="text-3xl font-bold text-white mb-2">{raceResults.length}</div>
                <div className="text-white/80 text-sm">Events Completed</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="text-3xl font-bold text-white mb-2">
                  {raceResults.reduce((sum, event) => sum + event.participants, 0)}
                </div>
                <div className="text-white/80 text-sm">Total Participants</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="text-3xl font-bold text-white mb-2">
                  {uniqueClasses.length}
                </div>
                <div className="text-white/80 text-sm">Race Classes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-20">
          <svg viewBox="0 0 1440 120" className="w-full h-full" preserveAspectRatio="none">
            <path fill="#fff" d="M0,96L60,85.3C120,75,240,53,360,48C480,43,600,53,720,69.3C840,85,960,107,1080,112C1200,117,1320,107,1380,101.3L1440,96L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"/>
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-12 relative z-20">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg border border-[#843c5c]/10">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#843c5c]/60" size={20} />
              <input
                type="text"
                placeholder="Search races, boats, or skippers..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  handleFilterChange('search', e.target.value);
                }}
                className="w-full pl-12 pr-4 py-3 border border-[#843c5c]/20 rounded-lg focus:ring-2 focus:ring-[#843c5c]/20 focus:border-[#843c5c] transition-all"
              />
            </div>

            {/* Filter Button */}
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#843c5c] text-white rounded-lg hover:bg-[#a05a7a] transition-all duration-300"
              >
                <Filter size={18} />
                <span>Filters</span>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} 
                />
              </button>

              {/* Filter Dropdown */}
              {isFilterOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-[#843c5c]/20 z-30 p-6">
                  <div className="space-y-4">
                    {/* Event Filter */}
                    <div>
                      <label className="block text-sm font-medium text-[#843c5c] mb-2">Event</label>
                      <select
                        value={selectedEvent}
                        onChange={(e) => {
                          setSelectedEvent(e.target.value);
                          handleFilterChange('event', e.target.value);
                        }}
                        className="w-full p-2 border border-[#843c5c]/20 rounded-lg focus:ring-2 focus:ring-[#843c5c]/20 focus:border-[#843c5c] transition-all"
                      >
                        <option value="">All Events</option>
                        {uniqueEvents.map(event => (
                          <option key={event} value={event}>{event}</option>
                        ))}
                      </select>
                    </div>

                    {/* Class Filter */}
                    <div>
                      <label className="block text-sm font-medium text-[#843c5c] mb-2">Class</label>
                      <select
                        value={selectedClass}
                        onChange={(e) => {
                          setSelectedClass(e.target.value);
                          handleFilterChange('class', e.target.value);
                        }}
                        className="w-full p-2 border border-[#843c5c]/20 rounded-lg focus:ring-2 focus:ring-[#843c5c]/20 focus:border-[#843c5c] transition-all"
                      >
                        <option value="">All Classes</option>
                        {uniqueClasses.map(cls => (
                          <option key={cls} value={cls}>{cls}</option>
                        ))}
                      </select>
                    </div>

                    {/* Type Filter */}
                    <div>
                      <label className="block text-sm font-medium text-[#843c5c] mb-2">Type</label>
                      <select
                        value={selectedType}
                        onChange={(e) => {
                          setSelectedType(e.target.value);
                          handleFilterChange('type', e.target.value);
                        }}
                        className="w-full p-2 border border-[#843c5c]/20 rounded-lg focus:ring-2 focus:ring-[#843c5c]/20 focus:border-[#843c5c] transition-all"
                      >
                        <option value="">All Types</option>
                        {uniqueTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    {/* Clear Filters */}
                    <button
                      onClick={() => {
                        clearFilters();
                        setIsFilterOpen(false);
                      }}
                      className="w-full px-4 py-2 text-[#843c5c] hover:bg-[#843c5c]/10 rounded-lg transition-colors duration-200"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchTerm || selectedEvent || selectedClass || selectedType) && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#843c5c]/10">
              <span className="text-sm text-[#843c5c] mr-2">Active filters:</span>
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#843c5c]/10 text-[#843c5c] text-xs rounded-full">
                  Search: "{searchTerm}"
                </span>
              )}
              {selectedEvent && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#843c5c]/10 text-[#843c5c] text-xs rounded-full">
                  Event: {selectedEvent}
                </span>
              )}
              {selectedClass && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Class: {selectedClass}
                </span>
              )}
              {selectedType && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#843c5c]/10 text-[#843c5c] text-xs rounded-full">
                  Type: {selectedType}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Results List */}
        <div className="space-y-8">
          {filteredResults.map((event, index) => (
            <div key={event.id} className="bg-white rounded-2xl shadow-lg border border-[#843c5c]/10 overflow-hidden animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
              {/* Event Header */}
              <div className="bg-gradient-to-r from-[#843c5c] to-[#843c5c]/80 text-white p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(event.type)}`}>{event.type}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>{event.status}</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
                    <div className="flex flex-wrap items-center gap-6 text-white/80">
                      <div className="flex items-center gap-2">
                        <CalendarIcon size={16} />
                        <span className="text-sm">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span className="text-sm">{event.startTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        <span className="text-sm">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={16} />
                        <span className="text-sm">{event.participants} participants</span>
                      </div>
                    </div>
                  </div>
                  {/* Weather Conditions */}
                  {event.weather && (
                    <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                      <h4 className="font-medium mb-3 text-white">Conditions</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Wind size={14} className="text-white" />
                          <span>{event.weather.windSpeed}kt {event.weather.windDirection}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Thermometer size={14} className="text-white" />
                          <span>{event.weather.temperature}°C</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye size={14} className="text-white" />
                          <span>{event.weather.visibility}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Compass size={14} className="text-white" />
                          <span>Good</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Event Details */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold text-[#843c5c] mb-2">Event Details</h4>
                    <div className="space-y-1 text-sm text-[#843c5c]/80">
                      <div><span className="font-medium">Organizer:</span> {event.organizer}</div>
                      {event.officer && <div><span className="font-medium">Officer of the Day:</span> {event.officer}</div>}
                      <div><span className="font-medium">Classes:</span> {event.classes.length}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3">
                    <Link
                      to={`/events/${event.eventId}`}
                      className="inline-flex items-center gap-2 px-4 py-2 text-[#843c5c] hover:text-[#a05a7a] font-medium transition-colors"
                    >
                      View Event
                      <ArrowRight size={16} />
                    </Link>
                    {event.documents?.results && (
                      <a
                        href={event.documents.results}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#843c5c] text-white rounded-lg hover:bg-[#a05a7a] transition-colors"
                      >
                        <Download size={16} />
                        Download Results
                      </a>
                    )}
                  </div>
                </div>

                {/* Race Classes and Results */}
                <div className="space-y-8">
                  {event.classes.map((raceClass, classIndex) => (
                    <div key={classIndex} className="border border-[#843c5c]/10 rounded-lg overflow-hidden">
                      {/* Class Header */}
                      <div className="bg-[#843c5c]/5 px-6 py-4 border-b border-[#843c5c]/10">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <h4 className="text-lg font-semibold text-[#843c5c]">{raceClass.name}</h4>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-[#843c5c]/80 mt-1">
                              {raceClass.startTime && <span>Start: {raceClass.startTime}</span>}
                              {raceClass.course && <span>Course: {raceClass.course}</span>}
                              {raceClass.distance && <span>Distance: {raceClass.distance} nm</span>}
                              {raceClass.finishers && <span>{raceClass.finishers} finishers</span>}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Results Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-[#843c5c]/10">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-[#843c5c]/80 uppercase tracking-wider">Position</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-[#843c5c]/80 uppercase tracking-wider">Boat</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-[#843c5c]/80 uppercase tracking-wider">Skipper</th>
                              {raceClass.results.some(r => r.sailNumber) && (
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#843c5c]/80 uppercase tracking-wider">Sail Number</th>
                              )}
                              {raceClass.results.some(r => r.finishTime) && (
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#843c5c]/80 uppercase tracking-wider">Finish Time</th>
                              )}
                              {raceClass.results.some(r => r.correctedTime) && (
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#843c5c]/80 uppercase tracking-wider">Corrected Time</th>
                              )}
                              <th className="px-6 py-3 text-left text-xs font-medium text-[#843c5c]/80 uppercase tracking-wider">Points</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#843c5c]/10">
                            {raceClass.results.map((result, resultIndex) => (
                              <tr key={resultIndex} className={`hover:bg-[#843c5c]/5 transition-colors ${result.position <= 3 ? 'bg-[#843c5c]/10' : ''}`}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                                      result.position === 1 ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300' :
                                      result.position === 2 ? 'bg-gray-100 text-gray-800 border-2 border-gray-300' :
                                      result.position === 3 ? 'bg-orange-100 text-orange-800 border-2 border-orange-300' :
                                      'bg-white text-[#843c5c] border border-[#843c5c]/20'
                                    }`}>
                                      {result.position}
                                    </span>
                                    {result.position <= 3 && <Star size={16} className="ml-2 text-[#843c5c]" />}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-[#843c5c]">{result.boat}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-[#843c5c]/80">{result.skipper}</td>
                                {raceClass.results.some(r => r.sailNumber) && (
                                  <td className="px-6 py-4 whitespace-nowrap text-[#843c5c]/60">{result.sailNumber || '-'}</td>
                                )}
                                {raceClass.results.some(r => r.finishTime) && (
                                  <td className="px-6 py-4 whitespace-nowrap text-[#843c5c]/60">{result.finishTime || '-'}</td>
                                )}
                                {raceClass.results.some(r => r.correctedTime) && (
                                  <td className="px-6 py-4 whitespace-nowrap text-[#843c5c]/60">{result.correctedTime || '-'}</td>
                                )}
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#843c5c]/10 text-[#843c5c]">
                                    {result.points}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredResults.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-[#843c5c]/10">
            <Trophy size={64} className="mx-auto text-[#843c5c]/20 mb-6" />
            <h3 className="text-xl font-semibold text-[#843c5c] mb-4">No Results Found</h3>
            <p className="text-[#843c5c]/80 mb-6">
              No race results match your current search criteria. Try adjusting your filters or search terms.
            </p>
            <button
              onClick={clearFilters}
              className="bg-[#843c5c] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#a05a7a] transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* External Results Link */}
        <div className="bg-white rounded-2xl p-8 text-center mt-8 shadow-lg border border-[#843c5c]/10">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-[#843c5c] mb-4">
              View Complete Results Archive
            </h3>
            <p className="text-[#843c5c]/80 mb-6">
              Access comprehensive race results, statistics, and historical data through our Hall Sailing integration.
            </p>
            <a
              href="https://hallsailing.com/club/eastdownyc"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#843c5c] text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2 hover:bg-[#a05a7a] transition-colors"
            >
              Hall Sailing Results
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaceResultsPage;