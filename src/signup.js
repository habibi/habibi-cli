import crypto from 'crypto';
import prompt from 'prompt';
import gql from 'graphql-tag';
import netrc from 'netrc';
import graphql from './graphql';
import RegEx from './regex';
import {generateKeys} from './pgp';

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

const signup = () => {
  prompt.start();
  prompt.get(schema, async (error, input) => {

    if (error) {
      throw new Error(error);
    }

    const salt = 'habibi';
    const hash = crypto.pbkdf2Sync(input.password, salt, 100000, 512, 'sha512')
      .toString('hex');

    const {
      privateKeyArmored,
      publicKeyArmored,
    } = await generateKeys(input.email, input.password);

    const mutation = gql`
      mutation (
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

    try {
      const {data} = await graphql.mutate({
        variables: {
          email: input.email,
          password: hash,
          privateKey: privateKeyArmored,
          publicKey: publicKeyArmored,
        },
        mutation: mutation,
      });
      console.log(JSON.stringify(data, null, 2));

      const myNetrc = netrc();
      myNetrc['habibi.one'] = {
        login: input.email,
        password: data.createUser,
      };
      netrc.save(myNetrc);

    } catch (e) {
      if (e.graphQLErrors && e.graphQLErrors[0].message === 'duplicate-email') {
        console.error('There is already a user with the email you provided, ' +
          'try signing in instead');
      } else {
        console.log(e);
        console.error('Unknown error');
      }
    }
  });
};

export default signup;
