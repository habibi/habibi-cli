import graphql from '../modules/graphql';
import Settings from '../modules/settings';
import {decrypt, encrypt} from '../modules/pgp';
import {getPgpPassphrase} from '../modules/configuration';
import UserError from '../modules/user-error';
import SHARE_ENVIRONMENT_MUTATION from '../graphql/ShareEnvironment';
import ENVIRONMENTS_QUERY from '../graphql/EnvironmentsShare';

const share = async ({envName, email}) => {
  if (! envName || ! email) {
    throw new UserError('explain-usage-share');
  }

  try {
    const {data: {environments, users, currentUser}} = await graphql.query({
      query: ENVIRONMENTS_QUERY,
      variables: {
        projectId: Settings.projectId,
        emails: [email],
      },
    });

    const environment = environments.find(e => e.name === envName);

    if (! environment) {
      throw new Error('environment-not-found');
    }

    if (! users || ! users.length) {
      throw new Error('user-not-found');
    }

    // Using Set to omit any duplicate keys
    const publicKeys = new Set(environment.readAccess.map(e => e.publicKey));
    users.forEach(e => publicKeys.add(e.publicKey));

    const {data: plaintext} = await decrypt({
      ciphertext: environment.data,
      privateKey: currentUser.privateKey,
      password: getPgpPassphrase(),
    });

    const {data: newCiphertext} = await encrypt({
      data: plaintext.toString(),
      publicKeys: Array.from(publicKeys),
    });

    const emails = new Set(environment.readAccess.map(user => user.emails[0]));
    emails.add(email);

    await graphql.mutate({
      mutation: SHARE_ENVIRONMENT_MUTATION,
      variables: {
        name: environment.name,
        projectId: Settings.projectId,
        data: newCiphertext,
        emails: Array.from(emails),
      },
    });
    console.log('OK');

  } catch (e) {
    throw e;
  }
};

export default share;
