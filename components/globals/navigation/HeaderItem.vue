<script setup>
const props = defineProps({
  node: {
    type: Object,
    required: false,
  },
});

const hasChildren = computed(() => {
  const { below } = props.node;

  if (below.length === 0) {
    return false;
  } else if (below.length > 0) {
    return true;
  }
});

const isOpen = ref(false);
const toggle = () => {
  isOpen.value = !isOpen.value;
};

const removeNoScroll = () => {
  document.body.classList.remove('no-scroll');
};
</script>

<template>
  <div class="header-item">
    <div class="header-item__item">
      <NuxtLink
        v-if="node?.url && !hasChildren"
        :to="node?.url"
        :target="node?.url_options?.attributes?.target"
        class="header-item__link"
        :aria-label="'Gå til' + node?.title"
        @click="removeNoScroll"
      >
        {{ node?.title }}
      </NuxtLink>
      <span v-if="node?.description" class="header-item__tooltip">
        {{ node?.description }}
      </span>

      <span
        v-if="hasChildren && !node?.url"
        class="header-item__trigger"
        aria-label="Åben menu"
        :class="{ 'header-item__trigger--open': isOpen }"
        type="button"
        @click="toggle"
      >
        <span class="header-item__link">
          {{ node?.title }}
        </span>
        <NuxtIcon class="button__icon-after" name="chevron-down" fill />
      </span>
      <span
        v-else-if="hasChildren && node?.url"
        class="header-item__trigger"
        :class="{ 'header-item__trigger--open': isOpen }"
      >
        <NuxtLink
          :to="node?.url"
          :target="node?.url_options?.attributes?.target"
          class="header-item__link"
          :aria-label="'Gå til' + node?.title"
          @click="removeNoScroll"
        >
          {{ node?.title }}
        </NuxtLink>
        <NuxtIcon
          class="button__icon-after"
          name="chevron-down"
          fill
          aria-label="Åben menu"
          type="button"
          @click="toggle"
        />
      </span>
    </div>

    <ul v-if="hasChildren && isOpen" class="header-item__children">
      <HeaderItem v-for="child in node?.below" :key="child.id" :node="child" />
    </ul>
  </div>
</template>

<style lang="postcss" scoped>
.header-item {
  position: relative;

  &__item {
    position: relative;
    display: flex;
    align-items: center;
    font-size: 16px;
    padding: 0 20px;

    @media (--viewport-md-min) {
      padding: 0 20px;
    }

    &:hover {
      .header-item__tooltip {
        visibility: visible;
        opacity: 1;
      }
    }
  }

  &__link {
    color: var(--color-text);
    text-decoration: none;
    font-size: 16px;
    transition: color 0.2s;

    &:hover {
      color: var(--color-primary);
    }
  }

  &__tooltip {
    position: absolute;
    top: 50%;
    right: 20px;
    z-index: 1;
    display: none;
    padding: 5px 10px;
    background-color: var(--color-dark);
    color: #fff;
    border-radius: 4px;
    font-size: 14px;
    white-space: nowrap;
    visibility: hidden;
    opacity: 0;
    transition:
      opacity 0.2s,
      visibility 0.2s;

    @media (--viewport-md-min) {
      display: block;
    }
  }

  &__trigger {
    position: relative;
    padding-right: 30px;
    color: var(--color-text);
    font-size: 16px;
    background: none;
    border: none;
    cursor: pointer;

    .nuxt-icon {
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      transition: transform 0.3s;
    }

    &--open .nuxt-icon {
      transform: translateY(-50%) rotate(180deg);
    }
  }

  &__children {
    position: absolute;
    margin: 0;
    padding: 5px 0;
    list-style: none;
  }
}
</style>
