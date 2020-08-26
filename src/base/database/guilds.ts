import mongoose from 'mongoose';

const Guild = new mongoose.Schema({
  _id: String,
  prefix: { type: String, default: '!' },
  autoRole: String,
  liveRole: String,
  log: {
    channel: String,
    events: Array,
  }
});

export const guild = mongoose.model('Guilds', Guild);