import crypto from 'crypto';
import prompt from 'prompt';
import gql from 'graphql-tag';
import netrc from 'netrc';
import graphql from './graphql';
import RegEx from './regex';

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
  prompt.start();
  prompt.get(schema, async (error, input) => {

    if (error) {
      throw new Error(error);
    }

    const salt = 'habibi';
    const hash = crypto.pbkdf2Sync(input.password, salt, 100000, 512, 'sha512')
      .toString('hex');

    const mutation = gql`
      mutation {
        signIn(email: "${input.email}", password: "${hash}")
      }
    `;

    try {
      const {data} = await graphql.mutate({mutation});
      console.log(JSON.stringify(data, null, 2));

      const myNetrc = netrc();
      myNetrc['habibi.one'] = {
        login: input.email,
        password: data.signIn,
      };
      netrc.save(myNetrc);

    } catch (e) {
      console.error(e);
    }
  });
};

export default signin;
