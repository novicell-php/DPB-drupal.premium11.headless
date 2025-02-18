export async function UseBaseApi<T>(
  path: string,
  opt: Record<string, any> = {},
) {
  const config = useRuntimeConfig().public;
  const attachHostParam = {
    params: {
      ...opt.params,
    },
  };
  const mergedParamOptions = {
    ...opt,
    ...attachHostParam,
  };

  return await $fetch<T>(path, {
    baseURL: config.API_BASE_URL,
    cache: opt.cache ?? 'no-cache',
    ...mergedParamOptions,
  });
}
