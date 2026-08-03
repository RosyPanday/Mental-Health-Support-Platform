import { RoleEnum } from "#src/enums/roleEnum.js";
import type {
  ContextInterface,
  GraphqlResponseInterface,
  PHQNineScreeningReponseInterface,
  ScreeningInterface,
} from "#src/interfaces/index.js";
import { Validator } from "#src/middleware/validator.js";
import { ScreeningService } from "#src/services/screeningService.js";
import { GraphqlResponse } from "#src/utils/graphqlResponse.js";
import { Guard } from "#src/utils/guard.js";
import { requireRole } from "#src/utils/roleChecker.js";
import { phqNineSchema } from "#src/validators/index.js";

export const ScreeningResolver = {
  Mutation: {
    phqNineScreening: und it wasync (
      parent: ParentNode,
      args: { input: ScreeningInterface },
      contextValue: ContextInterface,
    ): Promise<GraphqlResponseInterface<PHQNineScreeningReponseInterface>> => {
      requireRole(contextValue.role, [RoleEnum.patient]);
      Validator.check(phqNineSchema, args.input);
      const patientId = await Guard.grantPatient(contextValue.id);
      const { totalScore, severity, message } =
        await new ScreeningService().insertResponses({
          responses: args.input.responses,
          patientId,
        });
      return GraphqlResponse.send<PHQNineScreeningReponseInterface>({
        message: message,
        data: {
          totalScore,
          severity,
        },
      });
    },
  },
};
