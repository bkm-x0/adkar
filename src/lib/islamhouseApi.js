const BASE_URL = 'https://api3.islamhouse.com/v3/paV29H2gm56kvLPy'

async function requestJson(path) {
  const response = await fetch(`${BASE_URL}${path}`)

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return response.json()
}

export function fetchItems(page = 1, limit = 12) {
  return requestJson(`/main/showall/ar/showall/${page}/${limit}/json`)
}

export function fetchHomeStats() {
  return requestJson('/main/home/json')
}

export function fetchLatest(page = 1, limit = 12) {
  return requestJson(`/main/get-latest/month/showall/ar/ar/${page}/${limit}/json`)
}

export function fetchCategories() {
  return requestJson('/categories/showall/ar/json')
}

export function fetchAllCategoriesTree() {
  return requestJson('/main/get-object-category-tree/ar/json')
}

export function fetchCategoryChildren(id) {
  return requestJson(`/categories/viewcat/${id}/ar/ar/json`)
}

export function fetchCategoryDetails(id) {
  return requestJson(`/categories/viewitem/${id}/ar/json`)
}

export function fetchCategoryTree(id) {
  return requestJson(`/main/get-sub-categories/${id}/ar/json`)
}

export function fetchCategoryTypesAvailable(id) {
  return requestJson(`/main/get-category-types-available/${id}/ar/ar/json`)
}

export function fetchCategorySourceLanguages(id, language = 'showall') {
  return requestJson(`/main/get-category-source-languages/${id}/${language}/ar/json`)
}

export function fetchAuthors(page = 1, limit = 12) {
  return requestJson(`/main/get-authors-data/showall/showall/countdesc/ar/${page}/${limit}/json`)
}

export function fetchAuthorDetails(id) {
  return requestJson(`/main/get-author/${id}/ar/json`)
}

export function fetchAuthorCardTranslations(id) {
  return requestJson(`/main/get-author-card-translations/${id}/ar/json`)
}

export function fetchAuthorTypesAvailable(id) {
  return requestJson(`/main/get-author-types-avaliable/${id}/ar/ar/json`)
}

export function fetchAuthorAvailableLanguages(id) {
  return requestJson(`/main/get-author-available-languages/${id}/showall/ar/json`)
}

export function fetchAuthorItems(id, page = 1, limit = 12) {
  return requestJson(`/main/get-author-items/${id}/showall/ar/ar/${page}/${limit}/json`)
}

export function fetchLanguages() {
  return requestJson('/languages/get-language-details/json')
}

export function fetchLanguageTerms(language = 'ar') {
  return requestJson(`/languages/get-language-terms/${language}/json`)
}

export function fetchAvailableLanguages(language = 'showall') {
  return requestJson(`/main/get-available-languages/${language}/ar/json`)
}

export function fetchQuranCategories() {
  return requestJson('/quran/get-categories/ar/json')
}

export function fetchQuranCategory(id) {
  return requestJson(`/quran/get-category/${id}/ar/json`)
}

export function fetchQuranAuthor(id) {
  return requestJson(`/quran/get-author/${id}/ar/json`)
}

export function fetchQuranAuthorRecitations(id) {
  return requestJson(`/quran/get-author-recitations/${id}/ar/json`)
}

export function fetchQuranSura(id) {
  return requestJson(`/quran/get-sura/${id}/ar/json`)
}

export function fetchQuranSuraRecitations(id) {
  return requestJson(`/quran/get-sura-recitations/${id}/ar/json`)
}

export function fetchQuranRecitation(id) {
  return requestJson(`/quran/get-recitation/${id}/ar/json`)
}

export function fetchItemDetails(id) {
  return requestJson(`/main/get-item/${id}/ar/json`)
}

export function fetchItemAttachments(id) {
  return requestJson(`/main/check-attachment/${id}/json`)
}

export function fetchItemTree(id) {
  return requestJson(`/main/get-item-tree/${id}/ar/json`)
}

export function fetchItemTranslations(id) {
  return requestJson(`/main/get-item-translations/${id}/ar/json`)
}

export function fetchFooter() {
  return requestJson('/main/get-footer/ar/json')
}

export function fetchSocialLinks() {
  return requestJson('/languages/get-social/ar/json')
}
