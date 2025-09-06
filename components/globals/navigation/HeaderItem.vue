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
        class="header-item__link"
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
        <span class="header-item__link">
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
.router-link-exact-active {
  color: var(--color-primary);
  border-bottom: 2px solid var(--color-primary) !important;
}

.header-item {
  position: relative;

  &__item {
    position: relative;
    display: flex;
    align-items: center;
    font-size: 16px;

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
    border-bottom: 2px solid transparent;

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
    display: flex;
    align-items: center;
    transition: border-color 0.3s ease;
    border-bottom: 2px solid transparent;

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

.header-item__trigger.is-active {
  border-bottom: 2px solid var(--color-primary);
}
</style>
