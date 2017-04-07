import gql from 'graphql-tag';
import graphql from './graphql';
import {encrypt} from './pgp';
import {getPublicKey} from './configuration';

const pushEnvironment = gql`
  mutation pushEnvironment($environment: String!, $name: String!) {
    push(environment: $environment, name: $name)
  }
`;

const push = async () => {
  // TODO: Encrypt real data
  const {data} = await encrypt({data: 'Hej', publicKeys: [getPublicKey()]});

  const result = await graphql.mutate({
    mutation: pushEnvironment,
    variables: {
      // TODO: Enable passing of user defined name
      name: 'test-name',
      environment: data,
    },
  });

  console.log(JSON.stringify(result.data, null, 2));
};

export default push;
