<script setup>
const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  columns: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  meta: {
    type: Object,
    default: () => ({
      current_page: 1,
      per_page: 15,
      total: 0,
    }),
  },
  selectable: {
    type: Boolean,
    default: true,
  },
  selectedRows: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:selectedRows'])

const route = useRoute()
const { t } = useI18n()

const UCheckbox = resolveComponent('UCheckbox')
const UButton = resolveComponent('UButton')

const selectionColumn = {
  id: 'select',
  header: () =>
    h(UCheckbox, {
      'modelValue': allRowsSelected.value
        ? true
        : someRowsSelected.value
          ? 'indeterminate'
          : false,
      'onUpdate:modelValue': toggleSelectAllRows,
      'ariaLabel': t('common.label.select_all'),
    }),
  cell: ({ row }) =>
    h(UCheckbox, {
      'modelValue': isRowSelected(row),
      'onUpdate:modelValue': () => toggleRowSelection(row),
      'ariaLabel': t('common.label.select_row'),
    }),
  meta: { class: { th: 'w-px' } },
}

const sorting = computed(() =>
  route.query.sort
    ? route.query.sort.split(',').map(field => ({
        id: field.replace(/^-/, ''),
        desc: field.startsWith('-'),
      }))
    : [],
)

const tableColumns = computed(() => {
  const columns = []

  if (props.selectable) {
    columns.push(selectionColumn)
  }

  return [
    ...columns,
    ...props.columns.map(column => ({
      ...column,
      header: column.enableSorting === false
        ? column.header
        : buildSortableHeader(column.header),
      meta: {
        ...column.meta,
        class: {
          ...((column.meta && column.meta.class) || {}),
          th: column.meta?.class?.th
            ? `${column.meta.class.th} text-nowrap`
            : 'text-nowrap',
        },
      },
    })),
  ]
})

const allRowsSelected = computed(() => {
  const rowIds = props.data.map(row => row.id)
  return rowIds.length > 0 && rowIds.every(id => props.selectedRows[id])
})

const someRowsSelected = computed(() => {
  const rowIds = props.data.map(row => row.id)
  return rowIds.some(id => props.selectedRows[id]) && !allRowsSelected.value
})

const paginationFrom = computed(() => (props.meta.current_page - 1) * props.meta.per_page + 1)

const paginationTo = computed(() => Math.min(props.meta.current_page * props.meta.per_page, props.meta.total))

function isRowSelected(row) {
  return !!props.selectedRows[row.original.id]
}

function toggleSelectAllRows(value) {
  const updatedSelection = value
    ? { ...props.selectedRows, ...Object.fromEntries(props.data.map(row => [row.id, value])) }
    : Object.fromEntries(Object.entries(props.selectedRows).filter(([key]) =>
        !props.data.some(row => row.id === key),
      ))

  emit('update:selectedRows', updatedSelection)
}

function toggleRowSelection(row) {
  const updatedSelection = props.selectedRows[row.original.id]
    ? Object.fromEntries(Object.entries(props.selectedRows).filter(([key]) => key !== row.original.id))
    : { ...props.selectedRows, [row.original.id]: true }

  emit('update:selectedRows', updatedSelection)
}

function handleChangePage(page) {
  navigateTo({ query: { ...route.query, page } })
}

function handleSort(value) {
  const sort = value.map(item => item.desc ? `-${item.id}` : item.id).join('')

  navigateTo({
    query: {
      ...route.query,
      sort: sort || undefined,
    },
  }, { replace: true })
}

function buildSortableHeader(label) {
  return ({ column }) => {
    const sort = column.getIsSorted()
    const trailingIcon = sort
      ? sort === 'asc'
        ? 'i-lucide-arrow-up'
        : 'i-lucide-arrow-down'
      : 'i-lucide-chevrons-up-down'

    return h(UButton, {
      label,
      color: 'neutral',
      variant: 'link',
      trailingIcon,
      class: '-mx-2.5',
      ui: { trailingIcon: 'size-3' },
      onClick: () =>
        !sort
          ? column.toggleSorting(false)
          : sort === 'asc'
            ? column.toggleSorting(true)
            : column.clearSorting(),
    })
  }
}
</script>

<template>
  <UCard :ui="{ body: 'p-0 sm:p-0' }">
    <div v-if="$slots.header">
      <slot name="header" />
    </div>

    <template #footer>
      <div class="flex flex-col items-center gap-4 md:flex-row">
        <p class="text-sm">
          {{
            $t('common.label.pagination_showing', {
              from: paginationFrom,
              to: paginationTo,
              total: meta.total,
            })
          }}
        </p>

        <div class="ml-auto">
          <UPagination
            v-if="meta.total > meta.per_page"
            :page="meta.current_page"
            :items-per-page="meta.per_page"
            :total="meta.total"
            :disabled="loading"
            @update:page="handleChangePage"
          />
        </div>
      </div>
    </template>

    <UTable
      ref="table"
      :data="data"
      :sorting="sorting"
      :columns="tableColumns"
      :loading="loading"
      :sorting-options="{ manualSorting: true }"
      @update:sorting="handleSort"
    />
  </UCard>
</template>
