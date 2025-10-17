<script setup>
import { createFocusTrap } from 'focus-trap';

const props = defineProps({
  data: {
    type: Object,
    required: false,
  },
});

const mobileMenuOpen = ref(false);
const mobileMenuRef = ref(null);
const mobileMenuWrapperRef = ref(null);
let mobileFocusTrapInstance = null;
const showHeader = ref(true);
const lastScrollY = ref(0);
const threshold = 10;

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
  document.body.classList.remove('no-scroll');

  if (mobileFocusTrapInstance) {
    mobileFocusTrapInstance.deactivate();
    mobileFocusTrapInstance = null;
  }
};

const openMobileMenu = () => {
  mobileMenuOpen.value = true;
  document.body.classList.add('no-scroll');

  nextTick(() => {
    if (mobileMenuWrapperRef.value) {
      mobileFocusTrapInstance = createFocusTrap(mobileMenuWrapperRef.value, {
        escapeDeactivates: true,
        clickOutsideDeactivates: true,
        allowOutsideClick: true,
        initialFocus:
          mobileMenuWrapperRef.value.querySelector(
            'a, button, [tabindex]:not([tabindex="-1"])',
          ) || mobileMenuWrapperRef.value,
        onDeactivate: () => {
          const toggler = document.querySelector('.header__mobile-toggler');
          if (toggler) toggler.focus();
        },
      });
      mobileFocusTrapInstance.activate();
    }
  });
};

const toggleMobileMenu = () => {
  if (mobileMenuOpen.value) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
};

const handleScroll = () => {
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
  // Cleanup on unmount
  if (mobileFocusTrapInstance) {
    mobileFocusTrapInstance.deactivate();
    mobileFocusTrapInstance = null;
  }
  document.body.classList.remove('no-scroll');
});
</script>

<template>
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

        <!-- Hamburger toggler (outside trap, focus returns here after close) -->
        <button
          class="header__mobile-toggler"
          aria-label="Toggle navigation menu"
          aria-controls="mobile-menu"
          :aria-expanded="mobileMenuOpen.toString()"
          :aria-haspopup="true"
          :aria-pressed="mobileMenuOpen.toString()"
          @click="toggleMobileMenu"
          :class="{
            'is-active': mobileMenuOpen,
          }"
        >
          <span
            class="hamburger"
            :class="{ 'header__mobile-toggler--active': mobileMenuOpen }"
            aria-hidden="true"
          ></span>
        </button>

        <!-- Mobile menu -->
        <Transition name="mobile-menu-slide-right">
          <navigation
            v-show="mobileMenuOpen"
            class="header__nav header__nav--mobile"
            aria-label="Hovednavigation"
            id="mobile-menu"
            ref="mobileMenuRef"
            role="dialog"
            :aria-hidden="(!mobileMenuOpen).toString()"
          >
            <div
              ref="mobileMenuWrapperRef"
              class="header__mobile-focus-wrapper"
            >
              <div class="header__mobile-header">
                <BaseLogo class="header__logo header__logo--mobile" />
                <button
                  class="header__mobile-close"
                  aria-label="Close navigation menu"
                  @click="closeMobileMenu"
                >
                  ✕
                </button>
              </div>

              <div class="header__nav-items-wrapper">
                <MobileHeaderItem
                  v-for="(item, index) in data?.items || []"
                  :key="index"
                  :node="item"
                  class="header__nav-item header__nav-item--mobile"
                  @close-menu="closeMobileMenu"
                >
                  {{ item?.title }}
                </MobileHeaderItem>
              </div>
            </div>
          </navigation>
        </Transition>

        <!-- Desktop navigation -->
        <navigation
          class="header__nav header__nav--desktop"
          role="navigation"
          aria-label="Navigation menu"
        >
          <HeaderItem
            v-for="(item, index) in data?.items || []"
            :key="index"
            :node="item"
            :is-top-level="true"
            class="header__nav-item"
          >
            {{ item?.title }}
          </HeaderItem>
        </navigation>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
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
    transition:
      transform 0.3s ease,
      opacity 0.3s ease;

    &--hidden {
      transform: translateY(-100%);
    }
  }

  &__logo {
    width: 120px;
    height: auto;
  }

  &__nav {
    display: flex;
    align-items: center;

    &--mobile {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      height: 100vh;
      height: 100dvh;
      width: 100%;
      background: #313131;
      flex-direction: column;
      padding: 0;
      align-items: stretch;
      overflow-y: auto;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      display: flex;
    }
  }

  &__mobile-focus-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  &__mobile-header {
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    background: #313131;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 100;
    flex-shrink: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  &__mobile-close {
    background: none;
    border: none;
    color: var(--color-white);
    cursor: pointer;
    color: #313131;
  }

  &__nav-items-wrapper {
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    padding-bottom: 20px;
  }

  &__nav-item {
    cursor: pointer;
    white-space: nowrap;
    list-style: none;

    &--has-children {
      position: relative;
    }
  }

  &__content {
    display: flex;
    align-items: center;
    width: 100%;

    @media (--viewport-sm-max) {
      justify-content: space-between;
    }
  }

  &__mobile-toggler {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    position: relative;
    z-index: 1100;

    &--active {
      transform: translate(0, 7px);
    }
  }
}

/* Mobile Hamburger */
.hamburger,
.hamburger::before,
.hamburger::after {
  width: 24px;
  height: 2px;
  background-color: var(--color-black);
  display: block;
  position: relative;
  border-radius: 2px;
  transition: all 0.3s ease;
}

/* hamburger is active/open */
.header__mobile-toggler.is-active .hamburger,
.header__mobile-toggler.is-active .hamburger::before,
.header__mobile-toggler.is-active .hamburger::after {
  background-color: var(--color-white);
  margin-top: 2px;
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
.header__mobile-toggler[aria-expanded='true'] .hamburger {
  background-color: transparent;
}

.header__mobile-toggler[aria-expanded='true'] .hamburger::before {
  transform: rotate(45deg);
  top: 0;
}

.header__mobile-toggler[aria-expanded='true'] .hamburger::after {
  transform: rotate(-45deg);
  top: 0;
}

@media (--viewport-sm-max) {
  .header__nav--desktop {
    display: none;
  }

  .header__mobile-toggler {
    display: block;
  }
}

:global(body.no-scroll) {
  overflow: hidden;
  position: fixed;
  width: 100%;
  height: 100%;
  touch-action: none;
}
</style>
