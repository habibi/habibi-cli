import gql from 'graphql-tag';
import graphql from './graphql';

const pushEnvironment = gql`
  mutation pushEnvironment($environment: String!) {
    push(environment: $environment)
  }
`;

const push = () => {
  graphql.mutate({
    mutation: pushEnvironment,
    variables: {
      environment: 'asdasd',
    },
  }).then((result) => {
    console.log(JSON.stringify(result.data, null, 2));
  });
};

export default push;
