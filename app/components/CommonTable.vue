<script setup>
const props = defineProps({
  data: {type: Array, default: () => []},
  columns: {type: Array, default: () => []},
  loading: {type: Boolean, default: false},
  meta: {type: Object, default: () => ({current_page: 1, per_page: 15, total: 0})},
  selectable: {type: Boolean, default: true},
  selectedRows: {type: Object, default: () => ({})},
})

const emit = defineEmits(['update:selectedRows'])

const route = useRoute()
const {t} = useI18n()

const UCheckbox = resolveComponent('UCheckbox')
const UButton = resolveComponent('UButton')

const selectionColumn = {
  id: 'select',
  header: () =>
      h(UCheckbox, {
        modelValue: allRowsSelected.value ? true : someRowsSelected.value ? 'indeterminate' : false,
        'onUpdate:modelValue': toggleSelectAllRows,
        'ariaLabel': t('common.label.select_all'),
      }),
  cell: ({row}) =>
      h(UCheckbox, {
        modelValue: Boolean(props.selectedRows[row.original.id]),
        'onUpdate:modelValue': () => toggleRowSelection(row),
        'ariaLabel': t('common.label.select_row'),
      }),
  meta: {class: {th: 'w-px'}},
}

const sorting = computed(() =>
    route.query.sort
        ? route.query.sort.split(',').map(field => ({id: field.replace(/^-/, ''), desc: field.startsWith('-')}))
        : []
)

const tableColumns = computed(() => [
  ...(props.selectable ? [selectionColumn] : []),
  ...props.columns.map(column => ({
    ...column,
    header: column.enableSorting === false ? column.header : buildSortableHeader(column.header),
    meta: {
      ...column.meta,
      class: {
        ...(column.meta?.class || {}),
        th: column.meta?.class?.th ? `${column.meta.class.th} text-nowrap` : 'text-nowrap'
      },
    },
  })),
])

const allRowsSelected = computed(() => props.data.every(row => props.selectedRows[row.id]))
const someRowsSelected = computed(() => props.data.some(row => props.selectedRows[row.id]) && !allRowsSelected.value)

const paginationFrom = computed(() => (props.meta.current_page - 1) * props.meta.per_page + 1)
const paginationTo = computed(() => Math.min(props.meta.current_page * props.meta.per_page, props.meta.total))

const toggleSelectAllRows = (value) => {
  const updatedSelection = {...props.selectedRows}
  value
      ? props.data.forEach(row => (updatedSelection[row.id] = true))
      : props.data.forEach(row => delete updatedSelection[row.id])
  emit('update:selectedRows', {...updatedSelection})
}

const toggleRowSelection = (row) => {
  const updatedSelection = {...props.selectedRows}
  updatedSelection[row.original.id]
      ? delete updatedSelection[row.original.id]
      : (updatedSelection[row.original.id] = true)
  emit('update:selectedRows', {...updatedSelection})
}

const handleChangePage = (page) => navigateTo({query: {...route.query, page}}, {replace: true})

const handleSort = (value) =>
    navigateTo({
      query: {
        ...route.query,
        sort: value.map(item => (item.desc ? `-${item.id}` : item.id)).join(',') || undefined,
      },
    }, {replace: true})

const buildSortableHeader = (label) => ({column}) => {
  const sort = column.getIsSorted()
  return h(UButton, {
    label,
    color: 'neutral',
    variant: 'link',
    trailingIcon: sort ? (sort === 'asc' ? 'i-lucide-arrow-up' : 'i-lucide-arrow-down') : 'i-lucide-chevrons-up-down',
    class: '-mx-2.5',
    ui: {trailingIcon: 'size-3'},
    onClick: () => sort ? (sort === 'asc' ? column.toggleSorting(true) : column.clearSorting()) : column.toggleSorting(false),
  })
}
</script>

<template>
  <UCard :ui="{ body: 'p-0 sm:p-0' }">
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

        <div class="ms-auto"/>

        <UPagination
            v-if="meta.total > meta.per_page"
            :page="meta.current_page"
            :items-per-page="meta.per_page"
            :total="meta.total"
            :disabled="loading"
            @update:page="handleChangePage"
        />
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
