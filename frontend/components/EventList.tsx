'use client'

import { useState, useEffect } from 'react'
import { SearchBar } from './SearchBar'

export function EventList() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({})

  const fetchEvents = async (searchFilters = {}) => {
    try {
      // Construit l'URL avec les paramètres de recherche
      const params = new URLSearchParams();
      Object.entries(searchFilters).forEach(([key, value]) => {
        if (value) params.append(key, value as string);
      });

      const url = `http://localhost:3000/events${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
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

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      
      {events.length === 0 ? (
        <p>No events found</p>
      ) : (
        events.map((event: any) => (
          <div key={event.userOpHash} className="event-card">
            <p>Hash: {event.userOpHash}</p>
            <p>Sender: {event.sender}</p>
            <p>Paymaster: {event.paymaster}</p>
            <p>Block: {event.blockNumber}</p>
            <p>Status: {event.success ? 'Success' : 'Failed'}</p>
          </div>
        ))
      )}
    </div>
  );
}