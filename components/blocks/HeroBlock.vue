<script setup lang="ts">
interface callToAction {
  title: string;
  url: string;
  class: 'button--normal' | 'button--link' | string;
  target: '_blank' | '_self' | '';
}

interface HeroBlockData {
  bundle: 'hero';
  entity_type: 'block_content';
  field_background:
    | {
        bundle: string;
        entity_type: 'media';
        field_media_oembed_video: {
          height: number;
          html: string;
          provider: string;
          resource_type: string;
          src: string;
          thumbnail: string;
          title: string;
          width: number;
        };
        id: string;
        label: string;
        transform_mode: string;
        type: 'entity';
      }
    | string
    | null;
  field_color_theme: string[];
  field_cta: callToAction | null;
  field_overlay: boolean;
  field_text: string | null;
  field_text_position: 'hero--left' | 'hero--center' | 'hero--right';
  field_title: string;
  id: string;
  transform_mode: string;
  type: 'entity';
}

const props = defineProps<{
  blockData: HeroBlockData;
}>();

// Checking if overlay is turned on without image
const isDarkText = computed(() => {
  return (
    !props.blockData?.field_overlay &&
    props.blockData?.field_background === null
  );
});

const isDarkBg = computed(() => {
  return (
    props.blockData?.field_overlay && props.blockData?.field_background === null
  );
});

// Check if theme overlay should be applied
const hasThemeOverlay = computed(() => {
  return (
    props.blockData?.field_overlay && props.blockData?.field_background !== null
  );
});

const themeClasses = computed(() => {
  return typeof props.blockData?.field_color_theme === 'object'
    ? props.blockData?.field_color_theme
    : '';
});

const isVideo = computed(() => {
  if (
    typeof props.blockData?.field_background === 'object' &&
    props.blockData?.field_background !== null
  ) {
    return props.blockData?.field_background.bundle === 'remote_video';
  }
  return false;
});
</script>

<template>
  <div
    class="hero"
    :class="[
      ...themeClasses,
      { 'hero--video': isVideo },
      { 'hero--dark': isDarkBg },
    ]"
  >
    <BaseMedia
      class="hero__media"
      :block-data="blockData"
      :component-type-class="blockData?.bundle"
      :loading="isVideo ? 'eager' : 'lazy'"
      :is-background="isVideo"
    />
    <div
      v-if="hasThemeOverlay"
      class="hero__overlay"
      :class="!themeClasses ? 'hero__overlay--no-theme' : ''"
    />
    <div
      class="hero__content"
      :class="[
        blockData?.field_text_position,
        { 'hero__content--dark': isDarkText },
      ]"
    >
      <div
        v-if="blockData.field_text !== null || blockData.field_title"
        class="hero__text"
      >
        <h1 v-if="blockData.field_title">{{ blockData.field_title }}</h1>
        <BaseRte
          v-if="blockData.field_text !== null"
          :content="blockData.field_text"
        />
      </div>
      <BaseButton
        v-if="blockData.field_cta !== null"
        :button-data="blockData.field_cta"
        :link="
          typeof blockData.field_cta?.class === 'string' &&
          blockData.field_cta?.class !== 'button--normal'
        "
        :color="blockData.field_cta?.class == 'button--normal' ? '' : 'white'"
      />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.hero {
  position: relative;
  padding: 80px var(--grid-gutter);
  overflow: hidden;

  @media (--viewport-md-min) {
    margin-bottom: 0;
  }

  &--dark {
    background: var(--color-black);

    .hero__text {
      :deep(strong) {
        color: var(--color-black);
        background: var(--color-gray-16);
      }
    }
  }

  &--video {
    padding: 0;
    height: 100vh;
    min-height: 500px;
    display: flex;
    justify-content: center;

    @media (--viewport-md-min) {
      margin-bottom: 0;
    }

    .hero__content {
      transform: translateY(10%);
      padding: 10px var(--grid-gutter);
      margin: 0 var(--grid-gutter) @(--sm) 0;
    }
  }

  &--left {
    text-align: left;
  }

  &--center {
    text-align: center;
  }

  &--right {
    text-align: right;
  }

  &__media {
    :deep(picture) {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--theme-background-color);
    opacity: 0.3;
    z-index: 0;

    &--no-theme {
      background-color: var(--color-black);
    }
  }

  &__content {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    color: var(--color-white);

    &--dark {
      color: var(--color-black);

      .button--link {
        color: var(--color-black);
        border-color: var(--color-black);
        opacity: 1;
        transition: opacity 0.3s ease;

        &:hover,
        &:focus {
          opacity: 0.7;
        }
      }
    }
  }

  &__text {
    margin-bottom: 1rem;

    :deep(h1, h2) {
      font-size: var(--font-size-display);
    }

    :deep(strong) {
      padding: 4px 11px 4px 14px;
      color: var(--color-white);
      font-weight: 200;
      font-size: 14px;
      letter-spacing: 0.24em;
      text-transform: uppercase;
      background: var(--color-black);
    }

    :deep(p:last-child) {
      margin-bottom: 0;
    }
  }
}
</style>
