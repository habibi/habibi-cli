import gql from 'graphql-tag';
import graphql from './graphql';
import RegEx from './regex';
import {generateSignUpHash} from './crypto';
// import {getPgpPassphrase, getApiToken} from './configuration';
import {storeApiToken, storePgpPassphrase} from './configuration';
import prompt from './prompt';

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

const signInMutation = gql`
  mutation signInMutation($email: String!, $password: String!) {
    signIn(email: $email, password: $password)
  }
`;

const signin = async () => {
  try {
    const input  = await prompt(schema);

    const {data} = await graphql.mutate({
      variables: {
        email: input.email,
        password: generateSignUpHash(input.password),
      },
      mutation: signInMutation,
    });

    console.log(JSON.stringify(data, null, 2));

    storeApiToken(data.signIn);
    storePgpPassphrase(input.password);

  } catch (e) {
    console.error(e);
  }
};

export default signin;
