import gql from 'graphql-tag';
import graphql from './graphql';

const pullEnvironments = gql`
  query pullEnvironments {
    environments {
      name
      data
    }
  }
`;

const pull = () => {

  graphql.query({
    query: pullEnvironments,
  }).then((result) => {
    console.log(JSON.stringify(result.data, null, 2));
    // TODO: Decrypt data and store to file
    // fs.writeFileSync('./.env', html);
  });
};

export default pull;
