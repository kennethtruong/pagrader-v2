import reducer, * as ducks from '../repo';

describe('Repo Tests', () => {
  describe('Reducers', () => {
    const mockRepo = {
      name: 'CSE5 Winter 2016',
      username: 'repoUser'
    };

    test('should return the initial state', () => {
      expect(reducer(undefined, {})).toEqual({
        loaded: false
      });
    });

    test('should handle creating repo', () => {
      expect(
        reducer(
          {},
          {
            type: ducks.CONNECT
          }
        )
      ).toEqual({
        loading: true
      });

      expect(
        reducer(
          {},
          {
            type: ducks.CONNECT_SUCCESS,
            result: mockRepo
          }
        )
      ).toEqual({
        loading: false,
        repo: mockRepo
      });

      const error = {
        message: 'Repository name already taken'
      };
      expect(
        reducer(
          {},
          {
            type: ducks.CONNECT_FAIL,
            error: error
          }
        )
      ).toEqual({
        repo: null,
        loading: false,
        error: error
      });
    });

    test('should handle loading repos', () => {
      expect(
        reducer(
          {},
          {
            type: ducks.LOAD
          }
        )
      ).toEqual({
        loading: true
      });

      expect(
        reducer(
          {
            loading: true
          },
          {
            type: ducks.LOAD_SUCCESS,
            result: [mockRepo]
          }
        )
      ).toEqual({
        loaded: true,
        loading: false,
        repos: [mockRepo]
      });

      const error = {
        message: 'Error'
      };
      expect(
        reducer(
          {
            loading: true
          },
          {
            type: ducks.LOAD_FAIL,
            error: error
          }
        )
      ).toEqual({
        loaded: false,
        loading: false,
        repos: null,
        error: error
      });
    });
  });
});
