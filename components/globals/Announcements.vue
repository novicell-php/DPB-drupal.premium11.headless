<script setup>
const props = defineProps({
  announcements: {
    type: Array,
  },
});
</script>

<template>
  <div
    class="announcements"
    v-for="(announcement, index) in announcements"
    :key="index"
  >
    <div class="announcements__content">
      <BaseRte :content="announcement.body" />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.announcements {
  border-bottom: 1px solid var(--color-white);
  text-align: center;

  &__content {
    font-weight: 600;
    padding: 20px;
    background-color: var(--color-success);
    color: var(--color-white);
  }
}
</style>
