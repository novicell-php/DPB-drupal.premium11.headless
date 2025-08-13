import { defineStore } from 'pinia';

export const useFooterDataStore = defineStore('footerData', () => {
  const footerData = useState('footerData', () => null);

  const setFooterData = (data: any) => {
    footerData.value = data;
  };

  return {
    footerData,
    setFooterData,
  };
});
