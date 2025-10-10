<script setup>
const props = defineProps({
  node: { type: Object, required: true },
  isTopLevel: { type: Boolean, default: false },
  expandActivePath: { type: Boolean, default: false },
});

const isOpen = ref(false);
let closeTimeout, enterTimeout;
const hasChildren = computed(
  () => Array.isArray(props.node?.below) && props.node.below.length > 0,
);
const route = useRoute();

const nodeId = computed(() => {
  if (props.node.url) {
    return 'header-node-' + props.node.url.replace(/\W+/g, '-');
  }
  // fallback to title if no URL
  return 'header-node-' + props.node.title.replace(/\W+/g, '-');
});

const isActive = computed(() => {
  const currentPath = route.path;
  const currentNodePath =
    typeof props.node.url === 'string'
      ? props.node.url
      : props.node.url?.path || props.node.url?.to || '';

  const hasActiveDescendant = (node) => {
    if (!node) return false;

    const nodePath =
      typeof node.url === 'string'
        ? node.url
        : node.url?.path || node.url?.to || '';

    // Check if this node itself is the active page
    if (nodePath && nodePath === currentPath) {
      return true;
    }

    // Check if any child is active
    if (Array.isArray(node.below)) {
      return node.below.some((child) => hasActiveDescendant(child));
    }

    return false;
  };

  if (currentNodePath) {
    return currentNodePath === currentPath;
  }

  return hasActiveDescendant(props.node);
});

const activePathMap = computed(() => {
  const map = new Set();
  const currentPath = route.path;

  const traverse = (node, ancestors = []) => {
    const nodePath =
      typeof node.url === 'string'
        ? node.url
        : node.url?.path || node.url?.to || '';
    if (nodePath === currentPath) {
      // add all ancestors to the map (these should auto-expand)
      ancestors.forEach((id) => map.add(id));
    }
    if (Array.isArray(node.below)) {
      node.below.forEach((child) => traverse(child, [...ancestors, node.id]));
    }
  };

  traverse(props.node);
  return map;
});

const isOpenComputed = computed(() => {
  const shouldAutoExpand =
    props.expandActivePath && activePathMap.value.has(props.node.id);
  return isOpen.value || shouldAutoExpand;
});

const openMenu = () => {
  clearTimeout(closeTimeout);
  clearTimeout(enterTimeout);
  isOpen.value = true;
};

const openMenuWithDelay = () => {
  clearTimeout(closeTimeout);
  enterTimeout = setTimeout(() => (isOpen.value = true), 200);
};

const closeMenuWithDelay = () => {
  clearTimeout(closeTimeout);
  closeTimeout = setTimeout(() => {
    isOpen.value = false;
  }, 400);
};

const cancelClose = () => {
  clearTimeout(closeTimeout);
  clearTimeout(enterTimeout);
};

const immediateClose = (event) => {
  clearTimeout(closeTimeout);
  clearTimeout(enterTimeout);
  isOpen.value = false;

  // Return focus to button if triggered via keyboard
  const button = event?.currentTarget
    ?.closest('.header-item')
    ?.querySelector('.header-item__button');
  if (button) button.focus();
};

const handleButtonClick = (event) => {
  event.preventDefault();
};

// Close submenu on route change
const router = useRouter();
router.afterEach(() => {
  nextTick(() => {
    isOpen.value = false;
  });
});
</script>

<template>
  <li
    class="header-item"
    :class="{ 'header-item--top': isTopLevel }"
    @mouseenter="openMenuWithDelay"
    @mouseleave="closeMenuWithDelay"
    @focusin="openMenu"
    @focusout="closeMenuWithDelay"
    @keydown.esc.prevent="immediateClose"
  >
    <div class="header-item__wrapper" :class="{ 'is-active': isActive }">
      <NuxtLink
        v-if="node?.url"
        :to="node.url"
        :target="node?.url_options?.attributes?.target"
        class="header-item__link"
      >
        <span class="header-item__text">{{ node.title }}</span>
      </NuxtLink>

      <span
        v-if="hasChildren"
        class="header-item__button"
        :class="{ 'header-item__button--with-link': node?.url }"
        type="button"
        role="button"
        tabindex="0"
        aria-haspopup="true"
        :aria-expanded="isOpen.toString()"
        :aria-controls="'submenu-' + nodeId"
        @click="handleButtonClick"
        @mouseenter="openMenu"
        @focus="openMenu"
        @blur="closeMenuWithDelay"
        @keydown.enter.prevent="openMenu"
        @keydown.space.prevent="openMenu"
        @keydown.esc.prevent="immediateClose"
      >
        <span v-if="!node?.url" class="header-item__link">
          <span class="header-item__text">{{ node.title }}</span>
        </span>

        <NuxtIcon
          v-if="!isTopLevel"
          class="header-item__icon header-item__icon--rotated-right"
          name="chevron-down"
          fill
        />
      </span>
    </div>

    <Transition name="submenu-fade">
      <ul
        v-if="hasChildren"
        v-show="isOpenComputed"
        class="header-item__submenu"
        :class="{ 'header-item__submenu--nested': !isTopLevel }"
        @mouseenter="cancelClose"
        @mouseleave="closeMenuWithDelay"
        role="menu"
        :id="'submenu-' + nodeId"
      >
        <li
          v-for="child in node.below"
          :key="child.id"
          class="header-item__submenu-item"
          role="menuitem"
        >
          <HeaderItem
            :node="child"
            :is-top-level="false"
            :expand-active-path="isOpenComputed"
          />
        </li>
      </ul>
    </Transition>
  </li>
</template>

<style lang="postcss" scoped>
.header-item {
  position: relative;

  &--top .header-item__link {
    color: var(--color-black);
    font-size: 17px;

    &:hover,
    &:focus {
      color: var(--color-primary);

      .header-item__text::after {
        transform: scaleX(1);
        background-color: var(--color-primary);
      }
    }
  }

  &__wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
  }

  &__link {
    position: relative;
    display: block;
    width: 100%;
    padding: 10px 12px 10px 24px;
    line-height: 1.2;
    color: var(--color-gray);
    text-decoration: none;
    font-size: 16px;
    white-space: nowrap;
    transition:
      color 0.2s,
      transform 0.2s ease-in;
  }

  &__button {
    position: relative;
    display: flex;
    align-items: center;
    width: auto;
    padding: 0;
    color: var(--color-text);
    font-size: 16px;
    background: none;
    border: none;
    cursor: pointer;
    transition:
      border-color 0.3s ease,
      transform 0.2s ease-in;
    padding: 10px 17px 10px 0;
    width: 100%;

    /* invisible area to make hovering easier */
    &::before {
      content: '';
      position: absolute;
      top: -5px;
      bottom: -5px;
      left: -5px;
      right: -5px;
      background: transparent;
      z-index: -1;
    }

    &:focus:not(:focus-visible) {
      outline: none;
    }
  }

  &__icon {
    margin-left: 5px;
    transition: transform 0.3s ease;
    padding: 0;

    &--rotated-right {
      transform: rotate(270deg);
    }
  }

  &__text {
    position: relative;
    display: inline-block;
    transition:
      transform 0.3s ease,
      color 0.2s ease;

    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 1px;
      background-color: var(--color-gray);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.3s ease;
    }
  }

  /* Active state - primary color for top level */
  &__wrapper.is-active &__text::after,
  .router-link-exact-active &__text::after {
    transform: scaleX(1);
    background-color: var(--color-primary);
  }

  /* Active state - color text for top level */
  .header-item__wrapper.is-active .header-item__text,
  .router-link-exact-active .header-item__text {
    color: var(--color-primary);
  }

  &__submenu-item {
    position: relative;
  }

  &__submenu {
    position: absolute;
    top: 100%;
    left: 0;
    min-width: 225px;
    margin-top: 0;
    padding: 10px 0;
    background: var(--color-black);
    list-style: none;
    overflow: visible;
    z-index: 2000;

    :deep(span) {
      font-size: 15px !important;
    }

    :deep(.header-item__button) {
      justify-content: flex-end;
      text-align: left;
      width: 100%;
      padding-left: 24px;
    }

    :deep(.header-item__button .header-item__link) {
      text-align: left;
      justify-content: flex-start;
      padding: 0;
    }

    /* For nested submenus (3rd level and deeper) - show to the side */
    &--nested {
      top: 0;
      left: 100%;
      margin-left: 8px;
      overflow: hidden;
    }

    /* Override text color for submenu items */
    :deep(*) {
      color: var(--color-gray) !important;
    }

    /* Active state in submenu - underline and translate */
    :deep(.is-active) .header-item__text,
    :deep(.router-link-exact-active.header-item__text) {
      transform: translateX(10px);
    }

    /*  submenu is active item */
    :deep(.header-item__wrapper.is-active) .header-item__text::after,
    :deep(.header-item__link.router-link-exact-active)
      .header-item__text::after,
    :deep(.header-item__link.router-link-active) .header-item__text::after {
      transform: scaleX(1);
      background-color: var(--color-gray);
    }

    /* Hover state in submenu - only translate the text/link part */
    /* Only move text on hover if it’s not already active */
    :deep(.header-item__wrapper:not(.is-active):hover) .header-item__text,
    :deep(.header-item__wrapper:not(.is-active):focus-within)
      .header-item__text {
      transform: translateX(10px);
    }

    :deep(.header-item__wrapper:hover) .header-item__text::after,
    :deep(.header-item__wrapper:focus-within) .header-item__text::after {
      transform: scaleX(1);
      background-color: var(--color-gray);
    }
  }

  /* Add a small gap bridge between parent and submenu */
  &:hover .header-item__submenu,
  &:focus-within .header-item__submenu {
    pointer-events: auto;
  }
}

.header-item:has(.header-item__submenu) {
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    height: 10px;
    background: transparent;
    z-index: 1999;
  }
}

.header-item__submenu--nested {
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -10px;
    width: 10px;
    bottom: 0;
    background: transparent;
  }
}

.header-item__submenu--nested {
  transition-delay: 0.15s;
}
</style>
