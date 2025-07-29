const fs   = require('fs');
const path = require('path');
const r    = require('express').Router();

/* Stream any file in /uploads with proper range (206) support */
r.get('/:file', (req, res) => {
  const filePath = path.join(__dirname, '../uploads', req.params.file);
  if (!fs.existsSync(filePath)) return res.sendStatus(404);

  const stat  = fs.statSync(filePath);
  const range = req.headers.range;

  if (!range) {
    /* fallback – full file */
    res.writeHead(200, {
      'Content-Length': stat.size,
      'Content-Type'  : 'video/mp4',
    });
    return fs.createReadStream(filePath).pipe(res);
  }

  /* partial content */
  const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
  const start     = parseInt(startStr, 10);
  const end       = endStr ? parseInt(endStr, 10) : stat.size - 1;
  const chunkSize = end - start + 1;

  res.writeHead(206, {
    'Content-Range' : `bytes ${start}-${end}/${stat.size}`,
    'Accept-Ranges' : 'bytes',
    'Content-Length': chunkSize,
    'Content-Type'  : 'video/mp4',
  });
  fs.createReadStream(filePath, { start, end }).pipe(res);
});

module.exports = r;
