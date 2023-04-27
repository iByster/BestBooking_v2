import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';
import { buildSchema } from 'type-graphql';
import DropPoint from './type-orm.config';
import { MyContext } from './types/types';
import HotelResolver from './resolvers/HotelResolver';
dotenv.config();

const main = async () => {
    dotenv.config();
  
    const PORT = process.env.PORT || 4000;
  
    await DropPoint.initialize();

    const app = express();

    app.set('trust proxy', 1);
    app.use(
      cors({
        origin: 'http://localhost:5173',
        credentials: true,
      })
    );

    const apolloServer = new ApolloServer({
      schema: await buildSchema({
        resolvers: [
          HotelResolver
        ],
        validate: false,
      }),
      context: ({ req, res }): MyContext => ({ req, res }),
      plugins: [
        ApolloServerPluginLandingPageGraphQLPlayground({
          // options
        }),
      ],
    });
  
    await apolloServer.start();
    apolloServer.applyMiddleware({
      app,
      cors: false,
    });
  
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
};

main().catch((err) => console.log(err));
