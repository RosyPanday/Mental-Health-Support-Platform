import type { GraphQLSchema } from "graphql";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { authDefs } from "../typeDefs/authTypeDef.js";
import { authResolver } from "../resolvers/authResolver.js";
import { screeningDefs } from "../typeDefs/screeningTypeDef.js";
import { ScreeningResolver } from "../resolvers/screeningResolver.js";
import { PatientDefs } from "../typeDefs/patientTypeDef.js";
import { PatientResolver } from "../resolvers/PatientResolver.js";
import { TherapistDefs } from "../typeDefs/therapistTypeDef.js";
import { TherapistResolver } from "../resolvers/therapistResolver.js";
import { PaymentDefs } from "../typeDefs/paymentTypeDef.js";
import { PaymentResolver } from "../resolvers/paymentResolver.js";

export const schema: GraphQLSchema = buildSubgraphSchema([
  { typeDefs: authDefs, resolvers: authResolver },
  { typeDefs: screeningDefs, resolvers: ScreeningResolver },
  { typeDefs: PatientDefs, resolvers: PatientResolver },
  { typeDefs: TherapistDefs, resolvers: TherapistResolver },
  { typeDefs: PaymentDefs, resolvers: PaymentResolver },
]);
