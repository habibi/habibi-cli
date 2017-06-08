import gql from 'graphql-tag';

// GraphQL query for retrieving the current user, environments and users
export default gql`
  query EnvironmentsShareQuery($projectId: String!, $emails: [String!]!) {
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
