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

    const {data: {environments}} = await graphql.query({query: pullEnvironments});
    console.log(JSON.stringify(environments, null, 2));

    const result = await decrypt({
      ciphertext: environments[0].data,
      privateKey: getPrivateKey(),
      password: getPgpPassphrase(),
    });

    console.log(result);
  } catch (e) {
    console.error(e);
  }
  // fs.writeFileSync('./.env', html);
};

export default pull;
