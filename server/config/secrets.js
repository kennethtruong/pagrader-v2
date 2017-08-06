var fs = require('fs');
var path = require('path');
if (fs.existsSync(path.resolve(__dirname, 'localSecrets.js'))) {
  const secrets = require('./localSecrets.js');
  secrets.session = 'Your session secret goes here';
  module.exports = secrets;
} else {
  module.exports = {
    db: process.env.MONGOLAB_URI || 'mongodb://localhost/autograder',

    session: process.env.SESSION_SECRET || 'Your session secret goes here',

    sshServerInfo: process.env.SSH_SERVER_INFO || 'ieng6.ucsd.edu',

    sshTestInfo: process.env.SSH_TEST_INFO
  };
}
