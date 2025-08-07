import React from 'react';
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
interface EventCardProps {
  id: number;
  title: string;
  date: string;
  time: string;
  type: string;
}
const EventCard = ({
  id,
  title,
  date,
  time,
  type
}: EventCardProps) => {
  // Determine event type color
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'racing':
        return 'bg-blue-100 text-blue-800';
      case 'training':
        return 'bg-green-100 text-green-800';
      case 'social':
        return 'bg-purple-100 text-purple-800';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  return <div className="flex items-start p-3 bg-white rounded border border-gray-100 hover:border-gray-200 transition-colors">
      <div className="mr-4 flex-shrink-0">
        <Calendar size={24} className="text-[#1e3a8a]" />
      </div>
      <div className="flex-grow">
        <Link to={`/events/${id}`} className="block">
          <h4 className="font-semibold text-[#1e3a8a] hover:text-[#0284c7] transition-colors">
            {title}
          </h4>
        </Link>
        <p className="text-sm text-gray-600">
          {date} at {time}
        </p>
        <span className={`text-xs px-2 py-1 rounded mt-2 inline-block ${getTypeColor(type)}`}>
          {type}
        </span>
      </div>
    </div>;
};
export default EventCard;