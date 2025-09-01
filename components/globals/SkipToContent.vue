<script setup>
import { scrollTo } from '~/utils/scrollTo';

function focusMain() {
  const main = document.getElementById('main');
  if (main) {
    scrollTo('main');

    setTimeout(() => {
      main.focus();
    }, 600);
  }
}
</script>

<template>
  <div class="skip-to-content">
    <a
      href="#main"
      class="button skip-link visually-hidden"
      @click.prevent="focusMain"
      >Skip to content</a
    >
  </div>
</template>

<style lang="postcss" scoped>
.skip-to-content {
  padding: 20px 0 0 20px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 2000;
}

.skip-link {
  position: absolute;
  top: 0;
  left: 0;
  background-color: var(--color-black);
  color: var(--color-white);
  text-align: center;
  text-decoration: none;
}

.visually-hidden {
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}

.skip-link:focus {
  position: static;
  width: auto;
  height: auto;
  clip: auto;
  clip-path: none;
  margin: 0;
}
</style>
