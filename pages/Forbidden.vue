<script setup>
definePageMeta({
  layout: 'default',
});

useHead({
  title: 'Forbidden',
  meta: [
    {
      name: 'robots',
      content: 'noindex, nofollow',
    },
    {
      name: 'description',
      content: "You don't have permission to access this page.",
    },
  ],
});
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12">
        <div class="forbidden__wrapper">
          <h1 class="forbidden__heading">Forbidden</h1>
          <p class="forbidden__subtext">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.forbidden {
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
