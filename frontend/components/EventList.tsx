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
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-400">
          UserOperation Events Monitor
        </h1>
        
        <SearchBar onSearch={handleSearch} />
        
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400"></div>
          </div>
        ) : events.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No events found</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event: any) => (
              <div 
                key={event.userOpHash} 
                className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-all duration-300 border border-gray-700 hover:border-blue-500/50 shadow-lg"
              >
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-blue-400">Hash</p>
                    <p className="font-mono text-sm truncate text-gray-300">{event.userOpHash}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-blue-400">Sender</p>
                    <p className="font-mono text-sm truncate text-gray-300">{event.sender}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-blue-400">Paymaster</p>
                    <p className="font-mono text-sm truncate text-gray-300">{event.paymaster}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-blue-400">Block</p>
                    <p className="font-mono text-sm text-gray-300">{event.blockNumber}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-blue-400">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                      event.success 
                        ? 'bg-green-900/50 text-green-300 border border-green-500/50' 
                        : 'bg-red-900/50 text-red-300 border border-red-500/50'
                    }`}>
                      {event.success ? 'Success' : 'Failed'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}