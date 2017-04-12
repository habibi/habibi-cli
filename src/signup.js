import gql from 'graphql-tag';
import graphql from './graphql';
import RegEx from './regex';
import {generateKeys} from './pgp';
import {generateSignUpHash} from './crypto';
import {storePrivateKey, storePublicKey, storeApiToken, storePgpPassphrase} from './configuration';
import prompt from './prompt';

const promptSchema = {
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

const signUpMutation = gql`
  mutation signUpMutation(
    $email: String!,
    $password: String!,
    $privateKey: String!,
    $publicKey: String!
  ) {
    createUser(
      email: $email,
      password: $password,
      privateKey: $privateKey,
      publicKey: $publicKey,
    )
  }
`;

const signup = async () => {
  try {
    const input = await prompt(promptSchema);

    const {
      privateKeyArmored,
      publicKeyArmored,
    } = await generateKeys(input.email, input.password);

    // Store PGP keys locally
    storePrivateKey(privateKeyArmored);
    storePublicKey(publicKeyArmored);

    // Store PGP keys remotely
    const {data} = await graphql.mutate({
      variables: {
        email: input.email,
        password: generateSignUpHash(input.password),
        privateKey: privateKeyArmored,
        publicKey: publicKeyArmored,
      },
      mutation: signUpMutation,
    });
    console.log(JSON.stringify(data, null, 2));

    storeApiToken(data.createUser);
    storePgpPassphrase(input.password);

  } catch (e) {
    if (e.graphQLErrors && e.graphQLErrors[0].message === 'duplicate-email') {
      console.error('There is already a user with the email you provided, ' +
        'try signing in instead');
    } else {
      console.error(e);
    }
  }
};

export default signup;
