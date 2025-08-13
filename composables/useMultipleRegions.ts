export const useMultipleRegions = (
  path: string,
  regions: string | string[] = [],
) => {
  const regionParam = Array.isArray(regions) ? regions.join(',') : regions;
  return UseBaseApi(path, {
    params: {
      format: 'json',
      region: regionParam,
    },
  });
};
