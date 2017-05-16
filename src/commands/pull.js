import fs from 'fs';
import path from 'path';
import gql from 'graphql-tag';
import graphql from '../modules/graphql';
import {decrypt} from '../modules/pgp';
import {getPgpPassphrase} from '../modules/configuration';
import Settings from '../modules/settings';
import {projectDir} from '../modules/filesystem';

const environmentsQuery = gql`
  query environmentsQuery($projectId: String!) {
    currentUser {
      privateKey
    }
    environments(projectId: $projectId) {
      name
      data
    }
  }
`;

const decryptAndStore = async (ciphertext, fileName, privateKey) => {
  const {data: envFile} = await decrypt({
    ciphertext: ciphertext,
    privateKey: privateKey,
    password: getPgpPassphrase(),
  });

  // Store the data to the local file
  fs.writeFileSync(path.resolve(projectDir, fileName), envFile);
};

const decryptAndStoreMany = async (envList = [], privateKey) => {
  const promises = [];
  envList.forEach((e) => {
    promises.push(decryptAndStore(e.ciphertext, e.fileName, privateKey));
  });
  // Wait for promises to resolve
  return await Promise.all(promises);
};

const pull = async ({envName}) => {
  try {
    if (! Settings.projectId) {
      throw new Error('no-settings-found');
    }

    // Retrieve the encrypted data
    const {data: {environments, currentUser}} = await graphql.query({
      query: environmentsQuery,
      variables: {
        projectId: Settings.projectId,
      },
    });

    if (envName) {
      return await decryptAndStoreMany(environments.filter(e => e.name === envName).map(e => ({
        ciphertext: e.data,
        fileName: '.env',
      })), currentUser.privateKey);
    }

    if (environments.length === 1) {
      return await decryptAndStoreMany(environments.map(e => ({
        ciphertext: e.data,
        fileName: '.env',
      })), currentUser.privateKey);
    }

    console.log('You have to provide a environment name. Available names are:',
      environments.map(e => e.name).join(' '));

  } catch (e) {
    if (e.graphQLErrors) {
      e.graphQLErrors.forEach((ge) => {
        console.log('ERROR', ge.message);
      });
    } else if (e.message === 'no-settings-found') {
      console.log('ERROR', 'The .habibi.json file could not be found. Are you outside of your ' +
        'project directory perhaps?');
    } else {
      console.log('ERROR', 'unknown-error');
    }
  }
};

export default pull;
