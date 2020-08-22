import mongoose from 'mongoose';

export async function init() {
  // Options
  const DatabaseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  // Connect
  mongoose.connect(process.env.DATABASE_URL!, DatabaseOptions);
  mongoose.set('useFindAndModify', false);
  mongoose.Promise = global.Promise;

  // Event listeners
  mongoose.connection.on('connected', () => {
    console.log('Database connected!');
  });

  mongoose.connection.on('err', err => {
    console.log(`Database error:\n${err.stack}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Database disconnected!');
  });
}