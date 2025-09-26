<script setup lang="ts">
const props = defineProps({
  blockData: Object,
  loading: {
    type: String as () => 'lazy' | 'eager' | undefined,
    default: 'lazy',
  },
});
</script>

<template>
  <div class="base-media">
    <BaseImage
      v-if="blockData?.field_background?.bundle === 'image'"
      :image="blockData.field_background"
      :is-overlay="blockData.field_overlay"
      :component-type-class="blockData.bundle"
      :loading="loading"
    />

    <!-- Needs improvements!! Not handling if video is uploaded -->
    <BaseVideo
      v-if="blockData?.field_background?.bundle === 'remote_video'"
      :video="blockData.field_background"
      :component-type-class="blockData.bundle"
    />
  </div>
</template>

<style lang="postcss" scoped>
.base-media {
  :deep(.image) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
