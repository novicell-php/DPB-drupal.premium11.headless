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
  <div class="article-view">
    <div class="container container--indented">
      <div class="article-view__header">
        <div class="article-view__header-content">
          <h1>{{ data.label }}</h1>
        </div>
      </div>
    </div>

    <div v-if="!data.field_sponsored" class="container">
      <BaseImage :image="data.field_list_media" />
    </div>

    <Sections
      v-if="data && data.layout_builder__layout"
      :sections="data.layout_builder__layout"
    />
  </div>
</template>

<style lang="postcss" scoped>
.article-view {
  padding: 33px 0 @(--sm) 44px 0;

  &__header {
    display: flex;
    flex-direction: column-reverse;
    margin-bottom: 8px;

    @media (--viewport-sm-min) {
      flex-direction: row;
      margin-bottom: 44px;
    }
  }

  &__header-content {
    max-width: var(--container-narrow-width);
    margin: auto;
    text-align: center;
  }
}
</style>
