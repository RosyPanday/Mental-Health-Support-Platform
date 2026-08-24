import type { RequestConsultationStatusEnum } from "#src/enums/requestConsultationStatusEnum.js";
import { RoleEnum } from "#src/enums/roleEnum.js";
import type {
    ContextInterface,
    GraphqlResponseInterface,
    RequestConsultationInterface
} from "#src/interfaces/index.js";
import { Validator } from "#src/middleware/validator.js";
import { ConsultationService } from "#src/services/consultationService.js";
import { GraphqlResponse } from "#src/utils/graphqlResponse.js";
import { requireRole } from "#src/utils/roleChecker.js";
import { viewConsultationsSchema } from "#src/validators/index.js";

export const consultationResolver = {
  Query: {
    viewConsultations: async (
      parent: ParentNode,
      args: {
        input: {
          status: RequestConsultationStatusEnum;
        };
      },
      contextValue: ContextInterface,
    ): Promise<
      GraphqlResponseInterface<RequestConsultationInterface[]>
    > => {
      Validator.check(viewConsultationsSchema, args.input);
      requireRole(contextValue.role, [RoleEnum.patient, RoleEnum.therapist]);
      const consultations = await new ConsultationService().viewConsultations({
        userId: contextValue.id!,
        role: contextValue.role!,
        status: args.input?.status,
      });

      return GraphqlResponse.send<RequestConsultationInterface[]>({
        message: "Consultations retrieved successfully",
        data: consultations,
      });
    },
  },
};
