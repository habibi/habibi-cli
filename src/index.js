import 'source-map-support/register';
import 'isomorphic-fetch';
import {argv} from 'yargs';
import UserError from './modules/user-error';
import push from './commands/push';
import pull from './commands/pull';
import signIn from './commands/sign-in';
import signUp from './commands/sign-up';
import signOut from './commands/sign-out';
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
        await signUp({email: argv._[1]});
        break;

      case 'signin':
        await signIn({email: argv._[1]});
        break;

      case 'signout':
        await signOut();
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
