<script setup>
const props = defineProps({
  blockData: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="articles">
    <div class="articles__content">
      <BaseArticle
        v-for="item in blockData.field_articles.entities"
        :key="item.id"
        :blockData="item"
      />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.articles {
  &__content {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 30px 15px;

    @media (--viewport-lg-max) {
      grid-template-columns: repeat(4, 1fr);
    }

    @media (--viewport-md-max) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (--viewport-sm-max) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (--viewport-xs-max) {
      grid-template-columns: 1fr;
      gap: 50px;
    }
  }
}
</style>
