import mongoose from 'mongoose';

const Guild = new mongoose.Schema({
  _id: String,
  prefix: { type: String, default: '!' },
  autoRole: String,
  log: {
    memberJoin: String,
    memberLeft: String
  }
});

export const guild = mongoose.model('Guild', Guild);