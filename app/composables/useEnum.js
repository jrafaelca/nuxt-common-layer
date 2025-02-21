export const useEnum = (items = []) => {
  const { t } = useI18n()

  if (!Array.isArray(items) || items.length === 0) {
    return {
      cases: {},
      getLabel: () => null,
      getColor: () => null,
      getIcon: () => null,
      options: [],
    }
  }

  const cases = items.reduce((acc, { value, label, color, icon }) => {
    if (!value) return acc
    acc[value.toUpperCase()] = { value, label, color, icon }
    return acc
  }, {})

  const getLabel = status => cases[status?.toUpperCase()] ? t(cases[status.toUpperCase()].label) : null
  const getColor = status => cases[status?.toUpperCase()]?.color ?? null
  const getIcon = status => cases[status?.toUpperCase()]?.icon ?? null

  const options = items.map(({ value, label, color, icon }) => ({
    value,
    label: label ? t(label) : label,
    ...(color && { chip: { color } }),
    ...(icon && { icon }),
  }))

  return {
    cases,
    getColor,
    getLabel,
    getIcon,
    options,
  }
}
