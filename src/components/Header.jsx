import React from 'react'
import { Flame } from 'lucide-react'

function Header() {
  return (
    <header className="bg-gradient-to-r from-islamic-dark to-islamic-primary shadow-lg border-b-4 border-islamic-gold">
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Flame className="w-8 h-8 text-islamic-gold" />
          <h1 className="text-4xl font-bold text-white">تطبيق الأذكار</h1>
          <Flame className="w-8 h-8 text-islamic-gold" />
        </div>
        <p className="text-islamic-accent text-lg">أذكار يومية من السنة النبوية</p>
      </div>
    </header>
  )
}

export default Header
