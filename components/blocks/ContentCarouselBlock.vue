<script setup>
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/vue';

const props = defineProps({
  blockData: Object,
});

const modules = [Navigation];
const breakpoints = ref({});
const containerRef = ref(null);

onMounted(() => {
  const el = containerRef.value;
  if (!el) return;

  const wrapper = el.closest('.col-md-8, .col-md-6, .col-md-4');
  let layoutClass = null;

  if (wrapper) {
    if (wrapper.classList.contains('col-md-8')) layoutClass = 'col-md-8';
    else if (wrapper.classList.contains('col-md-6')) layoutClass = 'col-md-6';
    else if (wrapper.classList.contains('col-md-4')) layoutClass = 'col-md-4';
  } else {
    let ancestor = el.parentElement;
    while (ancestor) {
      const match =
        ancestor.className && ancestor.className.match(/\bcol-md-(\d+)\b/);
      if (match) {
        layoutClass = `col-md-${match[1]}`;
        break;
      }
      ancestor = ancestor.parentElement;
    }
  }

  if (layoutClass === 'col-md-8') {
    breakpoints.value = {
      500: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      1200: { slidesPerView: 2 },
    };
  } else if (layoutClass === 'col-md-6') {
    breakpoints.value = {
      500: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
    };
  } else if (layoutClass === 'col-md-4') {
    breakpoints.value = {
      500: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      992: { slidesPerView: 1 },
    };
  } else if (el.closest('.container--narrow')) {
    breakpoints.value = {
      500: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
    };
  } else {
    breakpoints.value = {
      500: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      992: { slidesPerView: 3 },
      1200: { slidesPerView: 4 },
    };
  }
});
</script>

<template>
  <div class="content-carousel" ref="containerRef">
    <ClientOnly>
      <h2 v-if="blockData.field_title" class="content-carousel__title">
        {{ blockData.field_title }}
      </h2>
      <Swiper
        :modules="modules"
        :slides-per-view="1"
        :space-between="0"
        :breakpoints="breakpoints"
        navigation
        class="content-carousel__swiper"
      >
        <SwiperSlide
          v-for="item in blockData.field_content_cards"
          :key="item.id"
          class="content-carousel__slide"
        >
          <template v-if="item.field_styled_link?.url">
            <NuxtLink
              :to="item.field_styled_link.url"
              :target="item.field_styled_link.target || '_self'"
              class="content-carousel__card"
            >
              <div class="content-carousel__image-wrapper">
                <BaseImage
                  v-if="item.field_media"
                  :image="item.field_media"
                  class="content-carousel__image"
                ></BaseImage>
                <div v-else class="content-carousel__fallback-wrapper">
                  <BaseNoImageFallback />
                </div>
              </div>

              <div
                class="content-carousel__card-title"
                role="heading"
                aria-level="3"
              >
                {{ item.field_title }}
              </div>

              <div
                class="content-carousel__card-text"
                :class="
                  item.field_styled_link?.title
                    ? 'content-carousel__card-text-button-spacing'
                    : ''
                "
              >
                <BaseRte :content="item.field_text" />
              </div>

              <BaseButton
                v-if="item.field_styled_link?.title"
                :button-data="item.field_styled_link"
                class="content-carousel__button"
                :aria-label="`Button for ${item?.field_styled_link?.title}`"
              />
            </NuxtLink>
          </template>
          <template v-else>
            <div class="content-carousel__card">
              <div class="content-carousel__image-wrapper">
                <BaseImage
                  v-if="item.field_media"
                  :image="item.field_media"
                  class="content-carousel__image"
                ></BaseImage>
                <div v-else class="content-carousel__fallback-wrapper">
                  <BaseNoImageFallback />
                </div>
              </div>

              <div
                class="content-carousel__card-title"
                role="heading"
                aria-level="3"
              >
                {{ item.field_title }}
              </div>

              <div
                class="content-carousel__card-text"
                :class="
                  item.field_styled_link?.title
                    ? 'content-carousel__card-text-button-spacing'
                    : ''
                "
              >
                <BaseRte :content="item.field_text" />
              </div>

              <BaseButton
                v-if="item.field_styled_link?.title"
                :button-data="item.field_styled_link"
                class="content-carousel__button"
                :aria-label="`Button for ${item?.field_styled_link?.title}`"
              />
            </div>
          </template>
        </SwiperSlide>
      </Swiper>
    </ClientOnly>
  </div>
</template>

<style lang="postcss" scoped>
.content-carousel {
  transition: transform 0.3s ease;
  position: relative;

  &__card-title,
  &__card-text {
    padding: 0 10px;
  }

  &__card-title {
    font-weight: 700;
    font-size: var(--font-size-h3);
    padding-top: 10px;
  }

  &__card-text-button-spacing {
    margin-bottom: 20px;
  }

  &__title {
    position: relative;
    bottom: -45px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    min-height: 42px;
    margin: 0;
    word-wrap: break-word;
    word-break: break-word;
    overflow-wrap: break-word;
  }

  &__image-wrapper {
    overflow: hidden;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition:
      transform 0.8s cubic-bezier(0.4, 0, 0.2, 1),
      filter 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &__card {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    height: 100%;
    text-align: center;
    text-decoration: none;
    color: inherit;

    &:focus,
    &:hover {
      text-decoration: none;
      color: inherit;
    }
  }

  &__card:hover .content-carousel__image {
    transform: scale(1.05);
    filter: brightness(0.8);
  }

  &__card:hover .content-carousel__button {
    transition:
      background-color 0.3s ease,
      color 0.3s ease;
    background-color: var(--theme-background-color);
    color: var(--theme-text-color);
  }

  &__card:hover .content-carousel__button.button--ghost {
    background-color: var(--theme-text-color);
    color: var(--theme-background-color);
  }

  &__button {
    margin-top: auto;
    align-self: center;
  }

  &__fallback-wrapper {
    padding-top: 56.25%;
    position: relative;
    overflow: hidden;
  }

  &__fallback-wrapper > * {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  :deep(.swiper-button-next),
  :deep(.swiper-button-prev) {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 32px;
    height: 32px;
    z-index: 10;
    border: none;
  }

  :deep(.swiper-button-next) {
    right: 10px;
  }

  :deep(.swiper-button-prev) {
    left: 10px;
  }

  :deep(.swiper-button-next::after),
  :deep(.swiper-button-prev::after) {
    font-size: 32px;
    color: var(--color-white);
    text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
    font-weight: 700;
  }

  :deep(.swiper-button-prev.swiper-button-disabled),
  :deep(.swiper-button-next.swiper-button-disabled) {
    visibility: hidden;
  }
}
</style>
