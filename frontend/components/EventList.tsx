'use client'

import { useState, useEffect } from 'react'
import { SearchBar } from './SearchBar'

export function EventList() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({})
  const [error, setError] = useState(null)

  const fetchEvents = async (searchFilters = {}) => {
    try {
      setError(null);
      const params = new URLSearchParams();
      Object.entries(searchFilters).forEach(([key, value]) => {
        if (value) params.append(key, value as string);
      });

      const url = `/api/events${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to fetch events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(filters);
    // Rafraîchissement automatique toutes les 5 secondes
    const interval = setInterval(() => fetchEvents(filters), 5000);
    return () => clearInterval(interval);
  }, [filters]);

  const handleSearch = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <div className="container mx-auto p-4">
      <SearchBar onSearch={handleSearch} />
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : events.length === 0 ? (
        <p className="text-center text-gray-500 py-4">No events found</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event: any) => (
            <div key={event.userOpHash} className="bg-white shadow rounded-lg p-4 hover:shadow-lg transition-shadow">
              <p className="text-sm text-gray-500">Hash:</p>
              <p className="font-mono text-sm mb-2 truncate">{event.userOpHash}</p>
              
              <p className="text-sm text-gray-500">Sender:</p>
              <p className="font-mono text-sm mb-2 truncate">{event.sender}</p>
              
              <p className="text-sm text-gray-500">Paymaster:</p>
              <p className="font-mono text-sm mb-2 truncate">{event.paymaster}</p>
              
              <p className="text-sm text-gray-500">Block:</p>
              <p className="font-mono text-sm mb-2">{event.blockNumber}</p>
              
              <p className="text-sm text-gray-500">Status:</p>
              <span className={`inline-block px-2 py-1 rounded text-sm ${
                event.success 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {event.success ? 'Success' : 'Failed'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}