export const scrollTo = (
  selector: string,
  options: ScrollIntoViewOptions = {},
) => {
  const el = document.querySelector(selector);
  if (!el) return;

  el.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest',
    ...options,
  });
};
