<script setup>
const props = defineProps({
  blockData: Object,
});

const hasContent = computed(() =>
  Boolean(
    props.blockData?.field_appetizer_headline ||
      props.blockData?.field_appetizer_text ||
      props.blockData?.field_appetizer_cta,
  ),
);

const hasImage = computed(() =>
  Boolean(props.blockData?.field_appetizer_image?.field_media_image),
);

const isHovered = ref(false);
const onHover = () => (isHovered.value = true);
const onLeave = () => (isHovered.value = false);
</script>

<template>
  <div
    class="appetizer"
    :class="[
      blockData.field_appetizer_text_alignment
        ? 'appetizer--content-' + blockData.field_appetizer_text_alignment
        : '',
      blockData.field_appetizer_orientation
        ? 'appetizer--image-' + blockData.field_appetizer_orientation
        : '',
    ]"
    v-if="hasImage || hasContent"
  >
    <NuxtLink
      class="appetizer__image"
      :class="{ 'appetizer__image--zoom': isHovered }"
      :to="blockData?.field_appetizer_cta?.url"
      :target="blockData?.field_appetizer_cta?.target || '_self'"
      v-if="hasImage"
      @mouseover="onHover"
      @mouseleave="onLeave"
      :aria-label="`Read more about ${blockData?.field_appetizer_headline ? blockData?.field_appetizer_headline : 'entry'} (image)`"
    >
      <BaseImage
        class="appetizer__image"
        v-if="blockData?.field_appetizer_image?.bundle === 'image'"
        :image="blockData.field_appetizer_image"
        :is-overlay="blockData.field_appetizer_image?.field_overlay"
        :component-type-class="blockData.bundle"
      />
    </NuxtLink>

    <div class="appetizer__content" v-if="hasContent">
      <h2 class="appetizer__title" v-if="blockData.field_appetizer_headline">
        {{ blockData.field_appetizer_headline }}
      </h2>
      <div v-if="blockData.field_appetizer_text" class="appetizer__text">
        <BaseRte :content="blockData.field_appetizer_text" />
      </div>

      <BaseButton
        v-if="blockData.field_appetizer_cta?.title"
        :button-data="blockData.field_appetizer_cta"
        class="appetizer__button"
        @mouseover="onHover"
        @mouseleave="onLeave"
        :aria-label="`Button for ${blockData?.field_appetizer_headline ? blockData?.field_appetizer_headline : 'entry'}`"
      />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.appetizer {
  display: flex;
  flex-direction: column;

  .col-md-4 & {
    flex-direction: column @(--sm) row @(--md) column;
  }

  .col-md-6 & {
    flex-direction: column @(--sm) row @(--md) column;
  }

  .col-md-8 & {
    flex-direction: column @(--sm) row @(--md) row;
  }

  @media (--viewport-sm-min) {
    flex-direction: row;
  }

  &__title {
    font-weight: 700;
    font-size: var(--font-size-h2);
  }

  &__content {
    width: 100%;
    padding: 20px;

    .col-md-4 & {
      width: 100% @(--sm) 50% @(--md) 100%;
    }

    .col-md-8 & {
      width: 100% @(--sm) 50% @(--md) 50%;
    }
  }

  &__image {
    width: 100%;
    overflow: hidden;

    :deep(img) {
      transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }

    &:hover :deep(img) {
      transform: scale(1.05);
    }
  }

  .appetizer__image:hover ~ .appetizer__content .appetizer__button {
    transition:
      background-color 0.3s ease,
      color 0.3s ease;
    background-color: var(--theme-background-color);
    color: var(--theme-text-color);
  }

  .appetizer__image:hover
    ~ .appetizer__content
    .appetizer__button.button--ghost {
    background-color: var(--theme-text-color);
    color: var(--theme-background-color);
  }

  &--content-center {
    text-align: center;
  }

  &--content-right {
    text-align: right;
  }

  &--image-left {
    display: flex;

    .appetizer__image {
      overflow: hidden;
    }
  }

  &--image-right {
    display: flex;
    flex-direction: column;

    @media (--viewport-sm-min) {
      flex-direction: row-reverse;
    }

    & .appetizer__image {
      overflow: hidden;
    }
  }
}

.appetizer__image :deep(img) {
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.appetizer__image--zoom :deep(img) {
  transform: scale(1.05);
}

@media (prefers-reduced-motion: reduce) {
  .appetizer__image :deep(img),
  .appetizer__image--zoom :deep(img) {
    transition: none !important;
    transform: none !important;
  }
}
</style>
