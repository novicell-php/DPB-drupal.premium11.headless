<script setup>
const props = defineProps({
  blockData: Object,
});

const active = ref(-1);

const toggle = (id) => {
  if (active.value === id) {
    active.value = -1;
  } else {
    active.value = id;
  }
};

const showingAll = ref(false);
const showAll = () => {
  showingAll.value = true;
};
const computedItems = computed(() => {
  if (showingAll.value) {
    return props.blockData.field_accordion_items;
  }
  return props.blockData.field_accordion_items.slice(0, 10);
});
</script>

<template>
  <div class="accordion">
    <h2 class="accordion__title">{{ blockData.field_accordion_headline }}</h2>
    <div v-for="item in computedItems" :key="item.id" class="accordion__item">
      <button
        class="accordion__trigger"
        :class="{ 'accordion__trigger--active': item.id === active }"
        type="button"
        @click="toggle(item.id)"
      >
        <div class="accordion__title-text">
          {{ item.field_accordion_item_headline }}
        </div>
        <div class="accordion__arrow-wrapper">
          <span class="accordion__arrow"><NuxtIcon name="chevron-down" /></span>
        </div>
      </button>
      <div
        :class="{ 'accordion__content--active': item.id === active }"
        class="accordion__content"
      >
        <div
          v-if="item.field_accordion_item_text !== null"
          class="accordion__inner"
        >
          <BaseRte :content="item.field_accordion_item_text"></BaseRte>
        </div>
      </div>
    </div>
    <div
      v-if="blockData.field_accordion_items.length > 10 && !showingAll"
      class="accordion__footer"
    >
      <ClientOnly>
        <button class="accordion__button" @click="showAll">
          {{
            blockData.field_accordion_show_more ||
            $t('accordion.show-more.button-text')
          }}
          <NuxtIcon name="chevron-down" />
        </button>
      </ClientOnly>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.accordion {
  padding: 10px 0;

  &__title {
    font-size: 32px @(--sm) 64px;
    margin-bottom: 48px @(--sm) 96px;
    font-weight: 200;
  }

  &__arrow-wrapper {
    padding-right: 0px @(--sm) 30px;
  }

  &__arrow {
    display: inline-block;
    transition: transform 0.2s ease-in-out;
    margin-left: 3px;

    &--up {
      transform: rotate(180deg);
    }
  }

  &__title-text {
    border-bottom: 1px solid transparent;
    transition: border-bottom 0.3s ease-in-out;
    line-height: normal;
  }

  &__item {
    overflow: hidden;
    background: var(--color-white);
    color: var(--theme-text-color);
    border-top: 1px solid var(--theme-color);
  }

  &__trigger {
    background-color: var(--theme-background-color);
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 16px 0;
    color: var(--theme-color);
    font-weight: 200;
    font-size: 21px @(--sm) 32px;
    font-family: var(--heading-font-family);
    text-align: left;
    border: none;

    &:hover {
      .accordion__title-text {
        border-bottom: 1px solid #000;
      }
    }

    span {
      transition: transform 0.3s;
    }

    &--active {
      span {
        transform: rotate(90deg);
      }
    }

    :deep(.nuxt-icon) {
      font-size: 16px;

      @media (--viewport-sm-min) {
        font-size: 24px;
      }
    }
  }

  &__content {
    display: none;
    overflow: hidden;

    :deep(p) {
      font-size: 16px @(--sm) 18px;
      font-weight: 300;
    }

    &--active {
      display: block;
      background-color: var(--theme-background-color);
    }
  }

  &__inner {
    padding-top: 20px @(--sm) 30px;
    background-color: var(--theme-background-color);
    color: var(--theme-color);
    width: 100% @(--sm) 50%;
  }

  &__footer {
    display: flex;
    justify-content: center;
    padding-top: 14px;
  }

  &__button {
    border: none;
    color: var(--theme-color);
    background-color: transparent;
    font-size: 18px;
    font-family: var(--heading-font-family);
    font-weight: 300;
  }
}

.accordion__item:last-child {
  border-bottom: 1px solid var(--theme-color);
  /* Add bottom border for the last item */
}
</style>
