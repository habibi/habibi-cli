import fs from 'fs';
import gql from 'graphql-tag';
import graphql from './graphql';
import {encrypt} from './pgp';
import {getPublicKey} from './configuration';
import Settings from './settings';

const pushEnvironment = gql`
  mutation pushEnvironment($data: String!, $projectId: String!, $name: String) {
    pushEnvironment(data: $data, projectId: $projectId, name: $name) {
      name
    }
  }
`;

const push = async ({environmentName}) => {
  try {
    const envFile = fs.readFileSync('.env');
    const {data} = await encrypt({data: envFile.toString(), publicKeys: [getPublicKey()]});

    await graphql.mutate({
      mutation: pushEnvironment,
      variables: {
        name: environmentName,
        projectId: Settings.app.projectId,
        data: data,
      },
    });
    console.log('OK');

  } catch (e) {
    if (e.graphQLErrors) {
      e.graphQLErrors.forEach((ge) => {
        console.log('ERROR', ge.message);
      });
    } else {
      console.log('ERROR', 'unknown-error');
    }
  }
};

export default push;
