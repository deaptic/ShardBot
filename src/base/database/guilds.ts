import mongoose from 'mongoose';

const Guild = new mongoose.Schema({
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
      content: String,
      triggers: [String]
    }
  ]
});

export const guild = mongoose.model('Guilds', Guild);