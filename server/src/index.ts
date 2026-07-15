import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import { userDefs } from './graphql/userDefs';

async function startServer() {
  const app = express();
  
  // Apollo GraphQL Server Setup
  const server = new ApolloServer({
    typeDefs: userDefs,
    resolvers: {}, // resolvers खाली भए पनि root code चल्छ
  });

  await server.start();

  app.use(express.json());
  app.use(cors());

  // GraphQL Middleware
  app.use('/graphql', expressMiddleware(server));

  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
}

startServer();