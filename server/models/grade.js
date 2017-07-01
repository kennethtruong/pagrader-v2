import mongoose from 'mongoose';

const gradeSchema = new mongoose.Schema({
  repo: String,
  assignment: String,
  grader: String,
  studentId: String,
  bonus: Boolean,
  grade: String,
  comment: String,
  errorList: String
});

// create the model for users and expose it to our app
export default mongoose.model('Grade', gradeSchema);
