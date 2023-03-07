const usersController = require('../server/controllers/usersController');
const { signup, getUser, getUserById } = usersController;

describe('signup method in usersController', () => {
  test('running with no arguments should result in error', () => {
    expect(true).toBe(false);
  });
});
