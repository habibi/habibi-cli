import graphql from '../modules/graphql';
import RegEx from '../modules/regex';
import {generateKeys} from '../modules/pgp';
import {generateSignUpHash} from '../modules/crypto';
import {storeApiToken, storePgpPassphrase} from '../modules/configuration';
import prompt from '../modules/prompt';
import UserError from '../modules/user-error';
import SIGN_UP_USER_MUTATION from '../graphql/SignUpUser';

const promptSchema = {
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

const signup = async ({email}) => {
  if (typeof email !== 'string') {
    throw new UserError('explain-usage-signup');
  }

  if (! RegEx.email.test(email)) {
    throw new UserError('invalid-email');
  }

  try {
    const input = await prompt(promptSchema);

    const {
      privateKeyArmored,
      publicKeyArmored,
    } = await generateKeys(email, input.password);

    // Store PGP keys remotely
    const {data} = await graphql.mutate({
      variables: {
        email: email,
        password: generateSignUpHash(input.password),
        privateKey: privateKeyArmored,
        publicKey: publicKeyArmored,
      },
      mutation: SIGN_UP_USER_MUTATION,
    });
    console.log(JSON.stringify(data, null, 2));

    storeApiToken(data.createUser);
    storePgpPassphrase(input.password);

  } catch (e) {
    if (e.graphQLErrors && e.graphQLErrors[0].message === 'duplicate-email') {
      throw new UserError('duplicate-email');
    }
    throw e;
  }
};

export default signup;
