
import { RoleEnum } from "#src/enums/roleEnum.js";
import type { ContextInterface } from "#src/interfaces/contextHandlerInterface.js";
import { TherapistRepository } from "#src/repositories/therapistRepository.js";
import { VideoService } from "#src/services/videoService.js";
import { GraphqlResponse } from "#src/utils/graphqlResponse.js";
import { Guard } from "#src/utils/guard.js";
import { requireRole } from "#src/utils/roleChecker.js";

export const TherapistResolver = {
  Query: {
    therapists: async (
      parent: ParentNode,
      args: object,
      contextValue: ContextInterface,
    ) => {
      requireRole(contextValue.role, [RoleEnum.patient]);

      const therapists = await new TherapistRepository().findAll({
        attributes: [
          "id",
          "name",
          "educationDegree",
          "specialization",
          "yearsOfExperience",
          "language",
          "review",
          "isVerified",
          "profilePic",
        ],
        order: [["name", "ASC"]],
      });

const resolved = (therapists as any[]).map((t) => ({
        ...t.toJSON(),
        isOnline: VideoService.isOnline(t.id),
      }));

return GraphqlResponse.send({
        message: "Therapists retrieved successfully.",
        data: { therapists: resolved },
      });
    },
    therapistProfile: async (
      parent: ParentNode,
      args: object,
      contextValue: ContextInterface,
    ) => {
      requireRole(contextValue.role, [RoleEnum.therapist]);
      const therapistId = await Guard.grantTherapist(contextValue.id!);
      const profile = await new TherapistRepository().findByPk(therapistId);

      return GraphqlResponse.send({
        message: "Therapist profile retrieved successfully.",
        data: { therapist: profile },
      });
    },
  },
};
