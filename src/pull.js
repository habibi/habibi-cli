import fs from 'fs';
import gql from 'graphql-tag';
import graphql from './graphql';
import {decrypt} from './pgp';
import {getPrivateKey, getPgpPassphrase} from './configuration';

const pullEnvironments = gql`
  query pullEnvironments {
    environments {
      name
      data
    }
  }
`;

const pull = async () => {
  try {
    // Retrieve the encrypted data
    const {data: {environments}} = await graphql.query({query: pullEnvironments});

    // Decode the data
    const {data: envFile} = await decrypt({
      // TODO: Enable fetching of a single environment
      ciphertext: environments[0].data,
      privateKey: getPrivateKey(),
      password: getPgpPassphrase(),
    });

    // Store the data to the local file
    fs.writeFileSync('.env', envFile);

  } catch (e) {
    console.error(e);
  }
};

export default pull;
