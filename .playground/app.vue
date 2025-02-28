<script setup>
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const selectedRows = ref({})

const tableColumns = [{
  accessorKey: 'name',
  header: 'Name',
  cell: ({row}) => {
    const brand = row.original
    return h(UButton, {
      label: brand.name,
      variant: 'link',
    })
  },
}, {
  id: 'actions',
  cell: ({row}) => {
    return h(UDropdownMenu, {
      content: {align: 'end'},
      items: tableRowActions(row),
    }, () => h(UButton, {
      icon: 'i-lucide-ellipsis-vertical',
      color: 'neutral',
      variant: 'ghost',
    }))
  },
  enableSorting: false,
  meta: {class: {th: 'w-px'}},
}]

const resources = {
  "data": [
    {"name": "Item 1"},
    {"name": "Item 2"},
    {"name": "Item 3"},
    {"name": "Item 4"},
    {"name": "Item 5"},
    {"name": "Item 6"},
    {"name": "Item 7"},
    {"name": "Item 8"},
    {"name": "Item 9"},
    {"name": "Item 10"}
  ],
  "meta": {
    "current_page": 1,
    "from": 1,
    "per_page": 15,
    "to": 15,
    "total": 10
  }
}

function tableRowActions(row) {
  return [{
    label: 'Edit',
    icon: 'i-lucide-pencil',
  }, {
    type: 'separator',
  }, {
    label: 'Delete',
    icon: 'i-lucide-trash',
    color: 'error',
  }]
}
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator/>
    <UContainer>
      <div class="h-16 flex items-center gap-2 mb-6">
        <AppLogo class="h-6 block w-auto"/>

        <div class="ms-auto"/>

        <AppColorModeButton/>
        <AppLocaleDropdown/>
      </div>

      <CommonTable
          v-model:selected-rows="selectedRows"
          :data="resources.data"
          :columns="tableColumns"
          :meta="resources.meta"
      />
    </UContainer>
  </UApp>
</template>
