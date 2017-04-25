import 'isomorphic-fetch';
import {argv} from 'yargs';
import push from './push';
import pull from './pull';
import signin from './signin';
import signup from './signup';
import notImplemented from './not-implemented';
import init from './init';

switch (argv._[0]) {
  case 'init':
    init();
    break;

  case 'push':
    push({environmentName: argv._[1]});
    break;

  case 'pull':
    pull({environmentName: argv._[1]});
    break;

  case 'signup':
    signup();
    break;

  case 'signin':
    signin();
    break;

  case 'signout':
    notImplemented();
    break;

  default:
    // eslint-disable-next-line no-console
    console.error('Usage: habibi push|pull|signin');
}
