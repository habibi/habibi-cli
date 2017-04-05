import ApolloClient, {createNetworkInterface} from 'apollo-client';
import netrc from 'netrc';

const networkInterface = createNetworkInterface({
  uri: 'http://localhost:3000/graphql',
});

networkInterface.use([{
  applyMiddleware(req, next) {
    if (! req.options.headers) {
      req.options.headers = {};
    }

    // Read the API token from the netrc file
    const myNetrc = netrc();
    const token = myNetrc['habibi.one'].password;

    req.options.headers.authorization = `Bearer ${token}`;
    next();
  },
}]);

const client = new ApolloClient({
  networkInterface,
});

export default client;
