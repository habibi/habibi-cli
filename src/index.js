import 'isomorphic-fetch';
import {argv} from 'yargs';
import push from './commands/push';
import pull from './commands/pull';
import signin from './commands/signin';
import signup from './commands/signup';
import notImplemented from './commands/not-implemented';
import init from './commands/init';
import add from './commands/add';

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
