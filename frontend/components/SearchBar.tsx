'use client'

import { useState } from 'react'

interface SearchBarProps {
  onSearch: (filters: any) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [filters, setFilters] = useState({
    userOpHash: '',
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
    <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-800 rounded-lg border border-gray-700 shadow-lg">
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="block text-sm text-blue-400 mb-2">
            OpUserHash
          </label>
          <input
            type="text"
            placeholder="Search by OpUserHash..."
            value={filters.userOpHash}
            onChange={(e) => setFilters({ ...filters, userOpHash: e.target.value })}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm text-blue-400 mb-2">
            Sender Address
          </label>
          <input
            type="text"
            placeholder="Search by sender..."
            value={filters.sender}
            onChange={(e) => setFilters({ ...filters, sender: e.target.value })}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm text-blue-400 mb-2">
            Paymaster Address
          </label>
          <input
            type="text"
            placeholder="Search by paymaster..."
            value={filters.paymaster}
            onChange={(e) => setFilters({ ...filters, paymaster: e.target.value })}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm text-blue-400 mb-2">
            From Block
          </label>
          <input
            type="number"
            placeholder="Enter starting block..."
            value={filters.fromBlock}
            onChange={(e) => setFilters({ ...filters, fromBlock: e.target.value })}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm text-blue-400 mb-2">
            To Block
          </label>
          <input
            type="number"
            placeholder="Enter ending block..."
            value={filters.toBlock}
            onChange={(e) => setFilters({ ...filters, toBlock: e.target.value })}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm text-blue-400 mb-2">
            Status
          </label>
          <select
            value={filters.success}
            onChange={(e) => setFilters({ ...filters, success: e.target.value })}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="true">Success</option>
            <option value="false">Failed</option>
          </select>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          Search
        </button>
      </div>
    </form>
  );
}