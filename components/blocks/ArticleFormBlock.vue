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

// builds the initial object state from the facets, making sure that if a facet default - its added.
Object.entries(facets).reduce((acc, [key, value]) => {
  acc[key] = Number.isInteger(value.default_value)
    ? value.default_value.toString()
    : value.default_value;
  return acc;
}, object);

object.page = props.blockData.field_articles_form.initial.page;

const content = computed(() =>
  dynamicContent.value
    ? dynamicContent.value
    : props.blockData.field_articles_form.content.content,
);

// Helper function to check if a filter should be in the top section
const isTopFilter = (key, facet) => {
  const keyLower = key.toLowerCase();
  const titleLower = facet.title?.toLowerCase() || '';

  return (
    keyLower.includes('page_size') ||
    keyLower.includes('pagesize') ||
    keyLower.includes('sort') ||
    titleLower.includes('page size') ||
    titleLower.includes('sort')
  );
};

// Helper function to determine filter position
const isSortFilter = (key, facet) => {
  const keyLower = key.toLowerCase();
  const titleLower = facet.title?.toLowerCase() || '';
  return keyLower.includes('sort') || titleLower.includes('sort');
};

// Separate facets into sidebar and top filters
const sidebarFacets = computed(() => {
  const sidebar = {};
  Object.entries(facets).forEach(([key, value]) => {
    if (!isTopFilter(key, value)) {
      sidebar[key] = value;
    }
  });
  return sidebar;
});

const topFacets = computed(() => {
  const sortFilters = {};
  const pageSizeFilters = {};

  Object.entries(facets).forEach(([key, value]) => {
    if (isTopFilter(key, value)) {
      if (isSortFilter(key, value)) {
        sortFilters[key] = value;
      } else {
        pageSizeFilters[key] = value;
      }
    }
  });

  // Return sort filters first, then page size filters
  return { ...sortFilters, ...pageSizeFilters };
});

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

  // builds out the params for filters to be added to the fetch request
  for (const [key, value] of Object.entries(state.value)) {
    if (typeof value === 'object') {
      for (const [key2, val2] of Object.entries(value)) {
        params[`fields[${key}][${key2}]`] = val2;
      }
    } else {
      params[key] = value;
    }
  }

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
      <div class="article-overview__layout">
        <div
          v-if="Object.keys(sidebarFacets).length > 0"
          class="article-overview__filters"
        >
          <div v-for="(facet, key) in sidebarFacets" :key="key" class="facet">
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
          <!-- Top filters for Page Size and Sort By -->
          <div
            v-if="Object.keys(topFacets).length > 0"
            class="article-overview__top-filters"
          >
            <div v-for="(facet, key) in topFacets" :key="key" class="top-facet">
              <label class="top-facet__title">{{ facet.title }}</label>

              <div v-if="facet.type === 'search'">
                <input
                  class="top-facet__input"
                  type="text"
                  v-model="state[key]"
                  placeholder="Search terms"
                />
              </div>

              <!-- Select -->
              <div v-else-if="facet.type === 'select'">
                <select class="top-facet__select" v-model="state[key]">
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

          <div
            class="article-overview__cards"
            :class="{
              'article-overview__cards--loading': loading,
              'article-overview__cards--empty': content.length === 0,
            }"
          >
            <template v-if="content.length === 0">
              <div class="article-overview__no-articles">
                No articles found.
              </div>
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

  &__layout {
    display: flex;
    gap: 40px;
    align-items: flex-start;
  }

  &__filters {
    flex: 0 0 250px;
    background-color: transparent;
    padding: 20px;
    border: 1px solid #eee;
    display: flex;
    flex-direction: column;
    gap: 30px;
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
      accent-color: var(--theme-text-color);
      padding: 0;
      margin: 0;
      vertical-align: middle;
      font-size: 16px;
      line-height: 1.5;
      transition:
        border 0.3s ease,
        box-shadow 0.3s ease;
    }

    &__input {
      padding: 10px;
      font-size: 16px;
      line-height: 1.5;
      border: 1px solid var(--theme-text-color);
      background-color: var(--color-white);
      color: var(--color-text);
      width: 100%;
      height: 40px;
      box-sizing: border-box;
      vertical-align: middle;
      transition:
        border 0.3s ease,
        box-shadow 0.3s ease;

      &:hover {
        border: 1px solid var(--theme-text-color);
      }

      &:focus {
        border: 1px solid var(--theme-text-color);
        box-shadow: 0 0 8px 2px
          color-mix(in srgb, var(--theme-background-color), white 30%);
      }
    }

    & select {
      padding-top: 0;
      padding-bottom: 0;
      font-size: 16px;
      line-height: 40px;
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
      padding-left: 10px;
      height: 40px;
      display: flex;
      align-items: center;
      vertical-align: middle;
      transition:
        border 0.3s ease,
        box-shadow 0.3s ease;

      &:hover {
        border: 1px solid var(--theme-text-color);
      }

      &:focus {
        border: 1px solid var(--theme-text-color);
        box-shadow: 0 0 8px 2px
          color-mix(in srgb, var(--theme-background-color), white 30%);
      }
    }
  }

  &__container {
    position: relative;
  }

  &__content {
    position: relative;
    flex: 1;
  }

  &__top-filters {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
    align-items: flex-end;
    justify-content: space-between;

    @media (--viewport-sm-max) {
      flex-direction: column;
      align-items: stretch;
    }
  }

  .top-facet {
    display: flex;
    align-items: center;

    &__title {
      font-size: 16px;
      color: var(--theme-text-color);
      opacity: 0.7;
    }

    &__select {
      padding: 5px 10px;
      padding-right: 20px;
      border: none;
      cursor: pointer;
      min-width: 50px;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      color: var(--theme-text-color);
      background-color: transparent;
      background-image: url("data:image/svg+xml,%3csvg fill='none' height='8' viewBox='0 0 10 8' width='10' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M1 1l4 4 4-4' stroke='%23333' stroke-width='2'/%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-position: right 1px center;
      transition:
        border 0.3s ease,
        box-shadow 0.3s ease;

      @media (--viewport-sm-max) {
        width: 100%;
      }
    }
  }

  &__cards {
    display: grid;
    gap: 30px 15px;
    grid-template-columns: repeat(3, 1fr);

    @media (--viewport-lg-max) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (--viewport-md-max) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (--viewport-sm-max) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (--viewport-xs-max) {
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

.container--fluid {
  .layout-block--article_form {
    .article-overview {
      &__cards {
        grid-template-columns: repeat(6, 1fr);

        @media (--viewport-lg-max) {
          grid-template-columns: repeat(4, 1fr);
        }

        @media (--viewport-md-max) {
          grid-template-columns: repeat(3, 1fr);
        }

        @media (--viewport-sm-max) {
          grid-template-columns: repeat(2, 1fr);
        }

        @media (--viewport-xs-max) {
          grid-template-columns: 1fr;
          gap: 50px;
        }
      }
    }
  }
}

.container--narrow {
  .layout-block--article_form {
    .article-overview {
      &__cards {
        grid-template-columns: repeat(3, 1fr);

        @media (--viewport-lg-max) {
          grid-template-columns: repeat(3, 1fr);
        }

        @media (--viewport-md-max) {
          grid-template-columns: repeat(2, 1fr);
        }

        @media (--viewport-sm-max) {
          grid-template-columns: repeat(2, 1fr);
        }

        @media (--viewport-xs-max) {
          grid-template-columns: 1fr;
          gap: 50px;
        }
      }
    }
  }
}

.col-md-6 .layout-block--article_form {
  .article-overview {
    &__cards {
      grid-template-columns: repeat(2, 1fr);

      @media (--viewport-lg-max) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (--viewport-md-max) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (--viewport-sm-max) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (--viewport-xs-max) {
        grid-template-columns: 1fr;
        gap: 50px;
      }
    }
  }
}

.col-md-8 .layout-block--article_form {
  .article-overview {
    &__cards {
      grid-template-columns: repeat(3, 1fr);

      @media (--viewport-lg-max) {
        grid-template-columns: repeat(3, 1fr);
      }

      @media (--viewport-md-max) {
        grid-template-columns: repeat(3, 1fr);
      }

      @media (--viewport-sm-max) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (--viewport-xs-max) {
        grid-template-columns: 1fr;
        gap: 50px;
      }
    }
  }
}

.col-md-4 .layout-block--article_form {
  .article-overview {
    &__cards {
      grid-template-columns: 1fr;
    }
  }
}
</style>
