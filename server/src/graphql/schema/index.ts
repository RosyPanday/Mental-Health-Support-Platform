import type { GraphQLSchema } from "graphql";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { authDefs } from "../typeDefs/authTypeDef.js";
import { authResolver } from "../resolvers/authResolver.js";
import { screeningDefs } from "../typeDefs/screeningTypeDef.js";
import { ScreeningResolver } from "../resolvers/screeningResolver.js";
import { PatientDefs } from "../typeDefs/patientTypeDef.js";
import { PatientResolver } from "../resolvers/patientResolver.js";
import { TherapistDefs } from "../typeDefs/therapistTypeDef.js";
import { TherapistResolver } from "../resolvers/therapistResolver.js";
import { consultationDefs } from "../typeDefs/consultationTypeDef.js";
import { consultationResolver } from "../resolvers/consultationResolver.js";
import { videoCallResolver } from "../resolvers/videoCallResolver.js";
import { videoCallDefs } from "../typeDefs/videoCallTypeDef.js";
import { AdminDefs } from "../typeDefs/adminTypeDef.js";
import { AdminResolver } from "../resolvers/adminResolver.js";

export const schema: GraphQLSchema = buildSubgraphSchema([
  { typeDefs: authDefs, resolvers: authResolver },
  { typeDefs: screeningDefs, resolvers: ScreeningResolver },
  { typeDefs: PatientDefs, resolvers: PatientResolver },
  { typeDefs: TherapistDefs, resolvers: TherapistResolver },
  { typeDefs: consultationDefs, resolvers: consultationResolver },
  { typeDefs: videoCallDefs, resolvers: videoCallResolver },
  { typeDefs: AdminDefs, resolvers: AdminResolver },

]);
