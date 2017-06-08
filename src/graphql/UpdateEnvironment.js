import gql from 'graphql-tag';

// GraphQL mutation for storing an updated environment
export default gql`
  mutation UpdateEnvironment($data: String!, $projectId: String!, $name: String) {
    pushEnvironment(data: $data, projectId: $projectId, name: $name) {
      name
    }
  }
`;
