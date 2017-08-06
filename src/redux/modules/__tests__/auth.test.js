import reducer, * as ducks from '../auth';

describe('Auth Tests', () => {
  describe('Actions', () => {
    // This only test synchronous actions
    test('should create an action to destroy state', () => {
      const expectedAction = {
        type: ducks.DESTROY
      };
      expect(ducks.destroy()).toEqual(expectedAction);
    });
  });

  describe('Reducers', () => {
    test('should return the initial state', () => {
      expect(reducer(undefined, {})).toEqual({
        loaded: false
      });
    });

    test('should handle login', () => {
      expect(
        reducer(
          {},
          {
            type: ducks.LOGIN
          }
        )
      ).toEqual({
        loading: true
      });

      const mockUser = {
        username: 'test'
      };
      expect(
        reducer(
          {
            loading: true
          },
          {
            type: ducks.LOGIN_SUCCESS,
            result: mockUser
          }
        )
      ).toEqual({
        loading: false,
        user: mockUser
      });

      const error = {
        message: 'Incorrect username or password'
      };
      expect(
        reducer(
          {
            loading: true
          },
          {
            type: ducks.LOGIN_FAIL,
            error: error
          }
        )
      ).toEqual({
        loading: false,
        user: null,
        error: error
      });
    });
  });
});
