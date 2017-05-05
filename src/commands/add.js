import fs from 'fs';
import gql from 'graphql-tag';
import graphql from '../modules/graphql';
import {encrypt} from '../modules/pgp';
import {getPublicKey} from '../modules/configuration';
import Settings from '../modules/settings';

const addEnvironment = gql`
  mutation addEnvironment($data: String!, $projectId: String!, $name: String!) {
    addEnvironment(data: $data, projectId: $projectId, name: $name) {
      name
    }
  }
`;

const push = async ({envName}) => {
  if (! envName) {
    console.error('Usage: habibi add <environment-name>');
    return;
  }
  try {
    const envFile = fs.readFileSync('.env');
    const {data} = await encrypt({data: envFile.toString(), publicKeys: [getPublicKey()]});

    await graphql.mutate({
      mutation: addEnvironment,
      variables: {
        name: envName,
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
