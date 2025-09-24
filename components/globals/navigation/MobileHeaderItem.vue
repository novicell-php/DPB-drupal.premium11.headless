<script setup>
const props = defineProps({
  node: {
    type: Object,
    required: false,
  },
});

const currentDrawerKey = inject('currentDrawerKey', ref(null));

const hasChildren = computed(() => {
  const { below } = props.node || {};
  return below && below.length > 0;
});

const isActiveDrawerItem = computed(
  () => currentDrawerKey.value === props.node?.title,
);

const closeDrawer = () => {
  currentDrawerKey.value = null;
};

const handleClick = () => {
  if (!props.node) return;

  const key = props.node.title;

  if (hasChildren.value) {
    if (currentDrawerKey.value === key) {
      closeDrawer();
    } else {
      currentDrawerKey.value = key;
    }
  }
};

const emit = defineEmits(['closeMobileDrawer']);
const closeMobileDrawer = () => {
  currentDrawerKey.value = null;
  emit('closeMobileDrawer');
};
</script>

<template>
  <div class="header-item">
    <div class="header-item__item">
      <NuxtLink
        v-if="node?.url && !hasChildren"
        :to="node?.url"
        :target="node?.url_options?.attributes?.target"
        class="header-item__link header-item__link--link"
        :aria-label="'Visit ' + node?.title"
        @click="closeMobileDrawer()"
      >
        {{ node?.title }}
      </NuxtLink>

      <button
        v-else-if="hasChildren"
        class="header-item__trigger"
        :class="{ 'is-active': isActiveDrawerItem }"
        type="button"
        @click="handleClick"
        :aria-label="node?.title + ' - Open submenu'"
      >
        <span
          class="header-item__link"
          :class="{ 'is-active': isActiveDrawerItem }"
        >
          {{ node?.title }}
        </span>
        <NuxtIcon
          class="button__icon-after"
          :class="{ 'button__icon-after--rotated': isActiveDrawerItem }"
          name="chevron-down"
          fill
        />
      </button>

      <span
        v-else
        class="header-item__link"
        :aria-label="node?.title"
        @click="closeDrawer"
      >
        {{ node?.title }}
      </span>
    </div>

    <Transition name="accordion">
      <div
        v-if="hasChildren && isActiveDrawerItem"
        class="header-item__children header-item__children--active"
      >
        <MobileHeaderItem
          v-for="(child, i) in node?.below"
          :key="i"
          :node="child"
          class="header-item__child"
          @closeMobileDrawer="closeMobileDrawer"
        />
      </div>
    </Transition>
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
    display: flex;
    justify-content: center;
  }

  &__link,
  &__link--link {
    position: relative;
    display: inline-block;
    padding-bottom: 2px;
    line-height: 1.2;
    color: var(--color-text);
    text-decoration: none;
    font-size: 16px;
    transition: color 0.2s;
    white-space: nowrap;
  }

  &__link::after,
  &__link--link::after {
    content: '';
    position: absolute;
    left: 0;
    width: 100%;
    bottom: 0;
    height: 1px;
    background-color: var(--color-primary);
    transform: scaleX(0);
    transform-origin: left;
    transition: all 0.3s ease;
    display: block;
    box-sizing: border-box;
  }

  /* Active state */
  &__link.is-active::after,
  &__link--link.is-active::after,
  .router-link-exact-active.header-item__link::after,
  .router-link-exact-active.header-item__link--link::after {
    transform: scaleX(1);
  }

  &__trigger {
    position: relative;
    padding-right: 22px;
    padding-left: 0;
    color: var(--color-text);
    font-size: 16px;
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: border-color 0.3s ease;

    .nuxt-icon {
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      transition: transform 0.3s ease;
    }
  }

  &__children {
    max-height: 0;
    opacity: 0;
    overflow: hidden;
    transition:
      max-height 0.4s ease,
      opacity 0.4s ease;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding-left: 16px;
  }

  &__children--active {
    max-height: 1000px;
    opacity: 1;
  }

  &__child {
    margin-bottom: 8px;

    &:first-child {
      padding-top: 5px;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.button__icon-after--rotated {
  transform: translateY(-50%) rotate(180deg) !important;
  transition: transform 0.3s ease;
}

.accordion-enter-from,
.accordion-leave-to {
  max-height: 0;
  opacity: 0;
}

.accordion-enter-active,
.accordion-leave-active {
  transition:
    max-height 0.3s ease,
    opacity 0.3s ease;
}

.accordion-enter-to,
.accordion-leave-from {
  max-height: 1000px;
  opacity: 1;
}
</style>
