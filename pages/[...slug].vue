<script setup>
import { useHeaderDataStore } from '~/stores/headerData';
import { useFooterDataStore } from '~/stores/footerData';
import PageNotFound from '../pages/PageNotFound.vue';
import NotFoundView from '../components/views/NotFoundView.vue';

definePageMeta({
  layout: 'default',
});

const headerStore = useHeaderDataStore();
const footerStore = useFooterDataStore();

const route = useRoute();
const encodedPath = encodeURIComponent(route.path);

const hasFetchedLayoutRegions = useState(
  'hasFetchedLayoutRegions',
  () => false,
);
const siteAnnouncements = useState('siteAnnouncements', () => null);
const regionsToFetch = ref(
  hasFetchedLayoutRegions.value ? ['content'] : ['footer', 'header', 'content'],
);

function handleLayoutRegions(res) {
  const { header, footer } = res;
  header?.navigation && headerStore.setHeaderData(header.navigation);
  siteAnnouncements.value = header?.announcements || null;
  footer?.footer && footerStore.setFooterData(footer.footer);
  hasFetchedLayoutRegions.value = true;
}

const { data, error } = await useAsyncData(encodedPath, async () => {
  const res = await useMultipleRegions(route.path, regionsToFetch.value);

  if (!hasFetchedLayoutRegions.value) {
    handleLayoutRegions(res);
  }

  return res;
});

// Handle errors and null data
const showNotFound = ref(false);

if (error.value || data.value === null) {
  const status = error.value?.statusCode;

  if (!status || status.toString().startsWith('5')) {
    await navigateTo('/maintenance');
  } else if (status === 403) {
    await navigateTo('/forbidden');
  } else {
    showNotFound.value = true;
  }
}

if (data.value?.type === 'redirect') {
  const cleanPath = data.value.target.split('?')[0];
  await navigateTo(cleanPath, { redirectCode: 301 });
}

const viewData = computed(() => {
  if (!data.value) return null;

  if (data.value.content?.content) {
    return data.value.content.content;
  }

  if (data.value.content) {
    return data.value.content;
  }

  return null;
});

console.log('View Data:', viewData.value);

const pageBlockHeaderData = computed(() => {
  return viewData.value?.field_header || null;
});

// Dynamically import components
const renderLayoutBlock = (viewName) => {
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

// Safe access to SEO data
const seoData = computed(() => {
  return viewData.value?.field_meta_tags?.html_head || null;
});

const pageTitle = computed(() => {
  return seoData.value?.title?.attributes?.content || 'Page Not Found';
});

const canonicalUrl = computed(() => {
  return seoData.value?.canonical_url?.attributes?.href || '';
});

// Only set head data if we have valid view data
watchEffect(() => {
  if (viewData.value && !showNotFound.value) {
    useHead({
      title: pageTitle.value,
      meta: [
        {
          name: 'description',
          content: viewData.value.field_description || '',
        },
        {
          name: 'robots',
          content: 'noindex, nofollow',
        },
      ],
      link: [
        {
          rel: 'canonical',
          href: canonicalUrl.value,
        },
      ],
    });
  }
});
</script>

<template>
  <div class="page-wrapper">
    <div role="region" aria-label="Site announcements" v-if="siteAnnouncements">
      <Announcements :announcements="siteAnnouncements" />
    </div>

    <PageNotFound v-if="showNotFound || !viewData" />
    <component
      v-else
      :is="renderLayoutBlock(viewData.bundle)"
      :data="viewData"
      :page-header="pageBlockHeaderData"
    />
  </div>
</template>
