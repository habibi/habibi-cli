import gql from 'graphql-tag';
import graphql from './graphql';

const push = () => {
  const query = gql`
    query {
      user {
        email
      }
    }
  `;

  graphql.query({query}).then((result) => {
    console.log(JSON.stringify(result.data, null, 2));
  });
};

export default push;
