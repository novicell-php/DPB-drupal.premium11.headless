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
    <div
      class="articles__content"
      :class="{
        'articles__content--no-results':
          !blockData?.field_articles?.entities?.length,
      }"
    >
      <BaseArticle
        v-for="item in blockData.field_articles?.entities"
        :key="item.id"
        :blockData="item"
        v-if="blockData.field_articles?.entities?.length"
      />
      <p v-else class="articles__fallback">No articles found.</p>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.articles {
  &__content {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 30px 15px;

    &--no-results {
      justify-items: center;
      align-items: center;
      grid-template-columns: 1fr;
    }

    &__fallback {
      text-align: center;
      font-size: 18px;
    }

    @media (--viewport-lg-max) {
      grid-template-columns: repeat(4, 1fr);
    }

    @media (--viewport-md-max) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (--viewport-sm-max) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (--viewport-ms-max) {
      grid-template-columns: repeat(1, 1fr);
      gap: 50px;
    }

    @media (--viewport-xs-max) {
      grid-template-columns: 1fr;
      gap: 50px;
    }
  }
}

/* For different layout variations */
.container--fluid {
  .layout-block--articles .articles__content {
    grid-template-columns: repeat(5, 1fr);

    @media (--viewport-lg-max) {
      grid-template-columns: repeat(4, 1fr);
    }

    @media (--viewport-md-max) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (--viewport-sm-max) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (--viewport-ms-max) {
      grid-template-columns: 1fr;
      gap: 50px;
    }
  }
}

.container--narrow {
  .layout-block--articles .articles__content {
    grid-template-columns: repeat(3, 1fr);

    @media (--viewport-md-max) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (--viewport-sm-max) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (--viewport-ms-max) {
      grid-template-columns: repeat(1, 1fr);
      gap: 50px;
    }

    @media (--viewport-ms-max) {
      grid-template-columns: 1fr;
      gap: 50px;
    }
  }
}

.col-md-8 .layout-block--articles .articles__content {
  grid-template-columns: repeat(2, 1fr);

  @media (--viewport-md-max) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (--viewport-sm-max) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (--viewport-ms-max) {
    grid-template-columns: 1fr;
    gap: 50px;
  }
}

.col-md-6 .layout-block--articles .articles__content {
  grid-template-columns: repeat(2, 1fr);

  @media (--viewport-md-max) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (--viewport-sm-max) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (--viewport-ms-max) {
    grid-template-columns: repeat(1, 1fr);
    gap: 50px;
  }

  @media (--viewport-xs-max) {
    grid-template-columns: 1fr;
  }
}

.col-md-4 .layout-block--articles .articles__content {
  grid-template-columns: 1fr;

  @media (--viewport-sm-max) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (--viewport-ms-max) {
    grid-template-columns: repeat(1, 1fr);
    gap: 50px;
  }
}
</style>
