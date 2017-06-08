import gql from 'graphql-tag';

// GraphQL mutation for creating a user
export default gql`
  mutation SignUpMutation(
    $email: String!,
    $password: String!,
    $privateKey: String!,
    $publicKey: String!
  ) {
    createUser(
      email: $email,
      password: $password,
      privateKey: $privateKey,
      publicKey: $publicKey,
    )
  }
`;
