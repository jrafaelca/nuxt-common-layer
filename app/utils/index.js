export const formatDate = (date, options = {}) => {
  if (!date) return null

  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    ...options,
  }).format(new Date(date))
}

export function formatCurrency(value, currency = null) {
  if (value == null || isNaN(value)) return null

  const config = useRuntimeConfig()

  return new Intl.NumberFormat(config.public.appLocale, {
    style: 'currency',
    currency: currency || config.public.appCurrency,
  }).format(value)
}
