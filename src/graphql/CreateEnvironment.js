import gql from 'graphql-tag';

// GraphQL mutation for creating a new environment
export default gql`
  mutation CreateEnvironment($data: String!, $projectId: String!, $name: String!) {
    addEnvironment(data: $data, projectId: $projectId, name: $name) {
      name
    }
  }
`;
