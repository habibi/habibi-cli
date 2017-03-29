import crypto from 'crypto';
import prompt from 'prompt';
import gql from 'graphql-tag';
import graphql from './graphql';
import RegEx from './regex';

var schema = {
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
  prompt.get(schema, async (error, result) => {

    if (error) {
      throw new Error(error);
    }

    const salt = crypto.randomBytes(512).toString('hex');
    const hash = crypto.pbkdf2Sync(result.password, salt, 100000, 512, 'sha512')
      .toString('hex');

    const mutation = gql`
      mutation {
        createUser(email: "${result.email}", hash: "${hash}", salt: "${salt}")
      }
    `;

    try {
      const result = await graphql.mutate({mutation: mutation});
      console.log(JSON.stringify(result.data, null, 2));

    } catch (e) {
      if (e.graphQLErrors && e.graphQLErrors[0].message === 'duplicate-email') {
        // eslint-disable-next-line no-console
        console.error('There is already a user with the email you provided, ' +
          'try signing in instead');
      } else {
        // eslint-disable-next-line no-console
        console.error('Unknown error');
      }
    }
  });
};

export default signup;
