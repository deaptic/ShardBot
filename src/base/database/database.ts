import mongoose from 'mongoose';

const Guild = new mongoose.Schema({
  _id: String,
  prefix: { type: String, default: '!' }
});

export const guild = mongoose.model('Guild', Guild);