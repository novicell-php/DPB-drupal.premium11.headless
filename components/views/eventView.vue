<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <main class="event-view" tabindex="-1">
    <Sections
      v-if="data && data.layout_builder__layout"
      :sections="data.layout_builder__layout"
    />
  </main>
</template>

<style lang="postcss" scoped>
.event-view {
  &__heading {
    padding-top: 20px;
    text-align: center;
  }
}
</style>
