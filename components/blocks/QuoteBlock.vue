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

<script setup>
const props = defineProps({
  blockData: Object,
});
</script>

<style lang="postcss" scoped>
.quote {
  margin: 0;
  text-align: center;

  &__text {
    display: flex;
  }
  &__mark {
    font-size: 3rem;
    line-height: 0;
    vertical-align: top;
    user-select: none;
    margin-right: 0.2rem;
  }

  &__text {
    white-space: pre-line;
    font-weight: 300;
    line-height: 1.3;
    font-size: clamp(2rem, 2.5vw, 2rem);
    margin: 0;
  }

  &__author {
    padding-left: 1rem;
    margin-top: 0.8rem;
    font-size: 1rem;
    font-style: normal;
    text-align: start;
  }
}
</style>
