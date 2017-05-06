import gql from 'graphql-tag';
import graphql from '../modules/graphql';
import Settings from '../modules/settings';

const shareEnvironment = gql`
  mutation shareEnvironment($projectId: String!, $name: String!, $email: String!) {
    shareEnvironment(projectId: $projectId, name: $name, email: $email) {
      name
      readAccess
    }
  }
`;

const publicKeysQuery = gql`
query publicKeysQuery($emails: [String!]!) {
  users(emails: $emails) {
    emails
    publicKey
  }
}
`;

const share = async ({envName, email}) => {
  if (! envName || ! email) {
    console.error('Usage: habibi share <environment-name> <email>');
    return;
  }

  try {
    const result = await graphql.mutate({
      mutation: shareEnvironment,
      variables: {
        name: envName,
        projectId: Settings.projectId,
        email: email,
      },
    });
    const emails = result.data.shareEnvironment.readAccess;

    const resultz = await graphql.query({
      query: publicKeysQuery,
      variables: {
        emails,
      },
    });
    console.log('OK2', resultz.data.users);
  } catch (e) {
    console.log('x', e);
  }

};

export default share;
