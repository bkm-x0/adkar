import React from 'react'
import { Search } from 'lucide-react'

function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div className="mb-8">
      <div className="relative">
        <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-islamic-primary w-5 h-5" />
        <input
          type="text"
          placeholder="ابحث داخل البيانات المعروضة..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white text-right pr-12 pl-4 py-3 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-islamic-gold text-islamic-dark placeholder-gray-400 font-semibold"
        />
      </div>
    </div>
  )
}

export default SearchBar
