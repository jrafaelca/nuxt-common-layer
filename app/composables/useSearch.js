export function useSearch(defaultQueryKey = 'filter[q]') {
  const route = useRoute()
  const router = useRouter()

  const searchTerm = ref(route.query[defaultQueryKey] || '')

  const searchInputRef = ref(null)

  function handleResetSearchTerm(event) {
    searchTerm.value = ''
    event.target.blur()
  }

  watchDebounced(
    searchTerm,
    (value) => {
      router.replace({
        query: {
          ...route.query,
          [defaultQueryKey]: value || undefined,
          page: undefined,
        },
      })
    },
    { debounce: 300 },
  )

  return {
    searchTerm,
    searchInputRef,
    handleResetSearchTerm,
  }
}
