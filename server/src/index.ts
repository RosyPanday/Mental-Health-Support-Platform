import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import { userDefs } from './graphql/userDefs';
import { userResolvers } from './graphql/userResolvers'; // 
import { connectDB } from './db'; // 

async function startServer() {
  const app = express();
  
  // Database Connect गर्ने (SQLite Database सुचारु हुन्छ)
  await connectDB();
  
  // Apollo GraphQL Server Setup
  const server = new ApolloServer({
    typeDefs: userDefs,
    resolvers: userResolvers, // ३. यहाँ खाली {} लाई हटाएर userResolvers राखियो
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