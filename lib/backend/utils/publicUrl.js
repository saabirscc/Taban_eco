
module.exports = (req, filename = '') => {
  // 1) Prefer an explicit host set in the environment,
  //    otherwise use the exact host/port the client used.
  const host = process.env.PUBLIC_HOST || req.get('host');    // e.g. "localhost:5000"

  // 2) Build the URL
  return `${req.protocol}://${host}/uploads/${filename}`;      // → "http://localhost:5000/uploads/<filename>"
};