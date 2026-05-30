import { useState, useEffect, useRef } from 'react'
import Header from './components/Header'
import CategoryFilter from './components/CategoryFilter'
import SearchBar from './components/SearchBar'
import AdkarCard from './components/AdkarCard'
import adkarData from '../adkar.json'
import './App.css'

function App() {
  const [adkarList, setAdkarList] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('جميع الأذكار')
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredAdkar, setFilteredAdkar] = useState([])
  const adkarContainerRef = useRef(null)

  // Load adkar data
  useEffect(() => {
    setAdkarList(adkarData)
    
    // Get unique categories
    const uniqueCategories = [...new Set(adkarData.map(item => item.category))]
    setCategories(['جميع الأذكار', ...uniqueCategories])
  }, [])

  // Filter adkar based on category and search query
  useEffect(() => {
    let filtered = adkarList

    // Filter by category
    if (selectedCategory !== 'جميع الأذكار') {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.text.includes(searchQuery) ||
        item.text_without_diacritical.includes(searchQuery) ||
        item.description.includes(searchQuery) ||
        item.category.includes(searchQuery)
      )
    }

    setFilteredAdkar(filtered)
  }, [selectedCategory, searchQuery, adkarList])

  // Auto scroll to adkar when category changes
  useEffect(() => {
    if (adkarContainerRef.current && filteredAdkar.length > 0) {
      adkarContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [selectedCategory])

  return (
    <div className="min-h-screen bg-gradient-to-br from-islamic-dark via-islamic-primary to-islamic-dark">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <div className="mt-8" ref={adkarContainerRef}>
          {filteredAdkar.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
              {filteredAdkar.map((adkar) => (
                <AdkarCard key={adkar.id} adkar={adkar} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-white text-xl">لا توجد أذكار مطابقة للبحث</p>
            </div>
          )}
        </div>

        <div className="mt-12 text-center text-white text-sm opacity-75">
          <p>إجمالي الأذكار: {filteredAdkar.length}</p>
        </div>
      </div>
    </div>
  )
}

export default App
