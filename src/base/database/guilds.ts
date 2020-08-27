import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  _id: String,
  prefix: { type: String, default: '!' },
  autoRole: String,
  liveRole: String,
  log: {
    channel: String,
    events: Array,
  },
  customCommands: [
    {
      name: String,
      content: String
    }
  ]
});

export const guild = mongoose.model('Guilds', schema);