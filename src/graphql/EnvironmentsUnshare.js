import gql from 'graphql-tag';

export default gql`
  query EnvironmentsUnshareQuery($projectId: String!) {
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
