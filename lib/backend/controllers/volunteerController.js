import Volunteer from '../models/Volunteer.js';

export const getVolunteers = async (req, res) => {
  const volunteers = await Volunteer.find().sort({ createdAt: -1 });
  res.json(volunteers);
};

export const createVolunteer = async (req, res) => {
  const newVolunteer = new Volunteer(req.body);
  await newVolunteer.save();
  res.status(201).json(newVolunteer);
};

export const deleteVolunteer = async (req, res) => {
  await Volunteer.findByIdAndDelete(req.params.id);
  res.json({ message: 'Volunteer deleted' });
};
