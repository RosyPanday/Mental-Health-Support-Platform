import { RoleEnum } from "#src/enums/roleEnum.js";
import type {
  ContextInterface,
  GraphqlResponseInterface,
  VideoRoomInterface,
} from "#src/interfaces/index.js";
import { Validator } from "#src/middleware/validator.js";
import { VideoCallService } from "#src/services/videoCallService.js";
import { GraphqlResponse } from "#src/utils/graphqlResponse.js";
import { requireRole } from "#src/utils/roleChecker.js";
import { joinVideoCallSchema } from "#src/validators/joinVideoCallValidator.js";

export const videoCallResolver = {
  Mutation: {
    joinVideoCall: async (
      parent: ParentNode,
      args: {
        input: {
          consultationId: number;
        };
      },
      contextValue: ContextInterface,
    ): Promise<GraphqlResponseInterface<VideoRoomInterface>> => {
      Validator.check(joinVideoCallSchema, args.input);
      requireRole(contextValue.role, [RoleEnum.patient, RoleEnum.therapist]);

      const videoRoomDetails = await new VideoCallService().joinVideoCall(
        args.input.consultationId,
      );

      return GraphqlResponse.send<VideoRoomInterface>({
        message: "Video room credentials retrieved successfully",
        data: videoRoomDetails,
      });
    },
  },
};
