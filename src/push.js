import fs from 'fs';
import os from 'os';
import path from 'path';
import gql from 'graphql-tag';
import graphql from './graphql';
import {encrypt} from './pgp';

const habibiDir = path.join(os.homedir(), '.habibi');

const pushEnvironment = gql`
  mutation pushEnvironment($environment: String!, $name: String!) {
    push(environment: $environment, name: $name)
  }
`;

const push = async () => {
  const publicKeyArmored = fs.readFileSync(path.join(habibiDir, 'public-key'));
  const {data} = await encrypt({data: 'Hej', publicKeys: [publicKeyArmored]});
  console.log(data);

  graphql.mutate({
    mutation: pushEnvironment,
    variables: {
      // TODO: Enable passing of user defined name
      name: 'test-name',
      environment: data,
    },
  }).then((result) => {
    console.log(JSON.stringify(result.data, null, 2));
  });
};

export default push;
