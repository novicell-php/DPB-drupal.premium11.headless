import { defineEventHandler, getRequestURL } from 'h3';

export default defineEventHandler((event) => {
  const url = getRequestURL(event);
  const path = url.pathname || '/';
  const query = url.searchParams;
  const hash = url.hash;

  if (path === '/') return;

  // Remove trailing slashes and lowercase the URL
  const nextPath = path.replace(/\/+$/, '').toLowerCase() || '/';
  const nextRoute = `${nextPath}${query.toString() ? `?${query}` : ''}${hash ? `#${hash}` : ''}`;

  if (path !== nextPath) {
    event.node.res.writeHead(301, { Location: nextRoute });
    event.node.res.end();
  }
});
