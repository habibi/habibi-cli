import gql from 'graphql-tag';
import graphql from '../modules/graphql';
import Settings from '../modules/settings';
import {recrypt} from '../modules/pgp';
import {getPgpPassphrase} from '../modules/configuration';
import UserError from '../modules/UserError';

const environmentsQuery = gql`
  query environmentsQuery($projectId: String!) {
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

const unshare = async ({envName, email}) => {
  if (! envName || ! email) {
    throw new UserError('explain-usage-unshare');
  }

  try {
    // Retrieve the environments and the current user
    const {data: {environments, currentUser}} = await graphql.query({
      query: environmentsQuery,
      variables: {
        projectId: Settings.projectId,
      },
    });

    // Get the selected environment
    const environment = environments.find(e => e.name === envName);
    if (! environment) {
      throw new Error('environment-not-found');
    }

    // Remove the user to be unshared from the list
    const usersWithReadAccess = environment.readAccess.filter(e => ! e.emails.includes(email));

    // Change the public keys to only include keys for users the env is shared with
    const newCiphertext = await recrypt({
      ciphertext: environment.data,
      privateKey: currentUser.privateKey,
      password: getPgpPassphrase(),
      publicKeys: usersWithReadAccess.map(e => e.publicKey),
    });

    // Update the server
    await graphql.mutate({
      mutation: shareEnvironment,
      variables: {
        name: environment.name,
        projectId: Settings.projectId,
        data: newCiphertext,
        emails: usersWithReadAccess.map(user => user.emails[0]),
      },
    });
    console.log('OK');

  } catch (e) {
    throw e;
  }
};

export default unshare;
