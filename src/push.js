import fs from 'fs';
import gql from 'graphql-tag';
import graphql from './graphql';
import {encrypt} from './pgp';
import {getPublicKey} from './configuration';
import Settings from './settings';

const pushMutation = gql`
  mutation pushMutation($environment: String!, $projectId: String!, $name: String!) {
    push(environment: $environment, projectId: $projectId, name: $name)
  }
`;

const push = async ({environmentName}) => {
  if (! environmentName) {
    console.error('Usage: habibi push <environment-name>');
    return;
  }
  try {
    const envFile = fs.readFileSync('.env');
    const {data} = await encrypt({data: envFile.toString(), publicKeys: [getPublicKey()]});

    const result = await graphql.mutate({
      mutation: pushMutation,
      variables: {
        name: environmentName,
        projectId: Settings.app.projectId,
        environment: data,
      },
    });
    console.log(JSON.stringify(result.data, null, 2));

  } catch (e) {
    console.error(e);
  }
};

export default push;
