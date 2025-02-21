export function formatCurrency(value, currency = null) {
  if (value == null || isNaN(value)) return null

  const config = useRuntimeConfig()

  return new Intl.NumberFormat(config.public.appLocale, {
    style: 'currency',
    currency: currency || config.public.appCurrency,
  }).format(value)
}
