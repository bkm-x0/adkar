import React from 'react'
import { BookOpen } from 'lucide-react'

function Header() {
  return (
    <header className="bg-gradient-to-r from-islamic-dark to-islamic-primary shadow-lg border-b-4 border-islamic-gold">
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <BookOpen className="w-8 h-8 text-islamic-gold" />
          <h1 className="text-4xl font-bold text-white">IslamHouse Explorer</h1>
          <BookOpen className="w-8 h-8 text-islamic-gold" />
        </div>
        <p className="text-islamic-accent text-lg">استعرض العناصر، التصنيفات، المؤلفين، والقرآن من API v3</p>
      </div>
    </header>
  )
}

export default Header
