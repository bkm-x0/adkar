import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import SectionTabs from './components/SectionTabs'
import DataCard from './components/DataCard'
import DetailModal from './components/DetailModal'
import {
  fetchAllCategoriesTree,
  fetchAuthors,
  fetchAuthorAvailableLanguages,
  fetchAuthorCardTranslations,
  fetchAuthorDetails,
  fetchAuthorItems,
  fetchAuthorTypesAvailable,
  fetchCategories,
  fetchCategoryChildren,
  fetchCategoryDetails,
  fetchCategorySourceLanguages,
  fetchCategoryTree,
  fetchCategoryTypesAvailable,
  fetchFooter,
  fetchHomeStats,
  fetchItemAttachments,
  fetchItemDetails,
  fetchItemTranslations,
  fetchItemTree,
  fetchItems,
  fetchLanguageTerms,
  fetchAvailableLanguages,
  fetchLanguages,
  fetchLatest,
  fetchQuranAuthor,
  fetchQuranAuthorRecitations,
  fetchQuranCategory,
  fetchQuranRecitation,
  fetchQuranSura,
  fetchQuranSuraRecitations,
  fetchQuranCategories,
  fetchSocialLinks,
} from './lib/islamhouseApi'
import './App.css'

const SECTIONS = [
  { id: 'dashboard', label: 'الرئيسية' },
  { id: 'items', label: 'العناصر' },
  { id: 'latest', label: 'الأحدث' },
  { id: 'categories', label: 'التصنيفات' },
  { id: 'categoryTree', label: 'شجرة التصنيفات' },
  { id: 'authors', label: 'المؤلفون' },
  { id: 'languages', label: 'اللغات' },
  { id: 'quran', label: 'القرآن' },
  { id: 'site', label: 'الموقع' },
  { id: 'footer', label: 'التذييل' },
  { id: 'social', label: 'الروابط' },
  { id: 'endpoints', label: 'الميزات' },
]

const DEFAULT_LANG = 'ar'

function formatDate(timestamp) {
  if (!timestamp) return null
  const value = Number(timestamp) * 1000
  if (Number.isNaN(value)) return null
  return new Intl.DateTimeFormat('ar', { dateStyle: 'medium' }).format(new Date(value))
}

function toCardsFromEntries(obj) {
  return Object.entries(obj || {}).map(([key, value]) => ({
    title: key,
    description: typeof value === 'string' ? value : Array.isArray(value) ? `قائمة تضم ${value.length} عنصر` : value === null ? 'لا توجد قيمة' : JSON.stringify(value),
    badges: [key],
    meta: [],
    href: typeof value === 'string' && value.startsWith('http') ? value : undefined,
  }))
}

function normalizeCards(section, payload) {
  if (section === 'languages') {
    return Object.entries(payload || {}).map(([code, info]) => ({
      title: info?.native || code,
      description: `${info?.script || ''} · ${info?.dir || ''}`.trim(),
      badges: [code, info?.script, info?.dir, info?.native].filter(Boolean),
      meta: [],
      source: { code, ...info },
      actions: [
        { id: 'terms', label: 'مصطلحات' },
        { id: 'available', label: 'اللغات المتاحة', variant: 'secondary' },
      ],
    }))
  }

  if (section === 'footer' || section === 'social') {
    return toCardsFromEntries(payload)
  }

  if (section === 'dashboard' || section === 'site') {
    return toCardsFromEntries(payload)
  }

  if (section === 'endpoints') {
    return [
      { title: 'العناصر', description: 'قائمة العناصر مع التفاصيل والمرفقات والترجمات', badges: ['main/showall', 'get-item', 'attachments', 'translations'], meta: [] },
      { title: 'التصنيفات', description: 'الشجرة، الفروع، الأنواع المتاحة، واللغات المصدرية', badges: ['categories', 'tree', 'viewcat'], meta: [] },
      { title: 'المؤلفون', description: 'التفاصيل، العناصر، الكروت، واللغات المتاحة', badges: ['authors', 'card', 'available languages'], meta: [] },
      { title: 'اللغات', description: 'تعريفات اللغة والمصطلحات واللغات المتاحة', badges: ['language details', 'terms', 'available'], meta: [] },
      { title: 'القرآن', description: 'التصنيفات، السور، القراء، والتلاوات', badges: ['quran', 'suras', 'recitations'], meta: [] },
      { title: 'الموقع', description: 'إحصاءات الصفحة الرئيسية، التذييل، والروابط الاجتماعية', badges: ['home', 'footer', 'social'], meta: [] },
    ]
  }

  const list = payload?.data || payload || []

  return list.map((item) => {
    if (section === 'categories' || section === 'categoryTree' || section === 'quran') {
      const extra = [
        item.kind,
        item.type === false ? null : item.type,
        typeof item.items_count === 'number' ? `${item.items_count} عنصر` : null,
        Array.isArray(item.locales) ? `${item.locales.length} لغة` : null,
        item.has_children ? 'تحتوي على فروع' : null,
      ].filter(Boolean)

      return {
        title: item.title,
        description: item.description,
        badges: [section === 'quran' ? 'Quran' : section === 'categoryTree' ? 'Tree' : 'Category', ...extra],
        meta: [
          `المعرّف: ${item.id}`,
          item.api_url ? `الرابط: ${item.api_url}` : null,
        ].filter(Boolean),
        href: item.api_url,
        secondaryHref: item.item_api_url,
        source: item,
        actions: section === 'quran' ? [
          { id: 'quranCategory', label: 'التفاصيل' },
          { id: 'quranSura', label: 'السورة', variant: 'secondary' },
          { id: 'quranAuthor', label: 'القراء', variant: 'secondary' },
          { id: 'quranRecitations', label: 'التلاوات', variant: 'secondary' },
        ] : [
          { id: 'details', label: 'التفاصيل' },
          { id: 'children', label: 'الفروع', variant: 'secondary' },
          { id: 'types', label: 'الأنواع', variant: 'secondary' },
          { id: 'languages', label: 'اللغات', variant: 'secondary' },
        ],
      }
    }

    if (section === 'authors') {
      return {
        title: item.title,
        description: item.description,
        badges: [item.kind || 'author', `${item.items_count} عنصر`, item.source_language || 'ar'].filter(Boolean),
        meta: [
          `الترجمة: ${item.translation_language || '—'}`,
          `اللغات المتاحة: ${Array.isArray(item.locales) ? item.locales.length : 0}`,
          item.add_date ? `أضيف: ${formatDate(item.add_date)}` : null,
        ].filter(Boolean),
        href: item.api_url,
        secondaryHref: item.item_api_url,
        source: item,
        actions: [
          { id: 'details', label: 'التفاصيل' },
          { id: 'card', label: 'الكارت', variant: 'secondary' },
          { id: 'types', label: 'الأنواع', variant: 'secondary' },
          { id: 'languages', label: 'اللغات', variant: 'secondary' },
          { id: 'items', label: 'العناصر', variant: 'secondary' },
        ],
      }
    }

    if (section === 'items' || section === 'latest') {
      return {
        title: item.title,
        description: item.description,
        badges: [item.type || 'item', item.source_language, item.translated_language, item.importance_level].filter(Boolean),
        meta: [
          `المعرّف: ${item.id}`,
          item.num_attachments ? `المرفقات: ${item.num_attachments}` : 'بدون مرفقات',
          item.add_date ? `أضيف: ${formatDate(item.add_date)}` : null,
        ].filter(Boolean),
        href: item.api_url,
        source: item,
        actions: [
          { id: 'details', label: 'التفاصيل' },
          { id: 'attachments', label: 'المرفقات', variant: 'secondary' },
          { id: 'tree', label: 'الشجرة', variant: 'secondary' },
          { id: 'translations', label: 'الترجمات', variant: 'secondary' },
        ],
      }
    }

    return {
      title: item.title || '—',
      description: item.description || item.full_description || '',
      badges: [item.type, item.kind, item.source_language, item.translation_language].filter(Boolean),
      meta: [item.api_url ? `الرابط: ${item.api_url}` : null].filter(Boolean),
      href: item.api_url,
      source: item,
    }
  })
}

function buildDetailPayload(section, action, item) {
  const id = item?.id
  const language = item?.language_code || DEFAULT_LANG

  if (section === 'items' || section === 'latest') {
    if (action === 'details') return { title: `تفاصيل ${item.title}`, request: fetchItemDetails(id) }
    if (action === 'attachments') return { title: `مرفقات ${item.title}`, request: fetchItemAttachments(id) }
    if (action === 'tree') return { title: `شجرة ${item.title}`, request: fetchItemTree(id) }
    if (action === 'translations') return { title: `ترجمات ${item.title}`, request: fetchItemTranslations(id) }
  }

  if (section === 'categories' || section === 'categoryTree') {
    if (action === 'details') return { title: `تفاصيل ${item.title}`, request: fetchCategoryDetails(id) }
    if (action === 'children') return { title: `فروع ${item.title}`, request: fetchCategoryChildren(id) }
    if (action === 'types') return { title: `أنواع ${item.title}`, request: fetchCategoryTypesAvailable(id) }
    if (action === 'languages') return { title: `لغات ${item.title}`, request: fetchCategorySourceLanguages(id) }
  }

  if (section === 'authors') {
    if (action === 'details') return { title: `تفاصيل ${item.title}`, request: fetchAuthorDetails(id) }
    if (action === 'card') return { title: `كارت ${item.title}`, request: fetchAuthorCardTranslations(id) }
    if (action === 'types') return { title: `أنواع ${item.title}`, request: fetchAuthorTypesAvailable(id) }
    if (action === 'languages') return { title: `لغات ${item.title}`, request: fetchAuthorAvailableLanguages(id) }
    if (action === 'items') return { title: `عناصر ${item.title}`, request: fetchAuthorItems(id) }
  }

  if (section === 'languages') {
    if (action === 'terms') return { title: `مصطلحات ${item.title || item.code}`, request: fetchLanguageTerms(id || language) }
    if (action === 'available') return { title: `اللغات المتاحة لـ ${item.title || item.code}`, request: fetchAvailableLanguages(id || 'showall') }
  }

  if (section === 'quran') {
    if (item.type === 'category') {
      if (action === 'quranCategory' || action === 'details') return { title: `تفاصيل ${item.title}`, request: fetchQuranCategory(id) }
      if (action === 'quranRecitations' || action === 'children') return { title: `تلاوات ${item.title}`, request: fetchQuranSuraRecitations(id) }
    }
    if (item.type === 'author') {
      if (action === 'quranAuthor' || action === 'details') return { title: `تفاصيل ${item.title}`, request: fetchQuranAuthor(id) }
      if (action === 'quranRecitations' || action === 'children') return { title: `تلاوات ${item.title}`, request: fetchQuranAuthorRecitations(id) }
    }
    if (item.type === 'suras') {
      if (action === 'quranSura' || action === 'details') return { title: `تفاصيل ${item.title}`, request: fetchQuranSura(id) }
      if (action === 'quranRecitations' || action === 'children') return { title: `تلاوات ${item.title}`, request: fetchQuranSuraRecitations(id) }
    }
    if (action === 'quranRecitations') return { title: `التلاوة ${item.title}`, request: fetchQuranRecitation(id) }
  }

  return null
}

function App() {
  const [section, setSection] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [rawData, setRawData] = useState({ data: [], links: null })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [detail, setDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)
      setError('')

      try {
        let payload

        if (section === 'dashboard') {
          payload = await fetchHomeStats()
        } else if (section === 'items') {
          payload = await fetchItems(page, 12)
        } else if (section === 'latest') {
          payload = await fetchLatest(page, 12)
        } else if (section === 'categories') {
          payload = await fetchCategories()
        } else if (section === 'categoryTree') {
          payload = await fetchAllCategoriesTree()
        } else if (section === 'authors') {
          payload = await fetchAuthors(page, 12)
        } else if (section === 'languages') {
          payload = await fetchLanguages()
        } else if (section === 'quran') {
          payload = await fetchQuranCategories()
        } else if (section === 'site') {
          const [footer, social] = await Promise.all([fetchFooter(), fetchSocialLinks()])
          payload = { footer, social }
        } else if (section === 'footer') {
          payload = await fetchFooter()
        } else if (section === 'social') {
          payload = await fetchSocialLinks()
        } else if (section === 'endpoints') {
          payload = { data: [] }
        }

        if (!active) return

        setRawData(payload || { data: [] })
        setTotalPages(payload?.links?.pages_number || 1)
      } catch (requestError) {
        if (!active) return
        setError('تعذر تحميل البيانات من الـ API حالياً')
        setRawData({ data: [], links: null })
      } finally {
        if (active) setLoading(false)
      }
    }

    load()

    return () => {
      active = false
    }
  }, [section, page])

  useEffect(() => {
    setPage(1)
    setSearchQuery('')
  }, [section])

  const cards = useMemo(() => {
    const normalized = section === 'site'
      ? [...normalizeCards('footer', rawData?.footer), ...normalizeCards('social', rawData?.social)]
      : normalizeCards(section, rawData)
    if (!searchQuery.trim()) return normalized

    const needle = searchQuery.trim().toLowerCase()

    return normalized.filter((card) => {
      const haystack = [card.title, card.description, ...(card.badges || []), ...(card.meta || [])]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(needle)
    })
  }, [section, rawData, searchQuery])

  const pageLabel = rawData?.links?.current_page || page

  async function handleCardAction(actionId, card) {
    const requestConfig = buildDetailPayload(section, actionId, card.source)

    if (!requestConfig) {
      return
    }

    setDetailLoading(true)
    try {
      const data = await requestConfig.request
      setDetail({
        title: requestConfig.title,
        subtitle: card.title,
        data,
        meta: [
          `القسم: ${SECTIONS.find((item) => item.id === section)?.label || section}`,
          `الإجراء: ${actionId}`,
        ],
        links: card.href ? [{ label: 'فتح الرابط الأصلي', href: card.href }] : [],
      })
    } finally {
      setDetailLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-islamic-dark via-islamic-primary to-islamic-dark">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <SectionTabs sections={SECTIONS} activeSection={section} onSelect={setSection} />

        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-white/85">
          <p className="text-sm">القسم الحالي: {SECTIONS.find((item) => item.id === section)?.label}</p>
          {rawData?.links ? <p className="text-sm">الصفحة {pageLabel} من {totalPages}</p> : null}
        </div>

        {error ? (
          <div className="rounded-2xl bg-red-500/20 border border-red-300/30 p-4 text-white mb-6">
            {error}
          </div>
        ) : null}

        {detailLoading ? (
          <div className="text-center py-3 text-white text-sm">جارِ تحميل التفاصيل...</div>
        ) : null}

        {loading ? (
          <div className="text-center py-16 text-white text-lg">جارِ تحميل البيانات...</div>
        ) : cards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {cards.map((card, index) => (
              <DataCard key={`${card.title}-${index}`} {...card} onAction={(actionId) => handleCardAction(actionId, card)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-white text-xl">لا توجد نتائج مطابقة للبحث</p>
          </div>
        )}

        {(section === 'items' || section === 'latest' || section === 'authors') && totalPages > 1 ? (
          <div className="mt-10 flex items-center justify-center gap-4 text-white">
            <button
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1}
              className="rounded-lg bg-white/15 px-4 py-2 disabled:opacity-40"
            >
              السابق
            </button>
            <span className="text-sm">{pageLabel} / {totalPages}</span>
            <button
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page >= totalPages}
              className="rounded-lg bg-white/15 px-4 py-2 disabled:opacity-40"
            >
              التالي
            </button>
          </div>
        ) : null}
      </div>

      <DetailModal detail={detail} onClose={() => setDetail(null)} />
    </div>
  )
}

export default App
