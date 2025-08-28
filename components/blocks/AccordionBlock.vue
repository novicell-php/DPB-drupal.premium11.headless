<script setup>
const props = defineProps({
  blockData: Object,
});

const activeId = ref(null);

const isActive = (id) => activeId.value === id;

const toggle = (id) => {
  activeId.value = isActive(id) ? null : id;
};

const showingAll = ref(false);

const computedItems = computed(() =>
  showingAll.value
    ? props.blockData.field_accordion_items
    : props.blockData.field_accordion_items.slice(0, 10),
);
</script>

<template>
  <div class="accordion">
    <h2 class="accordion__title">{{ blockData.field_accordion_headline }}</h2>
    <div v-for="item in computedItems" :key="item.id" class="accordion__item">
      <button
        class="accordion__trigger"
        :class="{ 'accordion__trigger--active': isActive(item.id) }"
        type="button"
        @click="toggle(item.id)"
        :aria-expanded="isActive(item.id).toString()"
        :aria-controls="'accordion-content-' + item.id"
        :id="'accordion-trigger-' + item.id"
      >
        <div class="accordion__text-wrapper">
          <div class="accordion__title-text">
            {{ item.field_accordion_item_headline }}
          </div>
        </div>
        <div class="accordion__arrow-wrapper">
          <span class="accordion__arrow"><NuxtIcon name="chevron-down" /></span>
        </div>
      </button>
      <div
        :class="{ 'accordion__content--active': isActive(item.id) }"
        class="accordion__content"
        :id="'accordion-content-' + item.id"
        role="region"
        :aria-labelledby="'accordion-trigger-' + item.id"
      >
        <div v-if="item.field_accordion_item_text" class="accordion__inner">
          <BaseRte :content="item.field_accordion_item_text"></BaseRte>
        </div>
      </div>
    </div>
    <div
      v-if="blockData.field_accordion_items.length > 10 && !showingAll"
      class="accordion__footer"
    >
      <ClientOnly>
        <button class="accordion__button" @click="showingAll = true">
          <span class="accordion__button-text">
            {{ blockData.field_accordion_show_more || 'Show More' }}</span
          >
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
    margin-bottom: 32px @(--sm) 64px;
    font-weight: 200;
  }

  &__arrow-wrapper {
    padding-right: 0px @(--sm) 30px;
  }

  &__arrow {
    display: inline-block;
    transition: transform 0.3s ease-in-out;
    margin-left: 3px;
    transform: rotate(0);
  }

  &__trigger--active .accordion__arrow {
    transform: rotate(180deg);
  }

  &__text-wrapper {
    padding-left: 0px @(--sm) 30px;
  }

  &__title-text {
    border-bottom: 2px solid transparent;
    transition: border-bottom 0.3s ease-in-out;
    line-height: normal;
  }

  .accordion__trigger--active .accordion__title-text {
    border-bottom: 2px solid var(--theme-text-color);
  }

  &__item {
    overflow: hidden;
    color: var(--theme-text-color);
    border-top: 1px solid var(--theme-text-color);

    &:last-child {
      border-bottom: 1px solid var(--theme-text-color);
    }
  }

  &__trigger {
    background-color: var(--theme-background-color);
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 16px 0;
    color: var(--theme-text-color);
    font-weight: 200;
    font-size: 21px @(--sm) 32px;
    font-family: var(--heading-font-family);
    text-align: left;
    border: none;
    border-bottom: 1px solid transparent;
    transition:
      background-color 0.3s ease,
      border-bottom 0.3s ease;

    &:hover,
    &:focus {
      background-color: color-mix(
        in srgb,
        var(--theme-background-color),
        #000 5%
      );
      .accordion__title-text {
        border-bottom: 2px solid var(--theme-text-color);
      }
    }

    span {
      transition: transform 0.3s;
    }

    :deep(.nuxt-icon) {
      font-size: 16px;

      @media (--viewport-sm-min) {
        font-size: 24px;
      }
    }
  }

  &__content {
    max-height: 0;
    opacity: 0;
    overflow: hidden;
    transition:
      max-height 0.4s ease,
      opacity 0.4s ease;
    background-color: var(--theme-background-color);

    :deep(p) {
      font-size: 16px @(--sm) 18px;
      font-weight: 300;
    }

    &--active {
      max-height: 1000px;
      opacity: 1;
    }
  }

  &__inner {
    color: var(--theme-text-color);
    padding: 30px 30px 0 30px;
    width: 100%;
    border-top: 1px solid
      color-mix(in srgb, var(--theme-text-color), transparent 70%);
    transition: padding 0.3s ease;

    :deep(p:last-of-type) {
      margin-bottom: 10px;
    }

    @media (--viewport-sm-max) {
      padding: 20px 20px 0 20px;
    }
  }

  &__footer {
    display: flex;
    justify-content: center;
    padding-top: 14px;
  }

  &__button {
    border: none;
    color: var(--theme-text-color);
    background-color: transparent;
    font-size: 18px;
    font-family: var(--heading-font-family);
    font-weight: 300;

    &:hover {
      .accordion__button-text {
        border-bottom: 1px solid var(--theme-text-color);
        opacity: 0.8;
      }
    }

    .nuxt-icon {
      padding-left: 6px;
    }
  }

  &__button-text {
    border-bottom: 1px solid transparent;
    transition: all 0.3s ease-in-out;
  }
}

.col-md-4 .layout-block--accordion .accordion__title {
  font-size: 32px;
}
</style>
