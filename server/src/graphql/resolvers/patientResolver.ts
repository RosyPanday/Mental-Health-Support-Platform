import { RoleEnum } from "#src/enums/roleEnum.js";
import type { ContextInterface } from "#src/interfaces/contextHandlerInterface.js";
import type { GraphqlResponseInterface } from "#src/interfaces/graphqlResponseInterface.js";
import type { therapistRecommendationInterface } from "#src/interfaces/patientInterface.js";
import { Validator } from "#src/middleware/validator.js";
import { PatientService } from "#src/services/patientService.js";
import { TherapistRecommendationService } from "#src/services/therapistRecommendationService.js";
import { GraphqlResponse } from "#src/utils/graphqlResponse.js";
import { Guard } from "#src/utils/guard.js";
import { requireRole } from "#src/utils/roleChecker.js";
import {
  descriptionSchema,
  requestConsultationSchema,
} from "#src/validators/patientValidator.js";

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
    ): Promise<GraphqlResponseInterface<therapistRecommendationInterface>> => {
      requireRole(contextValue.role, [RoleEnum.patient]);
      Validator.check(descriptionSchema, args.input);

      const results =
        await new TherapistRecommendationService().recommendTherapists(
          args.input.description,
        );

      const recommendedTherapists = results.map(
        ({ therapist, similarityPercentage }) => ({
          therapist,
          similarityPercentage,
        }),
      );

      return GraphqlResponse.send<therapistRecommendationInterface>({
        message: "User logged in successfully",
        data: {
          recommendedTherapists,
        },
      });
    },
  },
  Mutation: {
    requestConsultation: async (
      parent: ParentNode,
      args: {
        input: {
          preferredTime: Date;
          therapistId: number;
        };
      },
      contextValue: ContextInterface,
    ): Promise<GraphqlResponseInterface<void>> => {
      requireRole(contextValue.role, [RoleEnum.patient]);

      Validator.check(requestConsultationSchema, args.input);
      const patientId = await Guard.grantPatient(contextValue.id);

      const consultation = await new PatientService().requestConsultation({
        patientId: patientId,
        therapistId: args.input.therapistId,
        preferredTime: args.input.preferredTime,
      });

      return GraphqlResponse.send<void>({
        message: "Your consultation has been sent to the specified therapist",
      });
    },
  },
};
