<script setup lang="ts">
interface LinkCard {
  id: string;
  bundle: 'link_card';
  type: string;
  transform_mode: string;
  field_link: any;
  field_media?: {
    bundle: string;
  };
  field_text: string | null;
  field_title: string | null;
  [key: string]: any;
}

interface LinkBoxBlockData {
  id: string;
  bundle: 'link_box';
  field_cta?: {
    title: string;
    class: string;
    url: string;
    target?: string;
  };
  field_link_cards: LinkCard[];
  field_title: string | null;
  transform_mode: string;
  type: string;
}

const props = defineProps<{
  blockData: LinkBoxBlockData;
}>();
</script>

<template>
  <div class="link-box">
    <div
      role="heading"
      class="link-box__title"
      aria-level="2"
      v-if="props.blockData?.field_title || props.blockData?.field_cta?.title"
    >
      {{ props.blockData?.field_title }}
      <BaseButton
        v-if="blockData.field_cta?.title"
        :button-data="blockData.field_cta"
        class="link-box__button"
        :aria-label="`Button for ${blockData?.field_cta?.title}`"
      />
    </div>

    <div class="link-box__cards">
      <div
        v-for="card in blockData.field_link_cards"
        :key="card.id"
        class="link-box__card"
      >
        <NuxtLink
          :to="card?.field_link?.url"
          :target="card?.field_link?.target || '_self'"
          class="link-box__card-link"
          :aria-label="`Read more about ${card?.field_title ? card?.field_title : 'entry'} (link box)`"
        >
          <div class="link-box__card-content">
            <h3 class="link-box__card-title" v-if="card.field_title">
              {{ card.field_title }}
            </h3>
            <div v-if="card.field_text" class="link-box__card-text">
              <BaseRte :content="card.field_text" />
            </div>
          </div>

          <BaseImage
            class="link-box__card-image"
            v-if="card?.field_media?.bundle === 'image'"
            :image="card.field_media"
            :is-overlay="false"
            :component-type-class="card.bundle"
          />

          <div v-if="!card.field_media" class="link-box__card-no-image">
            <BaseNoImageFallback />
          </div>

          <div class="link-box__card-overlay"></div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.link-box {
  &__title {
    display: flex;
    font-size: var(--font-size-h2);
    align-items: center;
    margin-bottom: 1rem;

    @media (--viewport-sm-max) {
      display: inline-grid;
      text-align: center;
      gap: 0.5rem;
      width: 100%;
    }
  }

  &__button {
    margin-left: auto;

    @media (--viewport-sm-max) {
      margin-left: 0;
      justify-self: center;
    }
  }

  &__cards {
    display: flex;
    flex-wrap: wrap;
  }

  &__card {
    flex-basis: 100%;
    position: relative;
    text-align: center;

    &:hover,
    &:focus-within {
      .link-box__card-overlay {
        opacity: 1;
      }
      .link-box__card-content {
        opacity: 1;
        transform: translate(-50%, -50%) translateY(0);
      }
    }

    @media (--viewport-md-min) {
      flex-basis: 50%;
    }
    @media (--viewport-lg-min) {
      flex-basis: 33.33%;
    }
  }

  &__card-link {
    display: block;
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  &__card-link:hover :deep(img),
  &__card-link:focus :deep(img) {
    transform: scale(1.05);
    transition: transform 0.5s ease-in-out;
  }

  &__card-link :deep(img) {
    transition: transform 0.5s ease-in-out;
  }

  &__card-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) translateY(10px);
    color: var(--color-white);
    z-index: 2;
    opacity: 0;
    transition:
      opacity 0.25s ease 0s,
      transform 0.25s ease 0s;
  }

  .link-box__card:hover &__card-content,
  .link-box__card:focus-within &__card-content {
    opacity: 1;
    transform: translate(-50%, -50%) translateY(0);
    transition-delay: 0.35s;
  }

  &__card-no-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
  }

  &__card-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    opacity: 0;
    z-index: 1;
    transition: opacity 0.4s ease-in-out;
  }
}

.container--fluid {
  .layout-block--link_box {
    .link-box {
      &__card {
        @media (--viewport-md-min) {
          flex-basis: 33.33%;
        }
        @media (--viewport-lg-min) {
          flex-basis: 25%;
        }
      }
    }
  }
}

.container--narrow {
  .layout-block--link_box {
    .link-box {
      &__card {
        @media (--viewport-md-min) {
          flex-basis: 50%;
        }
      }
    }
  }
}

.col-md-8 .layout-block--link_box {
  .link-box {
    &__card {
      flex-basis: 100%;
    }
  }
}

.col-md-6 .layout-block--link_box {
  .link-box {
    &__card {
      flex-basis: 100%;
    }
  }
}

.col-md-4 .layout-block--link_box {
  .link-box {
    &__card {
      flex-basis: 100%;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .link-box__card-link--zoom :deep(img),
  .link-box__card-link :deep(img) {
    transition: none !important;
    transform: none !important;
  }
}

@media (--viewport-sm-max) {
  .link-box__card-content {
    opacity: 1;
    transform: translate(-50%, -50%) translateY(0);
    transition: none;
  }
  .link-box__card-overlay {
    opacity: 0.6;
    transition: none;
  }
}
</style>
