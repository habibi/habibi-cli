import gql from 'graphql-tag';

// GraphQL query for retrieving the current user and environments
export default gql`
  query EnvironmentsQuery($projectId: String!) {
    currentUser {
      privateKey
    }
    environments(projectId: $projectId) {
      name
      data
    }
  }
`;
