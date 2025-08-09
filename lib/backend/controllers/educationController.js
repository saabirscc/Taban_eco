// //lib/backend/controllers/educationController.js
// /* eslint-disable camelcase */
// const path                = require('path');
// const { exec }            = require('child_process');
// const EducationContent    = require('../models/EducationContent');
// const makePublicUrl       = require('../utils/publicUrl');      // ✅ new

// /* ───────────────────────── Admin upload ───────────────────────── */
// exports.create = async (req, res, next) => {
//   try {
//     if (!req.files?.file) {
//       return res.status(400).json({ msg: 'file is required' });
//     }

//     const { title, description = '', kind } = req.body;
//     if (!title || !kind) {
//       return res.status(400).json({ msg: 'title & kind required' });
//     }

//     const file     = req.files.file[0];
//     const filename = path.basename(file.filename);

//     /* -------- Build absolute URLs that work everywhere -------- */
//     const uploadsRoot = makePublicUrl(req);                    // ".../uploads/"
//     const base        = uploadsRoot.replace(/\/uploads\/?$/, ''); // "...:5000"

//     const fileUrl = kind === 'video'
//       ? `${base}/api/video/${filename}`
//       : `${uploadsRoot}${filename}`;

//     const thumbUrl = (kind === 'video' && req.files.thumb)
//       ? `${uploadsRoot}${path.basename(req.files.thumb[0].filename)}`
//       : undefined;
//     /* ---------------------------------------------------------- */

//     /* ---------- optional ffmpeg optimisation for videos ---------- */
//     if (kind === 'video') {
//       try {
//         await new Promise((ok, bad) =>
//           exec(
//             `ffmpeg -y -i "${file.path}" -vf "scale='min(1280,iw)':-2" ` +
//             `-c:v libx264 -preset veryfast -crf 26 ` +
//             `-movflags +faststart -c:a aac -b:a 128k "${file.path}"`,
//             err => (err ? bad(err) : ok())
//           )
//         );
//       } catch (ffErr) {
//         /* eslint-disable no-console */
//         console.warn('⚠️  ffmpeg optimisation failed, continuing:', ffErr.message);
//       }
//     }

//     /* -------------------- persist to DB -------------------- */
//     const doc = await EducationContent.create({
//       title,
//       description,
//       kind,
//       fileUrl,
//       thumbUrl,
//       uploadedBy: req.user.id,
//     });

//     res.status(201).json(doc);
//   } catch (err) {
//     next(err);
//   }
// };

// /* ───────────────────────── Public list / like / comment ───────────────────────── */

// exports.list = async (_req, res, next) => {
//   try {
//     const items = await EducationContent.find()
//       .sort({ createdAt: -1 })
//       .populate('uploadedBy', 'fullName');
//     res.json(items);
//   } catch (err) {
//     next(err);
//   }
// };

// exports.toggleLike = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const doc = await EducationContent.findById(id);
//     if (!doc) return res.status(404).json({ msg: 'Not found' });

//     const me    = req.user.id;
//     const liked = doc.likes.map(String).includes(me);

//     liked ? doc.likes.pull(me) : doc.likes.push(me);
//     await doc.save();

//     res.json({ liked: !liked, likes: doc.likes.length });
//   } catch (err) {
//     next(err);
//   }
// };

// exports.addComment = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { text } = req.body;
//     if (!text) return res.status(400).json({ msg: 'text required' });

//     const doc = await EducationContent.findByIdAndUpdate(
//       id,
//       { $push: { comments: { user: req.user.id, text } } },
//       { new: true }
//     ).populate('comments.user', 'fullName profilePicture');

//     if (!doc) return res.status(404).json({ msg: 'Not found' });

//     // Send back the newly added comment object
//     res.json(doc.comments.at(-1));
//   } catch (err) {
//     next(err);
//   }
// }
// /* ───────────────────────── Public list / like / comment ───────────────────────── */

// exports.list = async (_req, res, next) => {
//   try {
//     const items = await EducationContent.find()
//       .sort({ createdAt: -1 })
//       .populate('uploadedBy', 'fullName');
//     res.json(items);
//   } catch (err) { next(err); }
// };

// exports.toggleLike = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const doc = await EducationContent.findById(id);
//     if (!doc) return res.status(404).json({ msg: 'Not found' });

//     const me = req.user.id;
//     const liked = doc.likes.map(String).includes(me);
//     liked ? doc.likes.pull(me) : doc.likes.push(me);

//     await doc.save();
//     res.json({ liked: !liked, likes: doc.likes.length });
//   } catch (err) { next(err); }
// };

// exports.addComment = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { text } = req.body;
//     if (!text) return res.status(400).json({ msg: 'text required' });

//     const doc = await EducationContent.findByIdAndUpdate(
//       id,
//       { $push: { comments: { user: req.user.id, text } } },
//       { new: true }
//     ).populate('comments.user', 'fullName profilePicture');

//     if (!doc) return res.status(404).json({ msg: 'Not found' });
//     res.json(doc.comments.at(-1));
//   } catch (err) { next(err); }
// };











//update
/* eslint-disable camelcase */
const path = require('path');
const { exec } = require('child_process');
const EducationContent = require('../models/EducationContent');
const makePublicUrl = require('../utils/publicUrl'); // ✅ Builds base URL

/* ───────────────────────── Admin Upload ───────────────────────── */
exports.create = async (req, res, next) => {
  try {
    if (!req.files?.file) {
      return res.status(400).json({ msg: 'file is required' });
    }

    const { title, description = '', kind } = req.body;
    if (!title || !kind) {
      return res.status(400).json({ msg: 'title & kind required' });
    }

    const file = req.files.file[0];
    const filename = path.basename(file.filename);

    // Build URLs
    const uploadsRoot = makePublicUrl(req); // ".../uploads/"
    const base = uploadsRoot.replace(/\/uploads\/?$/, ''); // "...:5000"

    const fileUrl =
      kind === 'video'
        ? `${base}/api/video/${filename}`
        : `${uploadsRoot}${filename}`;

    const thumbUrl =
      kind === 'video' && req.files.thumb
        ? `${uploadsRoot}${path.basename(req.files.thumb[0].filename)}`
        : undefined;

    // Optimize video using ffmpeg
    if (kind === 'video') {
      try {
        await new Promise((ok, bad) =>
          exec(
            `ffmpeg -y -i "${file.path}" -vf "scale='min(1280,iw)':-2" ` +
              `-c:v libx264 -preset veryfast -crf 26 ` +
              `-movflags +faststart -c:a aac -b:a 128k "${file.path}"`,
            (err) => (err ? bad(err) : ok())
          )
        );
      } catch (ffErr) {
        console.warn('⚠️  ffmpeg optimisation failed, continuing:', ffErr.message);
      }
    }

    // Save to DB
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

/* ───────────────────────── Public: List ───────────────────────── */
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

/* ───────────────────────── Public: Like ───────────────────────── */
exports.toggleLike = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doc = await EducationContent.findById(id);
    if (!doc) return res.status(404).json({ msg: 'Not found' });

    const me = req.user.id;
    const liked = doc.likes.map(String).includes(me);

    liked ? doc.likes.pull(me) : doc.likes.push(me);
    await doc.save();

    res.json({ liked: !liked, likes: doc.likes.length });
  } catch (err) {
    next(err);
  }
};

/* ─────────────────────── Public: Add Comment ─────────────────────── */
exports.addComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    if (!text) return res.status(400).json({ msg: 'text required' });

    const doc = await EducationContent.findByIdAndUpdate(
      id,
      { $push: { comments: { user: req.user.id, text } } },
      { new: true }
    ).populate('comments.user', 'fullName profilePicture');

    if (!doc) return res.status(404).json({ msg: 'Not found' });

    res.json(doc.comments.at(-1));
  } catch (err) {
    next(err);
  }
};

/* ───────────────────────── Admin Delete ───────────────────────── */
exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    const doc = await EducationContent.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ msg: 'Not found' });

    res.json({ msg: 'Deleted successfully' });
  } catch (err) {
    next(err);
  }
};




