import { defineStore } from 'pinia';

export const useHeaderDataStore = defineStore('headerData', () => {
  const headerData = useState('headerData', () => null);

  const setHeaderData = (data: any) => {
    headerData.value = data;
  };

  return {
    headerData,
    setHeaderData,
  };
});
