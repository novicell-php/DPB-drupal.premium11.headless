<script setup>
import { createFocusTrap } from 'focus-trap';

const props = defineProps({
  data: {
    type: Object,
    required: false,
  },
});

// TODO:
// Mobile:
// Create MobileHeaderItem component for mobile menu items
// Add focus trap to mobile menu
// Disable / Enable scrolling when mobile menu is open/closed
// Animate mobile menu opening/closing (opening - coming up from the top)
// Close mobile menu on navigation
// Accessibility: aria-expanded, aria-controls, aria-hidden

const mobileMenuOpen = ref(false);
const mobileMenuRef = ref(null);
let mobileFocusTrapInstance = null;
let focusTrapInstance = null;

const showHeader = ref(true);
const lastScrollY = ref(0);
const threshold = 10;
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;

  if (mobileMenuOpen.value) {
    document.body.classList.add('no-scroll');
  } else {
    document.body.classList.remove('no-scroll');
  }

  // if (mobileMenuOpen.value) {
  //   document.body.classList.add('no-scroll');
  //   nextTick(() => {
  //     mobileFocusTrapInstance = createFocusTrap(mobileMenuRef.value, {
  //       escapeDeactivates: true,
  //       allowOutsideClick: true,
  //       fallbackFocus: mobileMenuRef.value,
  //       onDeactivate: () => {
  //         mobileMenuOpen.value = false;
  //         document.body.classList.remove('no-scroll');
  //       },
  //     });
  //     mobileFocusTrapInstance.activate();
  //   });
  // } else {
  //   document.body.classList.remove('no-scroll');
  //   mobileFocusTrapInstance?.deactivate();
  //   closeBottomDrawer();
  // }
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

// const closeMobileMenu = () => {
//   mobileMenuOpen.value = false;
//   document.body.classList.remove('no-scroll');
//   closeBottomDrawer();
//   mobileFocusTrapInstance?.deactivate();
// };

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
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

        <!-- Hamburger menu -->
        <button
          class="header__mobile-toggler"
          aria-label="Toggle navigation menu"
          @click="toggleMobileMenu"
          :aria-expanded="mobileMenuOpen.toString()"
          :aria-controls="'mobile-menu'"
          :class="{ 'is-active': mobileMenuOpen }"
        >
          <span class="hamburger"></span>
        </button>

        <!-- Desktop menu -->
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

        <!-- Mobile menu -->
        <navigation
          v-show="mobileMenuOpen"
          class="header__nav header__nav--mobile"
          aria-label="Hovednavigation"
        >
          <h2>mobile menu open</h2>
          <!-- <MobileHeaderItem
              v-for="(item, index) in data?.items || []"
              :key="index"
              :node="item"
              class="header__nav-item header__nav-item--mobile"
              @close-mobile-drawer="closeMobileMenu()"
            >
              {{ item?.title }}
            </MobileHeaderItem> -->
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
      height: 100vh;
      left: 0;
      width: 100%;
      background: #656565;
      flex-direction: column;
      padding: 20px;
    }
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
</style>
