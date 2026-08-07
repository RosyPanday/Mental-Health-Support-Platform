import type { RequestConsultationStatusEnum } from "#src/enums/requestConsultationStatusEnum.js";
import { RoleEnum } from "#src/enums/roleEnum.js";
import type { ContextInterface } from "#src/interfaces/contextHandlerInterface.js";
import type { GraphqlResponseInterface } from "#src/interfaces/graphqlResponseInterface.js";
import { Validator } from "#src/middleware/validator.js";
import { TherapistService } from "#src/services/therapistService.js";
import { GraphqlResponse } from "#src/utils/graphqlResponse.js";
import { requireRole } from "#src/utils/roleChecker.js";
import { confirmOrCancelBookingSchema } from "#src/validators/therapistValidator.js";

export const TherapistResolver = {
  Mutation: {
    confirmOrCancelBooking: async (
      parent: ParentNode,
      args: {
        input: {
          consultationId: number;
          status: RequestConsultationStatusEnum;
          reason?: string;
        };
      },
      contextValue: ContextInterface,
    ): Promise<GraphqlResponseInterface<void>> => {
      requireRole(contextValue.role, [RoleEnum.therapist]);
      Validator.check(confirmOrCancelBookingSchema, args.input);

      await new TherapistService().confirmOrCancelBooking({
        consultationId: args.input.consultationId,
        status: args.input.status,
        reason: args.input.reason,
      });

      return GraphqlResponse.send({
        message: `Booking successfully ${args.input.status}`,
      });
    },
  },
};
