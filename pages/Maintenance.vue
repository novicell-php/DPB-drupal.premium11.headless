<script setup>
definePageMeta({
  layout: 'blank',
});

useHead({
  title: 'Maintenance',
  meta: [
    {
      name: 'description',
      content: 'Maintenance in progress',
    },
    {
      name: 'robots',
      content: 'noindex, nofollow',
    },
  ],
});

setTimeout(() => {
  window.location.href = '/';
}, 90000);
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12">
        <div class="maintenance__wrapper">
          <h1 class="maintenance__heading">Maintenance in progress</h1>
          <p class="maintenance__subtext">
            We're sorry, we're currently performing maintenance. Please check
            back later.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.maintenance {
  &__wrapper {
    margin-top: 20px;
  }

  &__heading {
    min-height: 55px @(--sm) 144px;
    font-weight: 200;
    font-size: 48px @(--sm) 128px;
    font-family: var(--heading-font-family);
    text-align: center;
  }

  &__subtext {
    margin-top: 40px @(--sm) 50px;
    padding-bottom: 20px;
    font-weight: 200;
    font-size: 21px @(--sm) 32px;
    font-family: var(--heading-font-family);
    text-align: center;
  }
}
</style>
