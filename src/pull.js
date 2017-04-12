import fs from 'fs';
import gql from 'graphql-tag';
import graphql from './graphql';
import {decrypt} from './pgp';
import {getPrivateKey, getPgpPassphrase} from './configuration';
import Settings from './settings';

const pullEnvironments = gql`
  query pullEnvironments($projectId: String!, $name: String!) {
    environments(projectId: $projectId, name: $name) {
      name
      data
    }
  }
`;

const pull = async () => {
  try {
    // Retrieve the encrypted data
    const {data: {environments}} = await graphql.query({
      query: pullEnvironments,
      variables: {
        name: Settings.env.environment,
        projectId: Settings.app.projectId,
      },
    });

    // Decode the data
    const {data: envFile} = await decrypt({
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
