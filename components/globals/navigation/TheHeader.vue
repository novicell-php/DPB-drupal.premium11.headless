<script setup>
import { ref } from 'vue';

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
</script>

<template>
  <header class="header__wrapper" role="banner" v-if="data">
    <div class="header">
      <div class="header__content">
        <NuxtLink to="/" aria-label="Gå til forsiden" class="header__logo-link">
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
  </header>
</template>

<style lang="postcss" scoped>
.header__wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: var(--header-height);
  background: var(--color-white);
  box-shadow: 0 2px 6px var(--header-shadow);
  padding: 15px 0;
  z-index: 1000;
}

.header {
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.header__content {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
}

.header__logo-link {
  display: flex;
  align-items: center;
}

.header__logo {
  width: 120px;
  height: auto;
}

.header__nav {
  display: flex;
  gap: 24px;
}

.header__nav-item {
  cursor: pointer;
  font-weight: 500;
  color: var(--color-gray-900);
  transition: color 0.3s ease;

  &:hover {
    opacity: 0.7;
  }
}

/* Mobile styles */
.header__mobile-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  margin-left: 12px;
  position: relative;
  z-index: 1100;
}

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
    transition: transform 0.3s ease;
  }

  .header__nav--open {
    transform: translateX(0);
  }

  .header__nav-item {
    padding: 12px 0;
    font-size: 1.1rem;
  }

  .header__mobile-toggle {
    display: block;
  }
}
</style>
