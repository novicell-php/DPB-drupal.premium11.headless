import { defineStore } from 'pinia';

export const useHeaderDataStore = defineStore('headerData', () => {
  const { useRegion } = useRegionApi();
  const loading = ref(false);
  const headerData: any = ref(null);
  const error = ref<string | null>(null);

  const getHeaderData = async () => {
    loading.value = true;
    error.value = null;

    try {
      const { data } = await useAsyncData('header', () => useRegion('header'));

      if (!data.value) {
        throw new Error(
          'Failed to fetch header data from the CMS. No data returned.',
        );
      }

      headerData.value = data.value;
    } catch (err) {
      error.value = (err as Error).message;
      console.error('Error while fetching header data:', error.value);
    } finally {
      loading.value = false;
    }
  };

  return {
    headerData,
    getHeaderData,
    loading,
    error,
  };
});
