export const scrollTo = (id: string, offset: number = 0) => {
  const element = document.getElementById(id);
  if (!element) return;

  const startY = window.scrollY;
  const targetY = element.getBoundingClientRect().top + startY - offset;
  const distance = targetY - startY;
  const duration = 600;
  let startTime: number | null = null;

  const easeInOutQuad = (t: number) => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  };

  const animateScroll = (currentTime: number) => {
    if (!startTime) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const ease = easeInOutQuad(progress);
    window.scrollTo(0, startY + distance * ease);
    if (timeElapsed < duration) {
      requestAnimationFrame(animateScroll);
    }
  };

  requestAnimationFrame(animateScroll);
};
