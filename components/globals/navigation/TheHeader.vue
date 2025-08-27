<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: false,
  },
});

const mobileMenuOpen = ref(false);
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const showHeader = ref(true);
const lastScrollY = ref(0);
const threshold = 10;

const handleScroll = () => {
  const currentScrollY = window.scrollY;
  if (currentScrollY - lastScrollY.value > threshold) {
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
          class="header__mobile-toggle"
          aria-label="Toggle navigation menu"
          @click="toggleMobileMenu"
          :aria-expanded="mobileMenuOpen.toString()"
        >
          <span class="hamburger"></span>
        </button>

        <nav
          class="header__nav"
          :class="{ 'header__nav--open': mobileMenuOpen }"
          role="navigation"
          aria-label="Hovednavigation"
        >
          <HeaderItem
            v-for="(item, index) in data?.items || []"
            :key="index"
            :node="item"
            class="header__nav-item"
          >
            {{ item?.title }}
          </HeaderItem>
        </nav>
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
  }

  &__nav {
    display: flex;
    gap: 24px;
  }

  &__nav-item {
    cursor: pointer;
    font-weight: 500;
    color: var(--color-gray-900);
    transition: color 0.3s ease;

    &:hover {
      opacity: 0.7;
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

@media (--viewport-sm-max) {
  .header__nav {
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
    }
  }

  .header__wrapper--hidden .header__nav--open {
    height: 100vh;
  }

  .header__nav .header__nav-item {
    padding: 12px 0;
    font-size: 16px;
  }

  .header__mobile-toggle {
    display: block;
  }
}
</style>
