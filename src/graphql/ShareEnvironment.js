import gql from 'graphql-tag';

export default gql`
  mutation ShareEnvironment(
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
