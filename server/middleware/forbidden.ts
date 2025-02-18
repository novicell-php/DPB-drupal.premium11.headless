export default defineEventHandler((event) => {
  const { req, res } = event.node;

  if (req.url === '/forbidden') {
    res.statusCode = 403;
  }
});
