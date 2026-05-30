import React from 'react'

function CategoryFilter({ categories, selectedCategory, setSelectedCategory }) {
  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 shadow-lg">
      <h2 className="text-white text-lg font-semibold mb-4">التصنيفات</h2>
      <div className="flex flex-wrap gap-3 justify-center md:justify-start">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
              selectedCategory === category
                ? 'bg-islamic-gold text-islamic-dark shadow-lg scale-105'
                : 'bg-islamic-primary text-white hover:bg-islamic-light'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}

export default CategoryFilter
