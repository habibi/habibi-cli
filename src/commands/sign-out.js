import {storeApiToken, storePgpPassphrase} from '../modules/configuration';

const signin = async () => {
  try {
    storeApiToken(null);
    storePgpPassphrase(null);

  } catch (e) {
    console.error(e);
  }
};

export default signin;
