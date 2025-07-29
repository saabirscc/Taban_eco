// utils/publicUrl.js
const os   = require('os');
const ip   = Object.values(os.networkInterfaces())
              .flat().find(i => i.family === 'IPv4' && !i.internal)?.address;

const PUBLIC_HOST =                 // ⬅ adjust once in .env for prod
  process.env.PUBLIC_HOST ||        // e.g. 'api.eco‑volunteer.org'
  (process.env.NODE_ENV === 'production'
      ? ip                               // LAN IP when running on device
      : '10.0.2.2');                     // Android emulator magic loopback

module.exports = (req, filename) =>
  `${req.protocol}://${PUBLIC_HOST}:5000/uploads/${filename}`;
