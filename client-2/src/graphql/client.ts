import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';
import { getCookie } from '../utils/auth';

const graphqlUrl = import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:4000/graphql';

const authLink = new ApolloLink((operation, forward) => {
  const token = getCookie('authToken');

  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  }));

  return forward(operation);
});

const httpLink = new HttpLink({ uri: graphqlUrl });

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
