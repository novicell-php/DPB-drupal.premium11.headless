<script setup>
import { createFocusTrap } from 'focus-trap';

const mobileDrawerRef = ref(null);
let mobileFocusTrapInstance = null;

let focusTrapInstance = null;

const props = defineProps({
  data: {
    type: Object,
    required: false,
  },
});

const mobileMenuOpen = ref(false);
const bottomDrawerOpen = ref(false);
const activeDrawerItems = ref([]);
const drawerRef = ref(null);
let lastTriggerEl = null;

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;

  if (mobileMenuOpen.value) {
    document.body.classList.add('no-scroll');
    nextTick(() => {
      mobileFocusTrapInstance = createFocusTrap(mobileDrawerRef.value, {
        escapeDeactivates: true,
        allowOutsideClick: true,
        fallbackFocus: mobileDrawerRef.value,
        onDeactivate: () => {
          mobileMenuOpen.value = false;
          document.body.classList.remove('no-scroll');
        },
      });
      mobileFocusTrapInstance.activate();
    });
  } else {
    document.body.classList.remove('no-scroll');
    mobileFocusTrapInstance?.deactivate();
    closeBottomDrawer();
  }
};

const currentDrawerKey = ref(null);

const openBottomDrawer = (items, event) => {
  activeDrawerItems.value = items;
  bottomDrawerOpen.value = true;
  lastTriggerEl = event?.currentTarget || null;
  nextTick(() => {
    focusTrapInstance = createFocusTrap(drawerRef.value, {
      escapeDeactivates: true,
      allowOutsideClick: true,
      fallbackFocus: drawerRef.value,
      onDeactivate: () => {
        bottomDrawerOpen.value = false;
        activeDrawerItems.value = [];
        currentDrawerKey.value = null;
        lastTriggerEl?.focus();
      },
    });
    focusTrapInstance.activate();
  });
};

const closeBottomDrawer = () => {
  focusTrapInstance?.deactivate();
  activeDrawerItems.value = [];
  currentDrawerKey.value = null;
};

provide('bottomDrawer', {
  openBottomDrawer,
  closeBottomDrawer,
  bottomDrawerOpen: readonly(bottomDrawerOpen),
});
provide('currentDrawerKey', currentDrawerKey);

const showHeader = ref(true);
const lastScrollY = ref(0);
const threshold = 10;

const handleScroll = () => {
  if (bottomDrawerOpen.value || mobileMenuOpen.value) {
    return;
  }
  const currentScrollY = window.scrollY;

  if (currentScrollY <= 0) {
    showHeader.value = true;
  } else if (currentScrollY - lastScrollY.value > threshold) {
    showHeader.value = false;
  } else if (lastScrollY.value - currentScrollY > threshold) {
    showHeader.value = true;
  }

  lastScrollY.value = currentScrollY;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
  document.body.classList.remove('no-scroll');
  closeBottomDrawer();
  mobileFocusTrapInstance?.deactivate();
};
</script>

<template>
  <div class="navigation-wrapper">
    <div
      class="header__wrapper"
      :class="{ 'header__wrapper--hidden': !showHeader }"
      role="banner"
      v-if="data"
    >
      <div class="header">
        <div class="header__content">
          <NuxtLink to="/" aria-label="Frontpage" class="header__logo-link">
            <BaseLogo class="header__logo" />
          </NuxtLink>

          <!-- Hamburger menu -->
          <button
            class="header__mobile-toggle"
            aria-label="Toggle navigation menu"
            @click="toggleMobileMenu"
            :aria-expanded="mobileMenuOpen.toString()"
          >
            <span class="hamburger"></span>
          </button>

          <div
            v-if="mobileMenuOpen"
            class="header__overlay"
            @click="closeMobileMenu"
          ></div>

          <navigation
            class="header__nav"
            role="navigation"
            aria-label="Hovednavigation"
          >
            <HeaderItem
              v-for="(item, index) in data?.items || []"
              :key="index"
              :node="item"
              class="header__nav-item header__nav-item--desktop"
            >
              {{ item?.title }}
            </HeaderItem>
          </navigation>

          <navigation
            v-if="mobileMenuOpen"
            class="header__nav"
            :class="{ 'header__nav--open': mobileMenuOpen }"
            role="navigation"
            aria-label="Hovednavigation"
            ref="mobileDrawerRef"
          >
            <MobileHeaderItem
              v-for="(item, index) in data?.items || []"
              :key="index"
              :node="item"
              class="header__nav-item header__nav-item--mobile"
              @close-mobile-drawer="closeMobileMenu()"
            >
              {{ item?.title }}
            </MobileHeaderItem>
          </navigation>
        </div>
      </div>
    </div>

    <!-- Desktop Nav Drawer -->
    <Teleport to="body">
      <Transition name="bottom-drawer">
        <div
          v-if="bottomDrawerOpen"
          class="bottom-drawer"
          role="dialog"
          aria-modal="true"
          tabindex="-1"
          :aria-hidden="bottomDrawerOpen ? 'false' : 'true'"
          ref="drawerRef"
        >
          <div class="bottom-drawer__content">
            <div class="bottom-drawer__items">
              <NuxtLink
                v-for="item in activeDrawerItems"
                :key="item.id"
                :to="item.url"
                :target="item?.url_options?.attributes?.target"
                class="bottom-drawer__item"
                @click="closeBottomDrawer()"
              >
                {{ item.title }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style lang="postcss" scoped>
.router-link-exact-active,
.router-link-active {
  position: relative;
}

.router-link-exact-active::after,
.router-link-active::after {
  content: '';
  position: absolute;
  left: 0;
  width: 100%;
  bottom: 0;
  height: 1px;
  background-color: var(--color-text);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
  display: block;
  box-sizing: border-box;
}

.router-link-exact-active::after,
.router-link-active::after {
  transform: scaleX(1);
}

.navigation-wrapper {
  position: relative;
}

.header {
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 20px;

  &__wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: var(--header-height);
    background: var(--color-white);
    box-shadow: 0 2px 6px var(--header-shadow);
    padding: 15px 0;
    z-index: 1000;
    transition: transform 0.3s ease;

    &--hidden {
      transform: translateY(-100%);
    }
  }

  &__logo {
    width: 120px;
    height: auto;
  }

  &__logo-link {
    display: flex;
    align-items: center;

    &::after {
      display: none;
    }
  }

  &__nav {
    display: flex;
    gap: 24px;
    align-items: center;
  }

  &__nav-item {
    cursor: pointer;
    font-weight: 500;
    color: var(--color-gray-900);
    transition: color 0.3s ease;
    white-space: nowrap;

    &:hover {
      opacity: 0.7;
    }

    &--mobile {
      display: none;
    }
    &--desktop {
      display: block;
    }

    @media (--viewport-sm-max) {
      &--desktop {
        display: none;
      }
      &--mobile {
        display: block;
      }
    }
  }

  &__content {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;
  }

  &__mobile-toggle {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    margin-left: 12px;
    position: relative;
    z-index: 1100;
  }
}

/* Mobile Hamburger */
.hamburger,
.hamburger::before,
.hamburger::after {
  width: 24px;
  height: 2px;
  background-color: var(--color-primary);
  display: block;
  position: relative;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.hamburger::before,
.hamburger::after {
  content: '';
  position: absolute;
  left: 0;
}

.hamburger::before {
  top: -8px;
}

.hamburger::after {
  top: 8px;
}

/* Toggle hamburger to "X" when open */
.header__mobile-toggle[aria-expanded='true'] .hamburger {
  background-color: transparent;
}

.header__mobile-toggle[aria-expanded='true'] .hamburger::before {
  transform: rotate(45deg);
  top: 0;
}

.header__mobile-toggle[aria-expanded='true'] .hamburger::after {
  transform: rotate(-45deg);
  top: 0;
}

/* Bottom Drawer Styles */
.bottom-drawer {
  position: fixed;
  left: 0;
  width: 100vw;
  background: var(--color-white);
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1);
  z-index: 999;
  top: var(--header-height);

  &--mobile-menu-open {
    top: var(--header-height);
  }

  &__content {
    padding: 24px 0;
    max-width: 1200px;
    margin: 0 auto;
  }

  &__items {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 32px;
    flex-wrap: wrap;
  }

  &__item {
    text-decoration: none;
    font-size: 16px;
    font-weight: 500;
    transition: all 0.2s ease;
    white-space: nowrap;
    color: var(--color-text);

    &:hover {
      opacity: 0.7;
    }
  }
}

/* Bottom Drawer Transitions */
.bottom-drawer-enter-active,
.bottom-drawer-leave-active {
  transition: all 0.3s ease;
}

.bottom-drawer-enter-from,
.bottom-drawer-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}

@media (--viewport-sm-max) {
  .header__overlay {
    position: fixed;
    top: var(--header-height);
    left: 0;
    width: 100vw;
    height: calc(100vh - var(--header-height));
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 998;
  }
}

@media (--viewport-sm-max) {
  .header__nav {
    z-index: 999;
    position: fixed;
    top: var(--header-height);
    right: 0;
    background: var(--color-white);
    height: calc(100vh - var(--header-height));
    width: 250px;
    flex-direction: column;
    padding: 20px;
    box-shadow: -2px 0 8px var(--header-shadow);
    transform: translateX(100%);
    transition:
      transform 0.3s ease,
      top 0.3s ease,
      height 0.3s ease;

    &--open {
      transform: translateX(0);
      text-align: left;
      align-items: flex-start;
    }
  }

  .header__wrapper--hidden .header__nav--open {
    height: 100vh;
  }

  .header__nav .header__nav-item {
    padding: 6px 0;
    font-size: 16px;
  }

  .header__mobile-toggle {
    display: block;
  }

  .bottom-drawer {
    display: none;
  }
}
</style>
