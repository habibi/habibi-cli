import 'isomorphic-fetch';
import {argv} from 'yargs';
import push from './push';
import pull from './pull';
import login from './login';
import signup from './signup';
import notImplemented from './not-implemented';

switch (argv._[0]) {
  case 'push':
    push();
    break;

  case 'pull':
    pull();
    break;

  case 'init':
    notImplemented();
    break;

  case 'signup':
    signup();
    break;

  case 'signin':
    login();
    break;

  case 'signout':
    notImplemented();
    break;

  default:
    // eslint-disable-next-line no-console
    console.error('Usage: habibi push|pull|login');
}
