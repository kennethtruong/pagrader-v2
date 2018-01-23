# PAGrader

This is a web application to help save time grading introductory programming assignments.

<b>Brief description of the problem</b>

1. Students submitted assignments that are stored on a server
2. Tutors SSH into server, compiles and runs each program manually
3. Grades are then individually sent through email to the students and professor

This application helps solve this problem by allowing the professor to log into the application which will then internally SSH into the school's server and run my grading script on the server. The grading script will compile each of the student's program and merge the output/input into a file on the school's server. (We keep these files on the school's server because we are only using heroku's and mlab's free tier so we want to preserve as much space as possible.) Graders are then able to log into the web application and view these files while adding grades/comments that they can submit.


#Development
## Installation

    yarn

## Setup
1. Create a file at server/config/localSecrets.js
2. Add the following code replacing the values
```
module.exports = {
  db: <You can either point to a local MongoDB or use a free dev tier from https://mlab.com/>,

  sshServerInfo: (This is the SSH Server that the SSH Accounts are used on. Ask me for info or you can use your tutor account. For development I use shell.xshellz.com),

  sshTestUser: (This is the SSH Login to run SSH tests)
  sshTestPassword: (This is the SSH Password to run SSH tests)
};
```

## Local Development

    yarn start

## Building and Running Production Server

    yarn build
    yarn start

## Testing Server Code

    yarn test

## Debugging the grading script (Java / C Script)
When trying to debug infinite loop programs please verify that you don't leave any processes running

Check for the processes running by using this command

    ps aux | grep <ACCOUNT>

Kill any processes that should not be running

    kill -15 <PID>

## Contributing

Please help contribute by submitting feedback, bugs, or pull requests!

#### Plugins to install with Sublime IDE (Development)

1. Package Control
2. Babel
3. Git
4. SublimeLinter
5. SublimeLinter-contrib-eslint
