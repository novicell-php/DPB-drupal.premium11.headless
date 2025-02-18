import { defineStore } from 'pinia';

export const useFooterDataStore = defineStore('footerData', () => {
  const { useRegion } = useRegionApi();
  const loading = ref(false);
  const footerData: any = ref(null);
  const error = ref<string | null>(null);

  const getFooterData = async () => {
    loading.value = true;
    error.value = null;

    try {
      const { data } = await useAsyncData('footer', () => useRegion('footer'));

      if (!data.value) {
        throw new Error(
          'Failed to fetch footer data from the CMS. No data returned.',
        );
      }

      footerData.value = data.value;
    } catch (err) {
      error.value = (err as Error).message;
      console.error('Error while fetching footer data:', error.value);
    } finally {
      loading.value = false;
    }
  };

  return { footerData, getFooterData, loading, error };
});
