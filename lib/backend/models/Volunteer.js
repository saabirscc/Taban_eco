import mongoose from 'mongoose';

const VolunteerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  skills: [String],
  availability: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Volunteer', VolunteerSchema);
