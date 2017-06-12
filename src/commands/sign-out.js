import {removeCredentials} from '../modules/configuration';

const signin = async () => {
  try {
    removeCredentials();

  } catch (e) {
    console.error(e);
  }
};

export default signin;
