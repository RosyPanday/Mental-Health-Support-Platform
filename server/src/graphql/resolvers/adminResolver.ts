import { RoleEnum } from "#src/enums/roleEnum.js";
import type {
  ContextInterface,
  GraphqlResponseInterface,
  TherapistInterface,
} from "#src/interfaces/index.js";
import { TherapistService } from "#src/services/therapistService.js";
import { GraphqlResponse } from "#src/utils/graphqlResponse.js";
import { requireRole } from "#src/utils/roleChecker.js";

export const AdminResolver = {
  Query: {
    adminFetchUnverifiedTherapists: async (
      parent: ParentNode,
      args: null,
      contextValue: ContextInterface,
    ): Promise<
      GraphqlResponseInterface<{ unverifiedTherapists: TherapistInterface[] }>
    > => {
      requireRole(contextValue.role, [RoleEnum.admin]);

      const unverifiedTherapists: TherapistInterface[] =
        await new TherapistService().getUnverifiedTherapists();

      return GraphqlResponse.send<{
        unverifiedTherapists: TherapistInterface[];
      }>({
        message: "Unverified therapists fetched successfully",
        data: {
          unverifiedTherapists,
        },
      });
    },
  },
  Mutation: {
    adminVerifyTherapist: async (
      parent: ParentNode,
      args: { input: { therapistId: number } },
      contextValue: ContextInterface,
    ): Promise<GraphqlResponseInterface<void>> => {
      requireRole(contextValue.role, [RoleEnum.admin]);
      await new TherapistService().verifyTherapist(args.input.therapistId);

      return GraphqlResponse.send<void>({
        message: "Therapist verified successfully",
      });
    },
  },
};
