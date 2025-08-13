<script setup>
defineProps({
  error: { type: Object, required: true },
});

useHead({
  title: 'Der skete desværre en fejl',
  meta: [
    {
      name: 'description',
      content: 'Vi kunne desværre ikke finde den side, du ledte efter.',
    },
    {
      name: 'robots',
      content: 'noindex, nofollow',
    },
  ],
});

const currentDomain = useGetCurrentDomain();

const showErrorOnStagingSites = ref(
  ['staging.example.com'].includes(currentDomain),
);
const showErrorDetails =
  process.env.NODE_ENV === 'development' || showErrorOnStagingSites.value;
</script>

<template>
  <div id="app">
    <TheHeaderParent />
    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-12 col-sm-12 page-not-found">
          <h1>Page Not Found</h1>
          <p>We're sorry, we couldn't find the page you requested.</p>
          <pre class="page-not-found" v-if="showErrorDetails">
            {{ error }}
          </pre>
        </div>
      </div>
    </div>
    <TheFooter />
  </div>
</template>

<style lang="postcss">
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.container {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.page-not-found {
  padding-top: 30px;

  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow-wrap: break-word;

    @media (prefers-color-scheme: dark) {
      color: white;
      background-color: black;
    }
  }
}
</style>
