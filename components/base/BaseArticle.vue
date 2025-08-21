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
        <BaseImage
          v-if="blockData.field_list_media?.field_media_image"
          :image="blockData.field_list_media"
          class="base-article__image"
        />
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

  &__date {
    font-size: 0.875rem;
    text-align: center;
    margin-bottom: 10px;
    font-family: 'Courier New', Courier, monospace;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  &__title {
    padding-top: 10px;
    font-size: 1.5rem;
  }

  &__content {
    padding: 10px 0;
    font-size: 1rem;
    line-height: 1.5;
  }

  &__button {
    margin-top: 35px;
  }
}
</style>
