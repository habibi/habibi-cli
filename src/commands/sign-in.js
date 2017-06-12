import graphql from '../modules/graphql';
import RegEx from '../modules/regex';
import {generateSignUpHash, generatePGPHash} from '../modules/crypto';
// import {getPgpPassphrase, getApiToken} from './configuration';
import {storeCredentials} from '../modules/configuration';
import prompt from '../modules/prompt';
import UserError from '../modules/user-error';
import SIGN_IN_USER_MUTATION from '../graphql/SignInUser';

const schema = {
  properties: {
    // email: {
    //   pattern: RegEx.email,
    //   message: 'Email must be valid and only lower case letters are allowed',
    //   required: true,
    // },
    password: {
      hidden: true,
      required: true,
    },
  },
};

const signin = async ({email}) => {
  if (typeof email !== 'string') {
    throw new UserError('explain-usage-signin');
  }

  if (! RegEx.email.test(email)) {
    throw new UserError('invalid-email');
  }

  try {
    const input  = await prompt(schema);

    const {data} = await graphql.mutate({
      variables: {
        email: email,
        password: generateSignUpHash(input.password),
      },
      mutation: SIGN_IN_USER_MUTATION,
    });

    console.log(JSON.stringify(data, null, 2));

    storeCredentials({
      login: email,
      apiToken: data.signIn,
      pgpPassphrase: generatePGPHash(input.password),
    });

  } catch (e) {
    console.error(e);
  }
};

export default signin;
