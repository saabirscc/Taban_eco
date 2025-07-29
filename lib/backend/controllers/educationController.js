// controllers/educationController.js
const path = require('path');
const { exec } = require('child_process');
const EducationContent = require('../models/EducationContent');

/* ───────── Admin: upload ───────── */
exports.create = async (req, res, next) => {
  try {
    if (!req.files?.file) {
      return res.status(400).json({ msg: 'file is required' });
    }
    const { title, description = '', kind } = req.body;
    if (!title || !kind) {
      return res.status(400).json({ msg: 'title & kind required' });
    }

    const file      = req.files.file[0];
    const filename  = path.basename(file.filename);

    // Build the public URL
    // Videos will stream through our /api/video/:file route
    const fileUrl = kind === 'video'
      ? `${req.protocol}://${req.get('host')}/api/video/${filename}`
      : `${req.protocol}://${req.get('host')}/uploads/${filename}`;

    const thumbUrl = (kind === 'video' && req.files.thumb)
      ? `${req.protocol}://${req.get('host')}/uploads/${path.basename(req.files.thumb[0].filename)}`
      : undefined;

    // Optimize video if ffmpeg is available (fast‑start + downscale)
    if (kind === 'video') {
      try {
        await new Promise((ok, bad) =>
          exec(
            `ffmpeg -y -i "${file.path}" -vf "scale='min(1280,iw)':-2" \
             -c:v libx264 -preset veryfast -crf 26 \
             -movflags +faststart -c:a aac -b:a 128k "${file.path}"`,
            err => err ? bad(err) : ok()
          )
        );
      } catch (ffErr) {
        console.warn('⚠️  ffmpeg optimization failed, continuing without it:', ffErr.message);
      }
    }

    const doc = await EducationContent.create({
      title,
      description,
      kind,
      fileUrl,
      thumbUrl,
      uploadedBy: req.user.id,
    });

    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
};

/* ───────── Public: list ───────── */
exports.list = async (_req, res, next) => {
  try {
    const items = await EducationContent.find()
      .sort({ createdAt: -1 })
      .populate('uploadedBy', 'fullName');
    res.json(items);
  } catch (err) {
    next(err);
  }
};

/* ───────── Public: like / unlike ───────── */
exports.toggleLike = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doc    = await EducationContent.findById(id);
    if (!doc) return res.status(404).json({ msg: 'Not found' });

    const uid = req.user.id;
    const hasLiked = doc.likes.map(String).includes(uid);
    if (hasLiked) doc.likes.pull(uid);
    else           doc.likes.push(uid);

    await doc.save();
    res.json({ liked: !hasLiked, likes: doc.likes.length });
  } catch (err) {
    next(err);
  }
};

/* ───────── Public: comment ───────── */
exports.addComment = async (req, res, next) => {
  try {
    const { id }   = req.params;
    const { text } = req.body;
    if (!text) return res.status(400).json({ msg: 'text required' });

    const doc = await EducationContent.findByIdAndUpdate(
      id,
      { $push: { comments: { user: req.user.id, text } } },
      { new: true }
    ).populate('comments.user', 'fullName profilePicture');

    if (!doc) return res.status(404).json({ msg: 'Not found' });
    res.json(doc.comments.at(-1)); // return only newly added comment
  } catch (err) {
    next(err);
  }
};
