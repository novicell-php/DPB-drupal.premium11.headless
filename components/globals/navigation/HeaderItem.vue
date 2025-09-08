<script setup>
const props = defineProps({
  node: {
    type: Object,
    required: false,
  },
});

const bottomDrawer = inject('bottomDrawer', null);
const currentDrawerKey = inject('currentDrawerKey', ref(null));

const hasChildren = computed(() => {
  const { below } = props.node || {};
  return below && below.length > 0;
});

const isActiveDrawerItem = computed(
  () => currentDrawerKey.value === props.node?.title,
);

const closeDrawer = () => {
  bottomDrawer.closeBottomDrawer();
  currentDrawerKey.value = null;
};

const handleClick = () => {
  if (!bottomDrawer || !props.node) return;

  const key = props.node.title;

  if (hasChildren.value) {
    if (currentDrawerKey.value === key) {
      closeDrawer();
    } else {
      bottomDrawer.openBottomDrawer(props.node.below);
      currentDrawerKey.value = key;
    }
  }
};

const removeNoScroll = () => {
  document.body.classList.remove('no-scroll');
  if (bottomDrawer) {
    bottomDrawer.closeBottomDrawer();
  }
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
        @click="removeNoScroll"
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

      <span v-if="node?.description" class="header-item__tooltip">
        {{ node?.description }}
      </span>
    </div>
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

    &:hover {
      .header-item__tooltip {
        visibility: visible;
        opacity: 1;
      }
    }
  }

  /* All links */
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
    transition: all 0.3s ease; /* change from transform only to all */
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

  &__tooltip {
    position: absolute;
    top: 50%;
    right: 20px;
    z-index: 1;
    display: none;
    padding: 5px 10px;
    background-color: var(--color-text);
    color: var(--color-white);
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

    &:hover {
      .header-item__link {
        color: var(--color-primary);
      }
    }
  }
}

/* Hide desktop dropdown on mobile */
@media (--viewport-sm-max) {
  .header-item__children {
    display: none;
  }
}

.button__icon-after--rotated {
  transform: translateY(-50%) rotate(180deg) !important;
  transition: transform 0.3s ease;
}
</style>
