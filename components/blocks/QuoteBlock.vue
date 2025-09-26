<script setup>
const props = defineProps({
  blockData: Object,
});
</script>

<template>
  <blockquote class="quote">
    <div class="quote__text">
      <span aria-hidden="true" class="quote__mark">“</span>
      <p class="quote__text">{{ blockData.field_quote_text }}</p>
      <span aria-hidden="true" class="quote__mark">”</span>
    </div>

    <div v-if="blockData.field_quote_source" class="quote__author">
      <cite>— {{ blockData.field_quote_source }}</cite>
    </div>
  </blockquote>
</template>

<style lang="postcss" scoped>
.quote {
  margin: 0 auto;
  max-width: 700px;
  text-align: center;
  padding: 2.5rem 2rem;
  position: relative;
  font-family: serif;

  &__text {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.9rem;
    position: relative;
    background-color: transparent;
  }

  &__mark {
    font-size: 5rem @(--sm) 8rem;
    height: 80px;
    line-height: 1;
    vertical-align: top;
    user-select: none;
    font-weight: 700;
    opacity: 0.15;
    position: relative;
    top: 0.25rem;
  }

  &__text p {
    white-space: pre-line;
    font-weight: 400;
    line-height: 1.3;
    font-size: clamp(2rem, 3vw, 2.5rem);
    margin: 0;
    font-family: serif;
  }

  &__author {
    margin-top: 0.75rem;
    font-size: 1.125rem;
    font-weight: 500;
    font-style: normal;
    text-align: center;
    letter-spacing: 0.05em;
    font-family: serif;
  }
}

.col-md-4 .layout-block--quote .quote {
  &__mark {
    font-size: 4rem;
  }
  &__text p {
    font-size: 2rem @(--sm) 1.5rem;
  }
}
</style>
