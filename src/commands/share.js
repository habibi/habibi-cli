import gql from 'graphql-tag';
import graphql from '../modules/graphql';
import Settings from '../modules/settings';

const shareEnvironment = gql`
  mutation shareEnvironment($projectId: String!, $name: String!, $email: String!) {
    shareEnvironment(projectId: $projectId, name: $name, email: $email) {
      name
    }
  }
`;

const share = async ({envName, email}) => {
  if (! envName || ! email) {
    console.error('Usage: habibi share <environment-name> <email>');
    return;
  }
  const result = await graphql.mutate({
    mutation: shareEnvironment,
    variables: {
      name: envName,
      projectId: Settings.app.projectId,
      email: email,
    },
  });
  console.log('OK', result);
  console.log(envName, email);
};

export default share;
