import fs from 'fs';
import path from 'path';
import gql from 'graphql-tag';
import graphql from '../modules/graphql';
import {encrypt} from '../modules/pgp';
import Settings from '../modules/settings';
import {projectDir} from '../modules/filesystem';

const currentUserQuery = gql`
  query currentUser {
    currentUser {
      publicKey
    }
  }
`;

const pushEnvironment = gql`
  mutation pushEnvironment($data: String!, $projectId: String!, $name: String) {
    pushEnvironment(data: $data, projectId: $projectId, name: $name) {
      name
    }
  }
`;

const push = async ({envName}) => {
  try {

    const {data: {currentUser}} = await graphql.query({
      query: currentUserQuery,
    });

    const envFile = fs.readFileSync(path.resolve(projectDir, '.env'));
    const {data} = await encrypt({data: envFile.toString(), publicKeys: [currentUser.publicKey]});

    await graphql.mutate({
      mutation: pushEnvironment,
      variables: {
        name: envName,
        projectId: Settings.projectId,
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
