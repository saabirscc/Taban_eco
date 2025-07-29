import Setting from '../models/Setting.js';

export const getAllSettings = async (req, res) => {
  const settings = await Setting.find();
  res.json(settings);
};

export const updateSetting = async (req, res) => {
  const { key } = req.params;
  const { value } = req.body;
  const updated = await Setting.findOneAndUpdate({ key }, { value }, { new: true, upsert: true });
  res.json(updated);
};
