<script setup>
const props = defineProps({
  node: {
    type: Object,
    required: false,
  },
});

const showAcc = ref(false);

const hasChildren = computed(() => {
  const { below } = props.node;

  if (below.length === 0) {
    return false;
  } else if (below.length > 0) {
    return true;
  }
});
</script>

<template>
  <div class="col-footer-item footer-item--heading">
    <div
      :class="
        ((!node?.url ? 'footer-headline ' : '') + (showAcc ? 'active-acc' : ''),
        'footer-item__wrapper')
      "
    >
      <div v-if="!node?.url" class="footer-item__link footer-item__link--title">
        {{ node?.title }}
      </div>

      <NuxtLink
        v-else
        :to="node?.url"
        class="footer-item__link"
        :class="!node?.url ? 'footer-item__link--title' : ''"
        :aria-label="'Visit' + node?.title"
      >
        {{ node?.title }}
      </NuxtLink>
    </div>

    <div
      v-if="hasChildren"
      class="footer-item__children"
      :class="showAcc ? 'footer-item__children--active' : ''"
    >
      <NuxtLink
        v-for="child in node?.below"
        :key="child.id"
        :to="child?.url"
        class="footer-item__link"
        :class="child?.description ? 'footer-item__link--tooltip' : ''"
        :aria-label="'Visit' + child?.title"
      >
        {{ child?.title }}

        <span v-if="child?.description" class="footer-item__tooltip">
          {{ child?.description }}
        </span>
      </NuxtLink>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.footer-headline {
  display: flex;
  justify-content: space-between;
  border: none;
  cursor: auto;
}

.footer-item {
  &__link {
    text-decoration: none;
    color: var(--color-text);
    width: fit-content;
    transition: all 0.3s ease;
    opacity: 1;

    &:hover {
      opacity: 0.7;
      text-decoration: underline;
    }

    &--title {
      font-weight: 700;
      font-size: 16px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      opacity: 0.8 !important;
      text-decoration: none !important;
      padding-bottom: 3px;
    }
  }

  &__children {
    display: grid;

    &--active {
      display: grid;
    }
  }
}

.footer-item__link--tooltip:hover {
  .footer-item__tooltip {
    visibility: visible;
    opacity: 1;
  }
}
</style>
