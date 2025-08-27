<script setup>
import { useFooterDataStore } from '~/stores/footerData';

const footerDataStore = useFooterDataStore();
const computedFooterData = computed(() => {
  return footerDataStore.footerData || {};
});

const chunkedFooterData = computed(() => {
  const footerItems = computedFooterData.value?.items;
  if (!footerItems) {
    return [];
  }

  const chunks = [];
  // Split the footer items into chunks of 4 items per column
  const chunkSize = 4;
  for (let i = 0; i < footerItems.length; i += chunkSize) {
    chunks.push(footerItems.slice(i, i + chunkSize));
  }
  return chunks;
});
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="row">
        <div
          v-for="(chunk, index) in chunkedFooterData"
          :key="index"
          class="col-xs-12 col-sm-12 col-md-3"
        >
          <div class="footer__navigation-items-wrapper">
            <TheFooterContainer :footer-menu-data="chunk" />
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style lang="postcss" scoped>
.footer {
  padding: 60px 0 60px;
  border-top: 1px solid var(--color-gray-11);
  box-shadow: 0 2px 6px var(--header-shadow);
}
</style>
