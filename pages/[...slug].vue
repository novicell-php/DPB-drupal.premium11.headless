<script lang="ts" setup>
import NotFoundView from '~/components/views/NotFoundView.vue';
import { seoCanonicalUrlHandler } from '~/utils/seoCanonicalUrlHandler';

const { useContent } = useContentApi();

definePageMeta({
  layout: 'default',
});

// const router = useRouter();
// const config = useRuntimeConfig().public;
const route = useRoute();
const encodedPath = encodeURIComponent(route.path);

// // fetching page data
let error: any = null;
let redirectUrl = ref(null);

const { data } = await useAsyncData(encodedPath, () =>
  useContent(route.path)
    .then((res) => {
      if (res.type === 'redirect') {
        redirectUrl.value = res.target;
      }

      return res;
    })
    .catch((err) => {
      error = err;
      return null;
    }),
);

if (error || !data.value) {
  if (!error || !error.statusCode) {
    navigateTo('/maintenance');
  }
  // if BE is down
  if (error.statusCode.toString().startsWith('5')) {
    navigateTo('/maintenance');
  }

  // if forbidden to see
  if (error.statusCode === 403) {
    navigateTo('/forbidden');
    window.location.reload();
  }

  // stop code from executing further
  throw createError({
    statusCode: error.statusCode,
    statusMessage: error.message,
  });
}

const viewData = data.value.content;

// redirect
if (redirectUrl.value) {
  await navigateTo(redirectUrl.value);
}

const pageBlockHeaderData = viewData?.field_header;

// Dynamically import components
const renderLayoutBlock = (viewName: string) => {
  return defineAsyncComponent({
    loader: () =>
      import(`@/components/views/${viewName}View.vue`).catch((err) => {
        if (err.message.includes('Cannot find module')) {
          console.error(`View ${viewName} not found.`, err);
        } else {
          console.error(
            'Failed to load view due to network or other issue',
            err,
          );
        }
        return NotFoundView;
      }),
  });
};

// TODO: Redo this part with actual out-of-box properties in the kit and refactored vars to be cleaner.
// SEO/META

const openGraph = ref(viewData?.field_meta_tags?.html_head);
const seoData = ref(viewData?.field_meta_tags);
const seoHeadLinkDataEN = ref(
  seoData?.value?.html_head?.alternate_en?.attributes,
);
const seoHeadLinkDataDA = ref(
  seoData?.value?.html_head?.alternate_da?.attributes,
);

const canonicalUrl = computed(() => {
  return seoCanonicalUrlHandler(
    openGraph?.value?.canonical_url?.attributes?.href ?? '',
    viewData?.is_frontpage,
  );
});

useHead({
  htmlAttrs: {
    lang: viewData?.langcode || 'da',
  },

  title:
    seoData?.value?.html_head?.title?.attributes?.content ??
    viewData?.label ??
    '',
  meta: [
    {
      name: 'description',
      content:
        seoData?.value?.html_head?.description?.attributes?.content ?? '',
    },
    {
      name: 'robots',
      content: seoData?.value?.html_head?.robots?.attributes?.content ?? '',
    },
  ],

  link: [
    {
      rel: 'canonical',
      href: canonicalUrl.value,
    },
    {
      rel: seoHeadLinkDataEN?.value?.rel,
      href: seoHeadLinkDataEN?.value?.href,
      hreflang: seoHeadLinkDataEN?.value?.hreflang,
    },
    {
      rel: seoHeadLinkDataDA?.value?.rel,
      href: seoHeadLinkDataDA?.value?.href,
      hreflang: seoHeadLinkDataDA?.value?.hreflang,
    },
  ],
});
</script>

<template>
  <main>
    <component
      :is="renderLayoutBlock(viewData.bundle)"
      v-if="viewData"
      :data="viewData"
      :page-header="pageBlockHeaderData"
    />
  </main>
</template>
