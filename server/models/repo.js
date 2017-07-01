import mongoose from 'mongoose';

const repoSchema = new mongoose.Schema({
  username: String,
  description: String,
  language: String
});

// create the model for users and expose it to our app
export default mongoose.model('Repo', repoSchema);
