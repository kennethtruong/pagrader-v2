import { combineReducers } from 'redux';

import auth from './auth';
import grade from './grade';
import repo from './repo';
import assignment from './assignment';
import output from './output';

export default combineReducers({
  repo,
  auth,
  grade,
  assignment,
  studentOutput: output,
  correctOutput: output
});
