import 'source-map-support/register';
import 'isomorphic-fetch';
import {argv} from 'yargs';
import UserError from './modules/UserError';
import push from './commands/push';
import pull from './commands/pull';
import signin from './commands/signin';
import signup from './commands/signup';
import notImplemented from './commands/not-implemented';
import init from './commands/init';
import add from './commands/add';
import share from './commands/share';
import unshare from './commands/unshare';

(async () => {
  try {
    switch (argv._[0]) {
      case 'init':
        await init();
        break;

      case 'add':
        await add({envName: argv._[1]});
        break;

      case 'push':
        await push({envName: argv._[1]});
        break;

      case 'pull':
        await pull({envName: argv._[1]});
        break;

      case 'signup':
        await signup({email: argv._[1]});
        break;

      case 'signin':
        await signin();
        break;

      case 'signout':
        await notImplemented();
        break;

      case 'share':
        await share({envName: argv._[1], email: argv._[2]});
        break;

      case 'unshare':
        await unshare({envName: argv._[1], email: argv._[2]});
        break;

      default:
        throw new UserError('explain-usage');
    }
  } catch (e) {
    if (e instanceof UserError) {
      console.error(e.description);
    } else {
      console.error('UNKNOWN ERROR', e);
    }
  }
})();
