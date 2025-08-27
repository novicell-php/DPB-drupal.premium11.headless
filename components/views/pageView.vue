<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: null,
  },
  pageHeader: {
    type: Object,
    required: false,
    default: null,
  },
});
</script>

<template>
  <main class="page-view">
    <PageHeader v-if="pageHeader" :page-block-header-data="pageHeader" />

    <Sections
      v-if="data && data.layout_builder__layout"
      :sections="data.layout_builder__layout"
    />
  </main>
</template>

<style lang="postcss">
main {
  padding-top: 0;
}
</style>
