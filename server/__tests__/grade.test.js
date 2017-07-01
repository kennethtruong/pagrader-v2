import { save, getStudents, saveStudents } from '../actions/grade';
import mongoose from 'mongoose';
import secrets from '../config/secrets';
import Grade from '../models/grade';

describe('Grade API', () => {
  beforeAll(done => {
    mongoose.connect(secrets.db, dbErr => {
      if (dbErr) {
        done(dbErr);
      } else {
        for (const collection in mongoose.connection.collections) {
          if (mongoose.connection.collections[collection]) {
            mongoose.connection.collections[collection].remove(() => {});
          }
        }
        done();
      }
    });
  });

  afterAll(done => {
    // Clean up after finished with tests
    for (const collection in mongoose.connection.collections) {
      if (mongoose.connection.collections[collection]) {
        mongoose.connection.collections[collection].remove(() => {});
      }
    }

    mongoose.disconnect();
    done();
  });

  const MOCK_STUDENTS = {
    assignmentId: 'PA1',
    repoId: 'cs7s10',
    students: [
      { studentId: 'cs7uaa', graderId: 'cs7u2' },
      { studentId: 'cs7uac', graderId: 'cs7u2' }
    ],
    bonusList: ['cs7uaa', 'cs7uac']
  };
  test('should createAll grades', done => {
    expect.assertions(3);
    saveStudents({
      body: MOCK_STUDENTS
    })
      .then(() => {
        Grade.find(
          {
            assignment: MOCK_STUDENTS.assignmentId,
            repo: MOCK_STUDENTS.repoId
          },
          (err, docs) => {
            if (err) {
              return done(err);
            }
            expect(docs.length).toEqual(MOCK_STUDENTS.students.length);
            expect(docs[0].bonus).toEqual(true);
            expect(docs[1].bonus).toEqual(true);
            done();
          }
        );
      })
      .catch(done);
  });

  test('should list all students', done => {
    expect.assertions(1);
    getStudents({}, [
      MOCK_STUDENTS.repoId,
      MOCK_STUDENTS.assignmentId,
      MOCK_STUDENTS.students[0].graderId
    ])
      .then(students => {
        expect(students.length).toEqual(MOCK_STUDENTS.students.length);
        done();
      })
      .catch(done);
  });

  const MOCK_GRADE = {
    assignment: 'PA1',
    repo: 'cs7s10',
    studentId: 'cs7uaa',
    grade: '10',
    comment: '1\n2\n'
  };
  test('should update grade', done => {
    expect.assertions(5);
    save({
      body: MOCK_GRADE
    })
      .then(() => {
        Grade.findOne(
          {
            assignment: MOCK_GRADE.assignment,
            repo: MOCK_GRADE.repo,
            studentId: MOCK_GRADE.studentId
          },
          (err, res) => {
            if (err) {
              return done(err);
            }

            expect(res.grade).toEqual(MOCK_GRADE.grade);
            expect(res.comment).toEqual(MOCK_GRADE.comment);
            expect(res.studentId).toEqual(MOCK_GRADE.studentId);
            expect(res.assignment).toEqual(MOCK_GRADE.assignment);
            expect(res.repo).toEqual(MOCK_GRADE.repo);
            done();
          }
        );
      })
      .catch(done);
  });

  const UPDATED_GRADE = {
    assignment: 'PA1',
    repo: 'cs7s10',
    studentId: 'cs7uaa',
    grade: '5',
    comment: 'Output does not match'
  };
  test('should update grade again', done => {
    expect.assertions(5);
    save({
      body: UPDATED_GRADE
    })
      .then(() => {
        Grade.findOne(
          {
            assignment: UPDATED_GRADE.assignment,
            repo: UPDATED_GRADE.repo,
            studentId: UPDATED_GRADE.studentId
          },
          (err, res) => {
            if (err) {
              return done(err);
            }

            expect(res.grade).toEqual(UPDATED_GRADE.grade);
            expect(res.comment).toEqual(UPDATED_GRADE.comment);
            expect(res.studentId).toEqual(UPDATED_GRADE.studentId);
            expect(res.assignment).toEqual(UPDATED_GRADE.assignment);
            expect(res.repo).toEqual(UPDATED_GRADE.repo);
            done();
          }
        );
      })
      .catch(done);
  });

  const NEW_MOCK_STUDENTS = {
    assignmentId: 'PA1',
    repoId: 'cs7s10',
    students: [
      { studentId: 'cs7uaa', graderId: 'cs7u2' },
      { studentId: 'cs7uac', graderId: 'cs7u2' },
      { studentId: 'cs7uag', graderId: 'cs7u3' },
      { studentId: 'cs7uah', graderId: 'cs7u3' }
    ],
    bonusList: ['cs7uaa', 'cs7uac']
  };
  test('should create grades again but keep previous updates', done => {
    expect.assertions(11);
    saveStudents({
      body: NEW_MOCK_STUDENTS
    })
      .then(() => {
        Grade.findOne(
          {
            assignment: UPDATED_GRADE.assignment,
            repo: UPDATED_GRADE.repo,
            studentId: UPDATED_GRADE.studentId
          },
          (updateErr, res) => {
            if (updateErr) {
              return done(updateErr);
            }

            expect(res.bonus).toEqual(true);
            expect(res.grade).toEqual(UPDATED_GRADE.grade);
            expect(res.comment).toEqual(UPDATED_GRADE.comment);
            expect(res.studentId).toEqual(UPDATED_GRADE.studentId);
            expect(res.assignment).toEqual(UPDATED_GRADE.assignment);
            expect(res.repo).toEqual(UPDATED_GRADE.repo);

            Grade.find(
              {
                assignment: NEW_MOCK_STUDENTS.assignmentId,
                repo: NEW_MOCK_STUDENTS.repoId
              },
              (err, docs) => {
                if (err) {
                  return done(err);
                }

                expect(docs[0].bonus).toEqual(true);
                expect(docs[1].bonus).toEqual(true);
                expect(docs[2].bonus).toEqual(false);
                expect(docs[3].bonus).toEqual(false);
                expect(docs.length).toEqual(NEW_MOCK_STUDENTS.students.length);
                done();
              }
            );
          }
        );
      })
      .catch(done);
  });

  const NEW_MOCK_BONUS_STUDENTS = {
    assignmentId: 'PA1',
    repoId: 'cs7s10',
    students: [
      { studentId: 'cs7uaa', graderId: 'cs7u2' },
      { studentId: 'cs7uac', graderId: 'cs7u2' },
      { studentId: 'cs7uag', graderId: 'cs7u3' },
      { studentId: 'cs7uah', graderId: 'cs7u3' }
    ],
    bonusList: ['cs7uag']
  };
  test('should create grades again but bonusList is updated', done => {
    expect.assertions(11);
    saveStudents({
      body: NEW_MOCK_BONUS_STUDENTS
    })
      .then(() => {
        Grade.findOne(
          {
            assignment: UPDATED_GRADE.assignment,
            repo: UPDATED_GRADE.repo,
            studentId: UPDATED_GRADE.studentId
          },
          (updateErr, res) => {
            if (updateErr) {
              return done(updateErr);
            }

            expect(res.bonus).toEqual(false);
            expect(res.grade).toEqual(UPDATED_GRADE.grade);
            expect(res.comment).toEqual(UPDATED_GRADE.comment);
            expect(res.studentId).toEqual(UPDATED_GRADE.studentId);
            expect(res.assignment).toEqual(UPDATED_GRADE.assignment);
            expect(res.repo).toEqual(UPDATED_GRADE.repo);

            Grade.find(
              {
                assignment: NEW_MOCK_BONUS_STUDENTS.assignmentId,
                repo: NEW_MOCK_BONUS_STUDENTS.repoId
              },
              (err, docs) => {
                if (err) {
                  return done(err);
                }
                expect(docs.length).toEqual(
                  NEW_MOCK_BONUS_STUDENTS.students.length
                );

                expect(docs[0].bonus).toEqual(false);
                expect(docs[1].bonus).toEqual(false);
                expect(docs[2].bonus).toEqual(true);
                expect(docs[3].bonus).toEqual(false);
                done();
              }
            );
          }
        );
      })
      .catch(done);
  });

  const NEW_MOCK_GRADE = {
    assignment: 'PA1',
    repo: 'cs7s10',
    studentId: 'cs7uag',
    grade: '10',
    comment: 'This is a test\n2!\n'
  };
  test('should update grade', done => {
    expect.assertions(5);
    save({
      body: NEW_MOCK_GRADE
    })
      .then(() => {
        Grade.findOne(
          {
            assignment: NEW_MOCK_GRADE.assignment,
            repo: NEW_MOCK_GRADE.repo,
            studentId: NEW_MOCK_GRADE.studentId
          },
          (err, res) => {
            if (err) {
              return done(err);
            }

            expect(res.grade).toEqual(NEW_MOCK_GRADE.grade);
            expect(res.comment).toEqual(NEW_MOCK_GRADE.comment);
            expect(res.studentId).toEqual(NEW_MOCK_GRADE.studentId);
            expect(res.assignment).toEqual(NEW_MOCK_GRADE.assignment);
            expect(res.repo).toEqual(NEW_MOCK_GRADE.repo);
            done();
          }
        );
      })
      .catch(done);
  });
});
