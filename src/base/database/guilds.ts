import mongoose from 'mongoose';

const Guild = new mongoose.Schema({
  _id: String,
  prefix: { type: String, default: '!' },
  autoRole: String,
});

export const guild = mongoose.model('Guild', Guild);