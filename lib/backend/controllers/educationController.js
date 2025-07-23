const path = require('path');
const EducationContent = require('../models/EducationContent');
const User = require('../models/User');

/* ───────── Admin: upload ───────── */
exports.create = async (req, res, next) => {
  try {
    if (!req.files?.file) return res.status(400).json({msg:'file is required'});
    const { title, description, kind } = req.body;
    if (!title || !kind) return res.status(400).json({msg:'title & kind required'});

    const f = req.files.file[0];
    const url = `${req.protocol}://${req.get('host')}/uploads/${path.basename(f.filename)}`;
    const thumb = kind === 'video' && req.files.thumb
      ? `${req.protocol}://${req.get('host')}/uploads/${path.basename(req.files.thumb[0].filename)}`
      : undefined;

    const doc = await EducationContent.create({
      title, description, kind,
      fileUrl: url,
      thumbUrl: thumb,
      uploadedBy: req.user.id
    });
    res.status(201).json(doc);
  } catch (err) { next(err); }
};

/* ───────── Public: list ───────── */
exports.list = async (_req, res, next) => {
  try {
    const items = await EducationContent
      .find()
      .sort({ createdAt: -1 })
      .populate('uploadedBy','fullName');
    res.json(items);
  } catch (err) { next(err); }
};

/* ───────── Public: like / unlike ───────── */
exports.toggleLike = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doc = await EducationContent.findById(id);
    if (!doc) return res.status(404).json({msg:'Not found'});
    const u = req.user.id;
    const liked = doc.likes.map(String).includes(u);
    liked
      ? doc.likes.pull(u)
      : doc.likes.push(u);
    await doc.save();
    res.json({ liked: !liked, likes: doc.likes.length });
  } catch (err) { next(err); }
};

/* ───────── Public: comment ───────── */
exports.addComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    if (!text) return res.status(400).json({msg:'text required'});
    const doc = await EducationContent.findByIdAndUpdate(
      id,
      { $push:{ comments:{ user:req.user.id, text } } },
      { new:true }
    ).populate('comments.user','fullName profilePicture');
    if (!doc) return res.status(404).json({msg:'Not found'});
    res.json(doc.comments.at(-1));   // Return just the newly added comment
  } catch (err) { next(err); }
};
