<script setup>
import { scrollTo } from '~/utils/scrollTo';

const config = useRuntimeConfig().public;

const props = defineProps({
  blockData: {
    type: Object,
    required: true,
  },
});

const id = ref('article-overview-' + props.blockData.id);
const pager = ref(props.blockData.field_articles_form.content.pager);
console.log('ArticlesFormBlock props:', props.blockData);

const object = {};
// const facets = props.blockData.field_articles_form.facets;
// Object.keys(facets).map((key) => {
//   object[key] = Number.isInteger(facets[key].default_value)
//     ? facets[key].default_value.toString()
//     : facets[key].default_value;
// });
object.page = props.blockData.field_articles_form.initial.page;

const state = ref(object);
const dynamicContent = ref(null);
const loading = ref(false);

const content = computed(() =>
  dynamicContent.value
    ? dynamicContent.value
    : props.blockData.field_articles_form.content.content,
);

const handlePager = (page) => {
  state.value.page = page;

  updateContent();
};

// const handleInput = () => {
//   state.value.page = 0;

//   updateContent();
// };

const updateContent = async () => {
  loading.value = true;

  const params = {
    page: state.value.page,
  };

  // Object.keys({ ...state.value }).map((key) => {
  //   if (typeof state.value[key] === 'object') {
  //     Object.keys(state.value[key]).map((key2) => {
  //       params[`fields[${key}][${key2}]`] = state.value[key][key2];
  //     });
  //   } else {
  //     params[key] = state.value[key];
  //   }
  // });

  const response = await $fetch(props.blockData.field_articles_form.endpoint, {
    params,
    baseURL: config.API_BASE_URL,
    cache: 'no-cache',
    keepalive: true,
  });

  dynamicContent.value = response.content;
  pager.value = response.pager;
  loading.value = false;

  const headerHeightVar = getComputedStyle(
    document.documentElement,
  ).getPropertyValue('--header-height');
  const headerHeight = parseInt(headerHeightVar, 10) || 0;
  scrollTo(id.value, headerHeight);
};
</script>

<template>
  <div class="article-overview" :id="id">
    <div class="article-overview__container">
      <div
        class="article-overview__content"
        :class="{ 'article-overview__content--loading': loading }"
      >
        <BaseArticle v-for="item in content" :key="item.id" :blockData="item" />
      </div>
      <BaseLoading v-if="loading" class="article-overview__loading" />
    </div>

    <BasePager
      v-if="blockData.field_articles_form.initial.pagination"
      :pager="pager"
      @change="handlePager"
    />
  </div>
</template>

<style lang="postcss" scoped>
.article-overview {
  position: relative;
  /* &__filters {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    padding: 30px 0;
  } */

  &__container {
    position: relative;
  }

  &__content {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 30px 15px;

    @media (--viewport-lg-max) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (--viewport-md-max) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (--viewport-sm-max) {
      grid-template-columns: 1fr;
      gap: 50px;
    }

    &--loading {
      filter: blur(5px);
      opacity: 0.6;
      transition: filter 0.3s ease-in-out;
      pointer-events: none;
    }
  }

  &__loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 5;
  }
}
</style>
