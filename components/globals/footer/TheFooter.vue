<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const footerData = props.data;
</script>

<template>
  <div class="footer">
    <div class="container">
      <div class="row">
        <div class="footer__socials col-sm-12 col-md-3">
          <NuxtLink to="/" aria-label="Logo">
            <BaseLogo class="footer__logo" />
          </NuxtLink>
        </div>

        <div class="col-sm-12 col-md-3">
          <div class="footer__navigation-items-wrapper" v-if="footerData">
            <TheFooterContainer :footer-menu-data="footerData" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.footer {
  background-color: var(--color-primary);
  padding: 80px 0 60px @(--sm) 90px 0 90px;
}
</style>
