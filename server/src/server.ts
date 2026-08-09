import express, { type NextFunction, type Request, type Response } from "express";
import http from "http";
import { ApolloServer, type BaseContext } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@as-integrations/express5";
import cors from "cors";

import { corsWhiteList, port } from "./config/index.js";
import { Database } from "./database/connection.js";
import { schema } from "./graphql/schema/index.js";
import { contextHandler } from "./middleware/context.js";
import routes from "./api/routes/index.js";

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

  private setUpMiddleware() {
    this.app.use(
      cors<cors.CorsRequest>({
        origin: (origin, callback) => {
          if (!origin) {
            callback(null, true);
            return;
          }

          const isAllowedOrigin =
            corsWhiteList.includes(origin) ||
            /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);

          if (isAllowedOrigin) {
            callback(null, true);
            return;
          }

          callback(new Error(`Origin not allowed by CORS: ${origin}`));
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      }),
    );
    this.app.use(express.json());
  }
  public async start() {
    await this.connectDB();
    this.httpServer = http.createServer(this.app);
    this.setUpMiddleware();
    this.app.use("/api/", routes);
    this.app.use(
      "/api/",
      (err: any, _req: Request, res: Response, _next: NextFunction) => {
        res.status(err?.status || 500).json({
          message: err?.message || "Internal server error.",
        });
      },
    );
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
      expressMiddleware(this.apolloServer, {
        context: async ({ req }) => {
          const context = await contextHandler({ req });
          if (!context) {
            throw new Error("Unauthorized User");
          }
          const { id, role } = context;
          return {
            id,
            role,
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
