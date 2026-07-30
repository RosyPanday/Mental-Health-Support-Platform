import type { GraphQLSchema } from "graphql";
import { buildSubgraphSchema } from '@apollo/subgraph';
import { authDefs } from "../typeDefs/authTypeDef.js";
import { authResolver } from "../resolvers/authResolver.js";
import { screeningDefs } from "../typeDefs/screeningTypeDef.js";
import { ScreeningResolver } from "../resolvers/screeningResolver.js";

export const schema :GraphQLSchema= buildSubgraphSchema([
    {typeDefs: authDefs, resolvers:authResolver},
    {typeDefs:screeningDefs,resolvers:ScreeningResolver}
])