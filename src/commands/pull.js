import fs from 'fs';
import path from 'path';
import graphql from '../modules/graphql';
import {decrypt} from '../modules/pgp';
import {getPgpPassphrase} from '../modules/configuration';
import Settings from '../modules/settings';
import {projectDir} from '../modules/filesystem';
import UserError from '../modules/user-error';
import ENVIRONMENTS_QUERY from '../graphql/Environments';

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
  if (! Settings.projectId) {
    throw new UserError('no-settings-found');
  }

  try {
    // Retrieve the encrypted data
    const {data: {environments, currentUser}} = await graphql.query({
      query: ENVIRONMENTS_QUERY,
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
      throw new UserError(e.graphQLErrors[0].message);
    }
    throw e;
  }
};

export default pull;
