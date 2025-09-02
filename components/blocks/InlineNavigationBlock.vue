<script setup>
import { Navigation, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/vue';

const props = defineProps({
  blockData: Object,

  title: {
    type: String,
    required: false,
  },
});

const modules = [Navigation, Scrollbar, A11y];
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
  }
  // If inside narrow layout
  else if (el.closest('.container--narrow')) {
    breakpoints.value = {
      500: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      992: { slidesPerView: 3 },
      1200: { slidesPerView: 3 },
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
  <div class="inline-navigation" ref="containerRef">
    <ClientOnly>
      <h2 v-if="blockData.field_headline" class="inline-navigation__title">
        {{ blockData.field_headline }}
      </h2>
      <Swiper
        :modules="modules"
        :slides-per-view="1"
        :space-between="30"
        :breakpoints="breakpoints"
        navigation
        :scrollbar="{ draggable: true }"
        class="inline-navigation__swiper"
      >
        <SwiperSlide
          v-for="item in blockData.items"
          :key="item.id"
          class="inline-navigation__slide"
        >
          <BaseArticle
            :blockData="item"
            class="inline-navigation__article"
          ></BaseArticle>
        </SwiperSlide>
      </Swiper>
    </ClientOnly>
  </div>
</template>

<style lang="postcss" scoped>
.inline-navigation {
  padding: 30px 0;

  &__slide {
    display: flex;
    flex-direction: column;

    &:first-child {
      margin-left: auto !important;
    }

    &:last-child {
      margin-right: auto !important;
    }
  }

  &__article {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    height: 100%;
  }

  &__title {
    position: relative;
    bottom: -50px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    min-height: 42px;
    margin: 0;
    word-wrap: break-word;
    word-break: break-word;
    overflow-wrap: break-word;
  }
}
</style>
