import { create, load } from '../actions/repo';
import mongoose from 'mongoose';
import secrets from '../config/secrets';
import Repo from '../models/repo';

// These can only be ran if we have an ssh server to run the tests on
describe('createRepo', () => {
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
    for (const collection in mongoose.connection.collections) {
      if (mongoose.connection.collections[collection]) {
        mongoose.connection.collections[collection].remove(() => {});
      }
    }
    mongoose.disconnect();
    done();
  });

  const mockRepo = {
    username: secrets.sshTestInfo.split(':')[0],
    password: secrets.sshTestInfo.split(':')[1],
    description: 'CSE5 Winter 2015',
    language: 'c'
  };
  test('should create repo', () => {
    expect.assertions(6);
    return create({
      body: mockRepo
    }).then(res => {
      expect(res.username).toBe(mockRepo.username);
      expect(res.language).toBe(mockRepo.language);
      expect(res.path).toBeTruthy();

      return Repo.findOne({ username: mockRepo.username }).then(repo => {
        expect(repo.username).toBe(mockRepo.username);
        expect(repo.description).toBe(mockRepo.description);
        expect(repo.language).toBe(mockRepo.language);
      });
    });
  });

  test('should give error for duplicate repo', () => {
    return expect(
      create({
        body: mockRepo
      })
    ).rejects.toEqual({
      message: 'Repository already created for SSH Username'
    });
  });

  // TODO: Need to mock SSH for tests
  test('should give list of repo', done => {
    expect.assertions(4);
    load()
      .then(res => {
        expect(res.length).toBe(1);
        expect(res[0].username).toBe(mockRepo.username);
        expect(res[0].description).toBe(mockRepo.description);
        expect(res[0].language).toBe(mockRepo.language);
        done();
      })
      .catch(done);
  });
});
