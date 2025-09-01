<script setup>
import { useHeaderDataStore } from '~/stores/headerData';
import { useFooterDataStore } from '~/stores/footerData';

const router = useRouter();

const goBack = () => {
  router.back();
};

useHead({
  title: '404 - Page Not Found',
  meta: [
    {
      name: 'description',
      content: 'The page you are looking for could not be found.',
    },
    {
      name: 'robots',
      content: 'noindex, nofollow',
    },
  ],
});

const headerStore = useHeaderDataStore();
const footerStore = useFooterDataStore();

const regionsToFetch = ref(['footer', 'header']);
const { data } = await useAsyncData('Home', async () => {
  const res = await useMultipleRegions('/', regionsToFetch.value);

  if (res) {
    const { header, footer } = res;
    header?.navigation && headerStore.setHeaderData(header.navigation);
    footer?.footer && footerStore.setFooterData(footer.footer);
  }

  return res;
});
</script>

<template>
  <main id="main" class="not-found-page" tabindex="-1">
    <div class="container">
      <div class="not-found-page__content">
        <div class="not-found-page__code">404</div>
        <h1 class="not-found-page__title">Page Not Found</h1>
        <p class="not-found-page__description">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        <div class="not-found-page__actions">
          <NuxtLink to="/" class="btn btn-primary"> Go Home </NuxtLink>
          <button @click="goBack" class="btn btn-secondary">Go Back</button>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="postcss" scoped>
.not-found-page {
  min-height: calc(100vh - var(--header-height));
  display: flex;
  align-items: center;
  justify-content: center;

  &__container {
    max-width: 600px;
    width: 100%;
  }

  &__content {
    text-align: center;
  }

  &__code {
    font-size: 8rem;
    font-weight: 700;
    color: var(--color-primary);
    line-height: 1;
    margin-bottom: 1rem;

    @media (max-width: 768px) {
      font-size: 6rem;
    }
  }

  &__title {
    font-size: 2.5rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: 1rem;

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  &__description {
    font-size: 1.125rem;
    color: var(--color-text-secondary);
    margin-bottom: 2.5rem;
    line-height: 1.6;

    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }

  &__actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  border-radius: 0.5rem;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  min-width: 120px;
}

.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-white);

  &:hover {
    background-color: var(--color-primary-dark);
  }
}

.btn-secondary {
  background-color: transparent;
  color: var(--color-text-primary);
  border-color:  #ddd;

  &:hover {
    background-color:, #f8f9fa;
    border-color:  #bbb;
  }
}
</style>
