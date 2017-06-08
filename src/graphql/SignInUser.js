import gql from 'graphql-tag';

// GraphQL mutation for signing in a user
export default gql`
  mutation SignInMutation($email: String!, $password: String!) {
    signIn(email: $email, password: $password)
  }
`;
