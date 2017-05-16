import gql from 'graphql-tag';
import graphql from '../modules/graphql';
import Settings from '../modules/settings';
import {decrypt, encrypt} from '../modules/pgp';
import {getPgpPassphrase} from '../modules/configuration';

const environmentsQuery = gql`
  query environmentsQuery($projectId: String!, $emails: [String!]!) {
    currentUser {
      privateKey
    }
    environments(projectId: $projectId) {
      name
      data
      readAccess {
        emails
        publicKey
      }
    }
    users(emails: $emails) {
      emails
      publicKey
    }
  }
`;

const shareEnvironment = gql`
  mutation shareEnvironment(
    $data: String!,
    $projectId: String!,
    $name: String!,
    $emails: [String!]!
  ) {
    shareEnvironment(data: $data, projectId: $projectId, name: $name, emails: $emails) {
      name
    }
  }
`;

const share = async ({envName, email}) => {
  if (! envName || ! email) {
    console.error('Usage: habibi share <environment-name> <email>');
    return;
  }

  try {
    const {data: {environments, users, currentUser}} = await graphql.query({
      query: environmentsQuery,
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
      mutation: shareEnvironment,
      variables: {
        name: environment.name,
        projectId: Settings.projectId,
        data: newCiphertext,
        emails: Array.from(emails),
      },
    });
    console.log('OK');

  } catch (e) {
    console.log(e);
  }
};

export default share;
