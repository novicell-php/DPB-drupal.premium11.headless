<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div ref="header" class="header__wrapper">
    <div class="header">
      <div class="header__content">
        <NuxtLink to="/" aria-label="Gå til forsiden">
          <BaseLogo class="header__logo" />
        </NuxtLink>

        <nav class="header__right" v-if="data">
          <HeaderItem
            v-for="(item, index) in data.items"
            :key="index"
            :node="item"
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
  display: flex;
  align-items: center;
  width: 100%;
  height: 80px;
  background: var(--color-white);
  border-bottom: 1px solid var(--color-gray-11);
  transform: translateY(0%);
  transition:
    height 0.4s,
    transform 0.4s;
  will-change: height;

  &__wrapper {
    position: sticky;
    top: 0;
    z-index: 100;
    width: 100%;
    background: var(--color-white);
  }

  /* TODO: REDO */
  &__content {
    display: flex;
    align-items: center;
    width: 100%;

    @media (--viewport-sm-max) {
      overflow: hidden;
    }
  }

  &__right {
    display: none @(--sm) flex;
    flex: 1;
    align-items: center;
    justify-content: flex-end;
  }

  &__logo {
    width: 100px;
    height: auto;
  }
}

.nav {
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (--viewport-md-min) {
    flex-direction: row;
    justify-content: flex-end;
  }
}
</style>
