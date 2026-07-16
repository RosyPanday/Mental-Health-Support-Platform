import type { ContextInterface } from "#src/interfaces/contextHandlerInterface.js";
import type {
  InputSignupInterface,
  signupResponseInterface,
} from "#src/interfaces/authInterface.js";
import { AuthService } from "@src/services/authService.js";
import { Validator } from "@src/middleware/validator.js";
import { signupSchema } from "@src/validators/authValidator.js";
import { GraphqlResponse } from "@src/utils/graphqlResponse.js";

export const authResolver = {
  Mutation: {
    signup: async (
      parent: ParentNode,
      args: { input: InputSignupInterface },
      contextValue: ContextInterface,
    ) => {
      const authService = new AuthService();
      const existingUser = await authService.validateUniqueFields(
        args.input.username,
        args.input.email,
        args.input.phoneNumber,
      );
      Validator.check(signupSchema, args.input);
      const result = await authService.signup(args.input);
      return GraphqlResponse.send<signupResponseInterface>({
        message: "User successfully signedup.",
        data: {
          token: result.token,
          user: {
            id: result.userId,
            username: args.input.username,
            role: args.input.role,
          },
        },
      });
    },

    //next mutation
  },
};
