import gql from 'graphql-tag';

// GraphQL query for retrieving the logged in user
export default gql`
  query CurrentUser {
    currentUser {
      publicKey
    }
  }
`;
