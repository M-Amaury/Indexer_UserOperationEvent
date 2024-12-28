'use client'

import { useState } from 'react'

interface SearchBarProps {
  onSearch: (filters: any) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [filters, setFilters] = useState({
    sender: '',
    paymaster: '',
    fromBlock: '',
    toBlock: '',
    success: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Nettoie les filtres vides
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '')
    );
    
    onSearch(cleanFilters);
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <div className="search-inputs">
        <input
          type="text"
          placeholder="Sender address"
          value={filters.sender}
          onChange={(e) => setFilters({ ...filters, sender: e.target.value })}
        />

        <input
          type="text"
          placeholder="Paymaster address"
          value={filters.paymaster}
          onChange={(e) => setFilters({ ...filters, paymaster: e.target.value })}
        />

        <input
          type="number"
          placeholder="From Block"
          value={filters.fromBlock}
          onChange={(e) => setFilters({ ...filters, fromBlock: e.target.value })}
        />

        <input
          type="number"
          placeholder="To Block"
          value={filters.toBlock}
          onChange={(e) => setFilters({ ...filters, toBlock: e.target.value })}
        />

        <select
          value={filters.success}
          onChange={(e) => setFilters({ ...filters, success: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="true">Success</option>
          <option value="false">Failed</option>
        </select>

        <button type="submit">Search</button>
      </div>

      <style jsx>{`
        .search-bar {
          margin-bottom: 2rem;
          padding: 1rem;
          background: #f5f5f5;
          border-radius: 8px;
        }

        .search-inputs {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        input, select {
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          width: 100%;
        }

        button {
          padding: 0.5rem 1rem;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        button:hover {
          background: #0051a2;
        }
      `}</style>
    </form>
  );
}