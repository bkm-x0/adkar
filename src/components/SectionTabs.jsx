import React from 'react'

function SectionTabs({ sections, activeSection, onSelect }) {
  return (
    <div className="flex flex-wrap gap-3 justify-center mb-8">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => onSelect(section.id)}
          className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
            activeSection === section.id
              ? 'bg-white text-islamic-primary shadow-xl scale-105'
              : 'bg-white/15 text-white hover:bg-white/25'
          }`}
        >
          {section.label}
        </button>
      ))}
    </div>
  )
}

export default SectionTabs
