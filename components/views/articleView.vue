<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const seoData = props.data?.field_meta_tags?.html_head || {};
useHead({
  title: seoData?.title?.attributes?.content,
  meta: [
    {
      name: seoData?.description?.attributes?.name,
      content: seoData?.description?.attributes?.content,
    },
    {
      property: 'og:title',
      content: seoData?.title?.attributes?.content,
    },
    {
      property: 'og:description',
      content: seoData?.description?.attributes?.content,
    },
    {
      property: 'og:image',
      content: seoData?.image_src?.attributes?.href,
    },
  ],
  link: [
    {
      rel: seoData?.canonical_url?.attributes?.rel,
      href: seoData?.canonical_url?.attributes?.href,
    },
    {
      rel: seoData?.image_src?.attributes?.rel,
      href: seoData?.image_src?.attributes?.href,
    },
  ],
});
</script>

<template>
  <main id="main" class="article-view" tabindex="-1">
    <Sections
      v-if="data && data.layout_builder__layout"
      :sections="data.layout_builder__layout"
    />
  </main>
</template>
