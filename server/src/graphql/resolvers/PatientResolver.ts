import { RoleEnum } from "#src/enums/roleEnum.js";
import type { ContextInterface } from "#src/interfaces/contextHandlerInterface.js";
import type { GraphqlResponseInterface } from "#src/interfaces/graphqlResponseInterface.js";
import type { therapistRecommendationInterface } from "#src/interfaces/patientInterface.js";
import type { TherapistInterface } from "#src/interfaces/therapistInterface.js";
import { Validator } from "#src/middleware/validator.js";
import { TherapistRecommendationService } from "#src/services/therapistRecommendationService.js";
import { GraphqlResponse } from "#src/utils/graphqlResponse.js";
import { requireRole } from "#src/utils/roleChecker.js";
import { descriptionSchema } from "#src/validators/patientValidator.js";

export const PatientResolver = {
   Query: {
    searchTherapists: async (
      parent: ParentNode,
      args: {
        input: {
          description: string;
        };
      },
      contextValue: ContextInterface,
    ): Promise<GraphqlResponseInterface<any>> => {
      requireRole(contextValue.role, [RoleEnum.patient]);
      Validator.check(descriptionSchema, args.input);

      const results =
        await new TherapistRecommendationService().recommendTherapists(
          args.input.description,
        );

      const recommendedTherapists: TherapistInterface[] = results.map(
        (result) => result.therapist,
      );

      return GraphqlResponse.send<therapistRecommendationInterface>({
        message: "User logged in successfully",
        data: {
          recommendedTherapists,
        },
      });
    },
  },
};
