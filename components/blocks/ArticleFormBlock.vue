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
const object = {};
const facets = props.blockData.field_articles_form.facets;
const state = ref(object);
const dynamicContent = ref(null);
const loading = ref(false);

Object.keys(facets).map((key) => {
  object[key] = Number.isInteger(facets[key].default_value)
    ? facets[key].default_value.toString()
    : facets[key].default_value;
});

object.page = props.blockData.field_articles_form.initial.page;

const content = computed(() =>
  dynamicContent.value
    ? dynamicContent.value
    : props.blockData.field_articles_form.content.content,
);

const handlePager = (page) => {
  state.value.page = page;

  updateContent();
};

function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

const updateContentDebounced = debounce(() => {
  state.value.page = 0;
  updateContent();
}, 500);

Object.keys(facets).forEach((key) => {
  if (key !== 'page') {
    watch(
      () => state.value[key],
      () => {
        if (facets[key].type === 'search') {
          updateContentDebounced();
        } else {
          state.value.page = 0;
          updateContent();
        }
      },
      { deep: true },
    );
  }
});

const updateContent = async () => {
  loading.value = true;

  const params = {
    page: state.value.page,
  };

  Object.keys({ ...state.value }).map((key) => {
    if (typeof state.value[key] === 'object') {
      Object.keys(state.value[key]).map((key2) => {
        params[`fields[${key}][${key2}]`] = state.value[key][key2];
      });
    } else {
      params[key] = state.value[key];
    }
  });

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
      <div class="article-overview__filters">
        <div v-for="(facet, key) in facets" :key="key" class="facet">
          <label class="facet__title">{{ facet.title }}</label>

          <div v-if="facet.type === 'search'">
            <input
              class="facet__input"
              type="text"
              v-model="state[key]"
              placeholder="Search terms"
            />
          </div>

          <!-- Checkboxes -->
          <div v-else-if="facet.type === 'checkboxes'">
            <label
              v-for="opt in facet.options"
              :key="opt.value"
              class="facet__option"
            >
              <input
                type="checkbox"
                :value="opt.key"
                v-model="state[key]"
                class="facet__checkbox"
              />
              {{ opt.value }}
            </label>
          </div>

          <!-- Select -->
          <div v-else-if="facet.type === 'select'">
            <select class="facet__select" v-model="state[key]">
              <option
                v-for="opt in facet.options"
                :key="opt.key"
                :value="opt.key"
              >
                {{ opt.value }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="article-overview__content">
        <div
          class="article-overview__cards"
          :class="{
            'article-overview__cards--loading': loading,
            'article-overview__cards--empty': content.length === 0,
          }"
        >
          <template v-if="content.length === 0">
            <div class="article-overview__no-articles">No articles found.</div>
          </template>
          <template v-else>
            <BaseArticle
              v-for="item in content"
              :key="item.id"
              :blockData="item"
            />
          </template>
        </div>
        <BaseLoading v-if="loading" class="article-overview__loading" />
      </div>
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

  &__filters {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    padding: 30px 0;
  }

  .facet {
    display: flex;
    flex-direction: column;
    gap: 0 8px;
    min-width: 200px;

    &__title {
      font-weight: 600;
      margin-bottom: 10px;
      font-size: 16px;
      color: var(--theme-text-color);
    }

    &__option {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 16px;
      cursor: pointer;
      width: fit-content;
    }

    &__checkbox {
      width: 16px;
      height: 16px;
      cursor: pointer;
      accent-color: var(--theme-text-color) !important;
      padding: 0;
      margin: 0;
      vertical-align: middle;
      font-size: 16px;
      line-height: 1.5;
    }

    &__input {
      padding: 10px;
      font-size: 16px;
      line-height: 1.5;
      border: 1px solid var(--theme-text-color);
      background-color: var(--color-white);
      color: var(--theme-text-color);
      width: 100%;
      height: 40px;
      box-sizing: border-box;
      vertical-align: middle;
    }

    & select {
      padding: 10px;
      font-size: 16px;
      line-height: 1.5;
      border: 1px solid var(--theme-text-color);
      background-color: var(--color-white);
      cursor: pointer;
      width: 100%;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      background-image: url("data:image/svg+xml,%3csvg fill='none' height='8' viewBox='0 0 10 8' width='10' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M1 1l4 4 4-4' stroke='%23333' stroke-width='2'/%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-position: right 10px center;
      padding-right: 30px;
      height: 40px;
      vertical-align: middle;
    }
  }

  &__container {
    position: relative;
  }

  &__content {
    position: relative;
  }

  &__cards {
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

    &--empty {
      display: block;
      grid-template-columns: none;
      width: 100%;
    }
  }

  &__loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 5;
  }

  &__no-articles {
    text-align: center;
    margin-top: 20px;
  }
}
</style>
