import fs from 'fs';
import gql from 'graphql-tag';
import graphql from './graphql';
import {encrypt} from './pgp';
import {getPublicKey} from './configuration';
import Settings from './settings';

const pushEnvironment = gql`
  mutation pushEnvironment($environment: String!, $projectId: String!, $name: String!) {
    push(environment: $environment, projectId: $projectId, name: $name)
  }
`;

const push = async () => {
  const envFile = fs.readFileSync('.env');
  const {data} = await encrypt({data: envFile.toString(), publicKeys: [getPublicKey()]});

  const result = await graphql.mutate({
    mutation: pushEnvironment,
    variables: {
      name: Settings.env.environment,
      projectId: Settings.app.projectId,
      environment: data,
    },
  });

  console.log(JSON.stringify(result.data, null, 2));
};

export default push;
