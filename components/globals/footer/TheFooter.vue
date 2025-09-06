<script setup>
import { useFooterDataStore } from '~/stores/footerData';

const footerDataStore = useFooterDataStore();
const computedFooterData = computed(() => footerDataStore.footerData || {});
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="row">
        <div
          v-for="(item, index) in computedFooterData?.items || []"
          :key="index"
          class="col-xs-6 col-sm-6 col-md-3"
        >
          <div class="footer__navigation-items-wrapper">
            <TheFooterContainer :footer-menu-data="[item]" />
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style lang="postcss" scoped>
.footer {
  padding: 30px 0 40px;
  border-top: 1px solid var(--color-gray-11);
  box-shadow: 0 2px 6px var(--header-shadow);

  &__navigation-items-wrapper {
    padding: 10px 0;
  }
}
</style>
