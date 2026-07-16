import type { GraphQLSchema } from "graphql";
import { buildSubgraphSchema } from '@apollo/subgraph';
import { authDefs } from "../typeDefs/authTypeDef.js";
import { authResolver } from "../resolvers/authResolver.js";

export const schema :GraphQLSchema= buildSubgraphSchema([
    {typeDefs: authDefs, resolvers:authResolver}
])