import fs from 'fs';
import gql from 'graphql-tag';
import graphql from '../modules/graphql';
import {decrypt} from '../modules/pgp';
import {getPrivateKey, getPgpPassphrase} from '../modules/configuration';
import Settings from '../modules/settings';

const environmentsQuery = gql`
  query environmentsQuery($projectId: String!) {
    environments(projectId: $projectId) {
      name
      data
    }
  }
`;

const decryptAndStore = async (ciphertext, fileName) => {
  const {data: envFile} = await decrypt({
    ciphertext: ciphertext,
    privateKey: getPrivateKey(),
    password: getPgpPassphrase(),
  });

  // Store the data to the local file
  fs.writeFileSync(fileName, envFile);
};

const decryptAndStoreMany = async (envList = []) => {
  const promises = [];
  envList.forEach((e) => {
    promises.push(decryptAndStore(e.ciphertext, e.fileName));
  });
  // Wait for promises to resolve
  return await Promise.all(promises);
};

const pull = async ({environmentName: envName, all}) => {
  try {
    // Retrieve the encrypted data
    const {data: {environments}} = await graphql.query({
      query: environmentsQuery,
      variables: {
        projectId: Settings.app.projectId,
      },
    });

    if (envName) {
      return await decryptAndStoreMany(environments.filter(e => e.name === envName).map(e => ({
        ciphertext: e.data,
        fileName: '.env',
      })));
    }

    if (environments.length === 1) {
      return await decryptAndStoreMany(environments.map(e => ({
        ciphertext: e.data,
        fileName: '.env',
      })));
    }

    console.log('You have to provide a environment name. Available names are:',
      environments.map(e => e.name).join(' '));

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

export default pull;
