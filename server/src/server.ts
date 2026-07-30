import express from "express";
import http from "http";
import { ApolloServer, type BaseContext } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@as-integrations/express5";
import cors from "cors";

import { corsWhiteList, port } from "./config/index.js";
import { Database } from "./database/connection.js";
import { schema } from "./graphql/schema/index.js";
import { contextHandler } from "./middleware/context.js";

export class Server {
  private app: express.Application;
  private httpServer!: http.Server;
  private apolloServer!: ApolloServer<BaseContext>;

  constructor() {
    this.app = express();
  }
  private async connectDB() {
    await Database.connect();
    console.log("connect to database");
  }

  public async start() {
    await this.connectDB();
    this.httpServer = http.createServer(this.app);
    this.apolloServer = new ApolloServer({
      schema: schema,
      introspection: true,
      plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer: this.httpServer }),
      ],
    });
    await this.apolloServer.start();
    this.app.use(
      "/graphql",
      cors<cors.CorsRequest>({ origin: corsWhiteList }),
      express.json(),
      expressMiddleware(this.apolloServer, {
        context: async ({ req }) => {
          const {id,role} = await contextHandler({ req });
          return {
            id,
            role
          };
        },
      }),
    );

    await new Promise<void>((resolve, reject) => {
      //listen for success , httpServer can have a callback function to listen for success or error
      this.httpServer.listen(port, () => {
        console.info(`Server ready at : http://localhost:${port}/graphql`);
        resolve();
      });

      //listen for port error
      this.httpServer.on("error", (err) => {
        console.info(`error starting server due to ${err}`);
        reject(err);
      });
    });
  }
}

const server = new Server();
await server.start();
