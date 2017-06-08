import graphql from '../modules/graphql';
import RegEx from '../modules/regex';
import {generateSignUpHash} from '../modules/crypto';
// import {getPgpPassphrase, getApiToken} from './configuration';
import {storeApiToken, storePgpPassphrase} from '../modules/configuration';
import prompt from '../modules/prompt';
import SIGN_IN_USER_MUTATION from '../graphql/SignInUser';

const schema = {
  properties: {
    email: {
      pattern: RegEx.email,
      message: 'Email must be valid and only lower case letters are allowed',
      required: true,
    },
    password: {
      hidden: true,
      required: true,
    },
  },
};

const signin = async () => {
  try {
    const input  = await prompt(schema);

    const {data} = await graphql.mutate({
      variables: {
        email: input.email,
        password: generateSignUpHash(input.password),
      },
      mutation: SIGN_IN_USER_MUTATION,
    });

    console.log(JSON.stringify(data, null, 2));

    storeApiToken(data.signIn);
    storePgpPassphrase(input.password);

  } catch (e) {
    console.error(e);
  }
};

export default signin;
