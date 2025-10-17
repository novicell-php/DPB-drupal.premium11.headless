<script setup>
const props = defineProps({
  node: { type: Object, required: true },
  level: { type: Number, default: 0 },
});

const route = useRoute();
const emit = defineEmits(['close-menu']);
const submenuRef = ref(null);
const isOpen = ref(false);

const hasChildren = computed(
  () => Array.isArray(props.node?.below) && props.node.below.length > 0,
);

const nodeId = computed(() => {
  if (props.node.url) {
    return 'mobile-node-' + props.node.url.replace(/\W+/g, '-');
  }
  return 'mobile-node-' + props.node.title.replace(/\W+/g, '-');
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

    if (nodePath && nodePath === currentPath) {
      return true;
    }

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

const toggleMenu = () => {
  if (hasChildren.value) {
    isOpen.value = !isOpen.value;
  }
};

const handleLinkClick = () => {
  isOpen.value = false;
  emit('close-menu');
};

// Close all nested menus on route change
const router = useRouter();
router.afterEach(() => {
  nextTick(() => {
    isOpen.value = false;
    emit('close-menu');
  });
});

// Dynamic height transitions
const enterSubmenu = (el) => {
  el.style.maxHeight = '0';
  el.style.opacity = '0';
  el.style.transform = 'scaleY(0.92) translateY(-10px)';
  nextTick(() => {
    el.style.transition =
      'max-height 0.6s cubic-bezier(0.25, 1.2, 0.5, 1), transform 0.5s cubic-bezier(0.25, 1.2, 0.5, 1), opacity 0.45s ease-out';
    el.style.maxHeight = el.scrollHeight + 'px';
    el.style.opacity = '1';
    el.style.transform = 'scaleY(1) translateY(0)';
  });
};

const leaveSubmenu = (el) => {
  el.style.maxHeight = el.scrollHeight + 'px';
  nextTick(() => {
    el.style.transition =
      'max-height 0.6s cubic-bezier(0.25, 1.2, 0.5, 1), transform 0.5s cubic-bezier(0.25, 1.2, 0.5, 1), opacity 0.45s ease-out';
    el.style.maxHeight = '0';
    el.style.opacity = '0';
    el.style.transform = 'scaleY(0.92) translateY(-10px)';
  });
};
</script>

<template>
  <div class="mobile-nav-item" :class="`mobile-nav-item--level-${level}`">
    <div class="mobile-nav-item__wrapper" :class="{ 'is-active': isActive }">
      <!-- Link only (no children) -->
      <NuxtLink
        v-if="node?.url && !hasChildren"
        :to="node.url"
        :target="node?.url_options?.attributes?.target"
        class="mobile-nav-item__link"
        @click="handleLinkClick"
      >
        <span class="mobile-nav-item__text">{{ node.title }}</span>
      </NuxtLink>

      <!-- Button with optional link (has children) -->
      <button
        v-else
        class="mobile-nav-item__button"
        type="button"
        :aria-expanded="isOpen.toString()"
        :aria-controls="hasChildren ? 'submenu-' + nodeId : undefined"
        @click="toggleMenu"
      >
        <span class="mobile-nav-item__content">
          <NuxtLink
            v-if="node?.url"
            :to="node.url"
            :target="node?.url_options?.attributes?.target"
            class="mobile-nav-item__link-text"
            @click.stop="handleLinkClick"
          >
            <span class="mobile-nav-item__text">{{ node.title }}</span>
          </NuxtLink>

          <span v-else class="mobile-nav-item__text">{{ node.title }}</span>
        </span>

        <NuxtIcon
          v-if="hasChildren"
          name="chevron-down"
          class="mobile-nav-item__icon"
          :class="{
            'mobile-nav-item__icon--open': isOpen,
            'mobile-nav-item__icon--inline': level > 0,
          }"
        />
      </button>
    </div>

    <!--  submenu with dynamic height -->
    <Transition @enter="enterSubmenu" @leave="leaveSubmenu" css>
      <div
        v-if="hasChildren && isOpen"
        ref="submenuRef"
        class="mobile-nav-item__submenu"
        :id="'submenu-' + nodeId"
      >
        <div class="mobile-nav-item__submenu-scroll">
          <MobileHeaderItem
            v-for="child in node.below"
            :key="child.id"
            :node="child"
            :level="level + 1"
            @close-menu="emit('close-menu')"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style lang="postcss" scoped>
.mobile-nav-item {
  width: 100%;
  flex-shrink: 0;

  &__wrapper {
    position: relative;
    width: 100%;
  }

  &__link,
  &__button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 16px 20px;
    text-align: center;
    text-decoration: none;
    color: var(--color-white);
    opacity: 0.6;
    font-size: 25px;
    line-height: 1.3;
    background: none;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s ease;
    position: relative;
  }

  &__button {
    padding-left: 40px;
    padding-right: 40px;
  }

  &__content {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__link-text {
    text-decoration: none;
    color: inherit;
  }

  &__text {
    font-weight: 500;
    transition: color 0.2s ease;
  }

  &__wrapper.is-active &__text,
  .router-link-exact-active &__text {
    color: var(--color-white);
    opacity: 1 !important;
  }

  &__wrapper.is-active &__link,
  .router-link-exact-active &__link,
  &__wrapper.is-active &__button,
  .router-link-exact-active &__button {
    opacity: 1;
  }

  &__icon {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    transition: transform 0.3s ease;
    font-size: 20px;
    flex-shrink: 0;

    &--open {
      transform: translateY(-50%) rotate(180deg);
    }
  }

  &__icon--inline {
    position: static;
    margin-left: 15px;
    display: inline-flex;
    vertical-align: middle;
    width: 16px;
    height: 16px;
    transition: transform 0.3s ease;
    transform: translateY(-2px);
  }

  &__icon--inline.mobile-nav-item__icon--open {
    transform: rotate(180deg);
  }

  &__submenu {
    background-color: #313131;
    overflow: hidden;
  }

  /* Scrollable container inside submenu */
  &__submenu-scroll {
    max-height: 60vh;
    overflow-y: auto;
    padding-right: 4px;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
  }

  &__submenu-scroll::-webkit-scrollbar {
    width: 6px;
  }

  &__submenu-scroll::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }

  &--level-1 {
    .mobile-nav-item__link,
    .mobile-nav-item__button {
      justify-content: center;
      font-size: 19px;
    }
  }

  &--level-2 {
    .mobile-nav-item__link,
    .mobile-nav-item__button {
      justify-content: center;
      font-size: 17px;
    }
  }

  &--level-3 {
    .mobile-nav-item__link,
    .mobile-nav-item__button {
      justify-content: center;
      font-size: 16px;
    }
  }
}

/* Nested levels: align text + arrow inline */
.mobile-nav-item--level-1 .mobile-nav-item__content,
.mobile-nav-item--level-2 .mobile-nav-item__content,
.mobile-nav-item--level-3 .mobile-nav-item__content {
  flex: unset; /* remove flex-grow */
  justify-content: flex-start; /* align text and inline arrow from left */
}
</style>
