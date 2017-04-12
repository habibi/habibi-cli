import fs from 'fs';
import gql from 'graphql-tag';
import graphql from './graphql';
import {encrypt} from './pgp';
import {getPublicKey} from './configuration';
import Settings from './settings';

const pushEnvironment = gql`
  mutation pushEnvironment($environment: String!, $appId: String!, $name: String!) {
    push(environment: $environment, appId: $appId, name: $name)
  }
`;

const push = async () => {
  const envFile = fs.readFileSync('.env');
  const {data} = await encrypt({data: envFile.toString(), publicKeys: [getPublicKey()]});

  const result = await graphql.mutate({
    mutation: pushEnvironment,
    variables: {
      // TODO: Enable passing of user defined name
      name: 'test-name',
      appId: Settings.appId,
      environment: data,
    },
  });

  console.log(JSON.stringify(result.data, null, 2));
};

export default push;
