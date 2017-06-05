export default class UserError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UserError';
    this.description = UserError.messages[message];

    if (! this.description) {
      throw new Error('missing-error-description--' + message);
    }
  }

  static messages = {
    'explain-usage':
      'Usage: habibi init|add|push|pull|share|unshare|signup|signin|signout',

    'explain-usage-add':
      'Usage: habibi add <environment-name>',

    'explain-usage-share':
      'Usage: habibi share <environment-name> <email>',

    'explain-usage-unshare':
      'Usage: habibi unshare <environment-name> <email>',

    'explain-usage-signup':
      'Usage: habibi signup <email>',

    'no-settings-found':
      'The .habibi.json file could not be found. Are you outside of your project directory ' +
      'perhaps?',

    'project-exists':
      'This project already have an .habibi.json file, will do nothing.',

    'environment-name-exists':
      'The environment already exists, consider using \'habibi push\' instead.',

    'duplicate-email':
      'There is already a user with the email you provided, try signing in instead.',

    'invalid-email':
      'Email must be valid and only lower case letters are allowed.',
  }
}
