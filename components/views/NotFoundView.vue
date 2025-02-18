<script setup>
definePageMeta({
  layout: 'default',
});

useHead({
  title: 'View not found',
  meta: [
    {
      name: 'robots',
      content: 'noindex, nofollow',
    },
  ],
});
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12">
        <div class="view-not-found__wrapper">
          <h1 class="view-not-found__heading">View not found</h1>
          <p class="view-not-found__subtext">Such view was not created.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.view-not-found {
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
