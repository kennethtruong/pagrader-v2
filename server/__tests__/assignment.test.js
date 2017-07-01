import { create, update, load } from '../actions/assignment';
import mongoose from 'mongoose';
import secrets from '../config/secrets';
import Assignment from '../models/assignment';

describe('Assignment API', () => {
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
    mongoose.disconnect();
    done();
  });

  const MOCK_ASSIGNMENT = {
    repo: 'cs7s10',
    input: 'B\n1900\n3.3\n\nA\n2000\n2.2\n',
    name: 'PA1',
    path: '/home/linux/ieng6/cs7s/cs7s10/GRADER/PA1/',
    bonusDate: '1/24/1991 12:00'
  };
  test('should create assignment', done => {
    expect.assertions(10);
    create({
      body: MOCK_ASSIGNMENT
    })
      .then(res => {
        expect(res.repo).toEqual(MOCK_ASSIGNMENT.repo);
        expect(res.input).toEqual(MOCK_ASSIGNMENT.input);
        expect(res.name).toEqual(MOCK_ASSIGNMENT.name);
        expect(res.path).toEqual(MOCK_ASSIGNMENT.path);
        expect(res.bonusDate).toEqual(MOCK_ASSIGNMENT.bonusDate);

        Assignment.findOne(
          {
            repo: MOCK_ASSIGNMENT.repo,
            name: MOCK_ASSIGNMENT.name
          },
          (err, assignment) => {
            expect(assignment.repo).toEqual(MOCK_ASSIGNMENT.repo);
            expect(assignment.input).toEqual(MOCK_ASSIGNMENT.input);
            expect(assignment.name).toEqual(MOCK_ASSIGNMENT.name);
            expect(assignment.path).toEqual(MOCK_ASSIGNMENT.path);
            expect(assignment.bonusDate).toEqual(MOCK_ASSIGNMENT.bonusDate);
            done();
          }
        );
      })
      .catch(done);
  });

  test('should give error for duplicate name', () => {
    return expect(
      create({
        body: MOCK_ASSIGNMENT
      })
    ).rejects.toEqual({
      message: 'Assignment name already taken for this repository.'
    });
  });

  const NEW_REPO_ASSIGNMENT = {
    repo: 'cs7s11',
    input: 'B\n1900\n3.3\n\nA\n2000\n2.2\n',
    name: 'PA1',
    path: '/home/linux/ieng6/cs7s/cs7s10/GRADER/PA1/',
    bonusDate: '1/24/1991 12:00'
  };
  test('should be able to create new assignment in separate repo', done => {
    expect.assertions(10);
    create({
      body: NEW_REPO_ASSIGNMENT
    })
      .then(res => {
        expect(res.repo).toEqual(NEW_REPO_ASSIGNMENT.repo);
        expect(res.input).toEqual(NEW_REPO_ASSIGNMENT.input);
        expect(res.name).toEqual(NEW_REPO_ASSIGNMENT.name);
        expect(res.path).toEqual(NEW_REPO_ASSIGNMENT.path);
        expect(res.bonusDate).toEqual(NEW_REPO_ASSIGNMENT.bonusDate);

        Assignment.findOne(
          {
            repo: NEW_REPO_ASSIGNMENT.repo,
            name: NEW_REPO_ASSIGNMENT.name
          },
          (err, assignment) => {
            expect(assignment.repo).toEqual(NEW_REPO_ASSIGNMENT.repo);
            expect(assignment.input).toEqual(NEW_REPO_ASSIGNMENT.input);
            expect(assignment.name).toEqual(NEW_REPO_ASSIGNMENT.name);
            expect(assignment.path).toEqual(NEW_REPO_ASSIGNMENT.path);
            expect(assignment.bonusDate).toEqual(NEW_REPO_ASSIGNMENT.bonusDate);
            done();
          }
        );
      })
      .catch(done);
  });

  const NEW_INPUT = 'B\n1900\n3.3\n\nA\n2000\n2.2\nx\n';
  test('should update assignment only input', done => {
    expect.assertions(2);
    update({
      body: {
        name: MOCK_ASSIGNMENT.name,
        repo: MOCK_ASSIGNMENT.repo,
        input: NEW_INPUT
      }
    })
      .then(res => {
        expect(res.input).toEqual(NEW_INPUT);

        Assignment.findOne(
          {
            name: MOCK_ASSIGNMENT.name
          },
          (findErr, updatedAssignment) => {
            if (findErr) {
              done(findErr);
            }

            expect(updatedAssignment.input).toEqual(NEW_INPUT);
            done();
          }
        );
      })
      .catch(done);
  });

  const NEW_BONUS = '1/24/1991 6:00';
  test('should update assignment only bonusDate', done => {
    expect.assertions(2);
    update({
      body: {
        name: MOCK_ASSIGNMENT.name,
        repo: MOCK_ASSIGNMENT.repo,
        bonusDate: NEW_BONUS
      }
    })
      .then(res => {
        expect(res.bonusDate).toEqual(NEW_BONUS);

        Assignment.findOne(
          {
            name: MOCK_ASSIGNMENT.name
          },
          (findErr, updatedAssignment) => {
            if (findErr) {
              done(findErr);
            }

            expect(updatedAssignment.bonusDate).toEqual(NEW_BONUS);
            done();
          }
        );
      })
      .catch(done);
  });

  test('should update assignment', done => {
    expect.assertions(4);
    update({
      body: {
        name: MOCK_ASSIGNMENT.name,
        repo: MOCK_ASSIGNMENT.repo,
        input: MOCK_ASSIGNMENT.input,
        bonusDate: MOCK_ASSIGNMENT.bonusDate
      }
    })
      .then(res => {
        expect(res.input).toEqual(MOCK_ASSIGNMENT.input);
        expect(res.bonusDate).toEqual(MOCK_ASSIGNMENT.bonusDate);

        Assignment.findOne(
          {
            name: MOCK_ASSIGNMENT.name
          },
          (findErr, updatedAssignment) => {
            if (findErr) {
              done(findErr);
            }

            expect(updatedAssignment.input).toEqual(MOCK_ASSIGNMENT.input);
            expect(updatedAssignment.bonusDate).toEqual(
              MOCK_ASSIGNMENT.bonusDate
            );
            done();
          }
        );
      })
      .catch(done);
  });

  test('should list all assignment in repo', done => {
    expect.assertions(6);
    load({}, [MOCK_ASSIGNMENT.repo])
      .then(res => {
        expect(res.length).toEqual(1);
        expect(res[0].repo).toEqual(MOCK_ASSIGNMENT.repo);
        expect(res[0].name).toEqual(MOCK_ASSIGNMENT.name);
        expect(res[0].path).toEqual(MOCK_ASSIGNMENT.path);
        expect(res[0].input).toEqual(MOCK_ASSIGNMENT.input);
        expect(res[0].bonusDate).toEqual(MOCK_ASSIGNMENT.bonusDate);
        done();
      })
      .catch(done);
  });

  test('should load one assignment', done => {
    expect.assertions(5);
    load({}, [MOCK_ASSIGNMENT.repo, MOCK_ASSIGNMENT.name])
      .then(res => {
        expect(res.repo).toEqual(MOCK_ASSIGNMENT.repo);
        expect(res.name).toEqual(MOCK_ASSIGNMENT.name);
        expect(res.path).toEqual(MOCK_ASSIGNMENT.path);
        expect(res.input).toEqual(MOCK_ASSIGNMENT.input);
        expect(res.bonusDate).toEqual(MOCK_ASSIGNMENT.bonusDate);
        done();
      })
      .catch(done);
  });

  const WRONG_ASSIGNMENT = 'NONE';
  test('should not load any assignments', () => {
    return expect(
      load({}, [MOCK_ASSIGNMENT.repo, WRONG_ASSIGNMENT])
    ).resolves.toEqual(null);
  });
});
