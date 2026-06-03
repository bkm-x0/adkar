import React, { useState } from 'react'
import { Copy, Check, Volume2 } from 'lucide-react'

function AdkarCard({ adkar }) {
  const [copied, setCopied] = useState(false)
  const [showCounter, setShowCounter] = useState(false)
  const [count, setCount] = useState(0)

  const handleCopy = () => {
    navigator.clipboard.writeText(adkar.text_without_diacritical)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRead = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(adkar.text_without_diacritical)
      utterance.lang = 'ar-SA'
      speechSynthesis.cancel()
      speechSynthesis.speak(utterance)
    }
  }

  const handleResetCounter = () => {
    setCount(0)
  }

  const handleIncrementCounter = () => {
    if (count < adkar.count) {
      setCount(count + 1)
    }
  }

  return (
    <div className="bg-white bg-opacity-95 backdrop-blur-md rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Header with Category */}
      <div className="bg-gradient-to-r from-islamic-primary to-islamic-light px-6 py-4">
        <div className="flex justify-between items-start">
          <h3 className="text-white font-bold text-lg">{adkar.category}</h3>
          <span className="bg-islamic-gold text-islamic-dark px-3 py-1 rounded-full text-sm font-semibold">
            #{adkar.id}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Main Text */}
        <div className="mb-6 bg-islamic-primary bg-opacity-5 p-4 rounded-lg border-l-4 border-islamic-gold">
          <p className="text-islamic-dark text-lg leading-relaxed font-semibold text-right whitespace-pre-wrap">
            {adkar.text}
          </p>
        </div>

        {/* Description */}
        {adkar.description && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border-r-4 border-blue-400">
            <p className="text-blue-900 text-sm text-right">
              <span className="font-bold">الفائدة: </span>
              {adkar.description}
            </p>
          </div>
        )}

        {/* Reference */}
        <div className="mb-6 p-3 bg-blue-50 rounded-lg border-r-4 border-blue-400">
          <p className="text-blue-900 text-sm text-right">
            <span className="font-bold">المرجع: </span>
            {adkar.reference}
          </p>
        </div>

        {/* Counter Section */}
        <div className="mb-6 bg-gradient-to-r from-islamic-primary to-islamic-light rounded-lg p-6">
          <div className="text-center">
            <p className="text-white font-semibold mb-6">
              عدد المرات المطلوبة: <span className="text-islamic-gold text-xl">{adkar.count}</span>
            </p>
            {!showCounter ? (
              <button
                onClick={() => {
                  setShowCounter(true)
                  setCount(0)
                }}
                className="bg-islamic-gold text-islamic-dark px-4 py-2 rounded-lg font-bold hover:bg-white transition-all duration-300"
              >
                ابدأ العد
              </button>
            ) : (
              <div className="space-y-4">
                <div className="text-5xl font-bold text-islamic-light text-center">
                  {count}/{adkar.count}
                </div>
                
                {/* Circular Button and Controls */}
                <div className="flex gap-6 justify-center items-center mt-6">
                  {/* Reset Button */}
                  <button
                    onClick={handleResetCounter}
                    className="text-2xl hover:scale-125 transition-transform duration-300 active:scale-95"
                    title="إعادة تعيين"
                  >
                    🔄
                  </button>
                  
                  {/* Main Circular Add Button */}
                  <button
                    onClick={handleIncrementCounter}
                    disabled={count >= adkar.count}
                    className={`w-24 h-24 rounded-full font-bold text-4xl transition-all duration-300 flex items-center justify-center shadow-xl ${
                      count >= adkar.count
                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                        : 'bg-islamic-gold text-islamic-dark hover:bg-islamic-light hover:text-white hover:scale-110 active:scale-95'
                    }`}
                  >
                    ➕
                  </button>
                  
                  {/* Close Button */}
                  <button
                    onClick={() => setShowCounter(false)}
                    className="text-2xl hover:scale-125 transition-transform duration-300 active:scale-95"
                    title="إغلاق"
                  >
                    ✕
                  </button>
                </div>

                {/* Completion Message */}
                {count >= adkar.count && (
                  <div className="text-center text-islamic-light font-bold text-lg mt-6">
                    ✅ تم إكمال العد - بارك الله فيك!
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleRead}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300"
            title="اقرأ الذكر بصوت عالي"
          >
            <Volume2 className="w-5 h-5" />
            <span className="hidden sm:inline">استمع</span>
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 bg-islamic-primary hover:bg-islamic-light text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300"
            title="انسخ الذكر"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5 text-green-400" />
                <span className="hidden sm:inline">تم النسخ</span>
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                <span className="hidden sm:inline">نسخ</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdkarCard
