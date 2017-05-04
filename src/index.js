import 'isomorphic-fetch';
import {argv} from 'yargs';
import push from './push';
import pull from './pull';
import signin from './signin';
import signup from './signup';
import notImplemented from './not-implemented';
import init from './init';
import add from './add';

// console.log(argv);

switch (argv._[0]) {
  case 'init':
    init();
    break;

  case 'add':
    add({environmentName: argv._[1]});
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
