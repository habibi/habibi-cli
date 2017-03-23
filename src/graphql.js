import ApolloClient, {createNetworkInterface} from 'apollo-client';

const TOKEN = '9nIjKUoSvAUEUm2n1XZ9-db7StrtnAwBZImkRK7xFMV';

const networkInterface = createNetworkInterface({
  uri: 'http://localhost:3000/graphql',
});

networkInterface.use([{
  applyMiddleware(req, next) {
    if (! req.options.headers) {
      req.options.headers = {};
    }
    req.options.headers.authorization = `Bearer ${TOKEN}`;
    next();
  },
}]);

const client = new ApolloClient({
  networkInterface,
});

export default client;
