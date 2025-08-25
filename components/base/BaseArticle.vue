<script setup>
import BaseImage from './BaseImage.vue';

const props = defineProps({
  blockData: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="base-article">
    <NuxtLink :to="blockData.url" class="base-article__link">
      <div class="base-article__body">
        <div class="base-article__date" v-if="blockData.field_list_date">
          {{ blockData.field_list_date }}
        </div>
        <div
          v-if="blockData.field_list_media?.field_media_image"
          class="base-article__image"
        >
          <BaseImage :image="blockData.field_list_media" />
          <span class="base-article__type-label">{{
            blockData.field_article_type.label
          }}</span>
        </div>
        <div
          role="heading"
          aria-level="3"
          v-if="blockData.label"
          class="base-article__title"
        >
          {{ blockData.label }}
        </div>
        <div class="base-article__content" v-if="blockData.field_description">
          {{ blockData.field_description }}
        </div>
      </div>

      <button class="button button--ghost base-article__button">
        Read more
      </button>
    </NuxtLink>
  </div>
</template>

<style lang="postcss" scoped>
.base-article {
  display: flex;
  flex-direction: column;

  &__link {
    text-decoration: none;
    color: var(--theme-text-color) !important;
    display: flex;
    flex-direction: column;
    height: 100%;

    &:hover {
      :deep(img) {
        transform: scale(1.1);
        transition: transform 3s;
      }

      .base-article__button {
        background-color: var(--theme-text-color);
        color: var(--theme-background-color);
      }
    }
  }

  &__body {
    flex-grow: 1;
  }

  &__image {
    position: relative;
    overflow: hidden;
    transition: opacity 0.25s;

    :deep(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      transition: transform 0.5s;
    }
  }

  &__type-label {
    position: absolute;
    bottom: 8px;
    right: 8px;
    background-color: rgba(0, 0, 0, 0.7);
    color: var(--color-white);
    padding: 2px 10px;
    font-size: 12px;
    pointer-events: none;
    letter-spacing: 1px;
  }

  &__date {
    font-size: 13px;
    text-align: center;
    margin-bottom: 10px;
    font-family: 'Courier New', Courier, monospace;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  &__title {
    padding-top: 10px;
    font-size: 20px;
  }

  &__content {
    padding: 10px 0;
    font-size: 16px;
    line-height: 1.5;
    min-height: 130px;
  }

  &__button {
    margin-top: 10px;
  }
}
</style>
