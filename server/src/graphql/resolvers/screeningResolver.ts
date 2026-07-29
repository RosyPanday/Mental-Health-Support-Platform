import { RoleEnum } from "#src/enums/roleEnum.js";
import type { ContextInterface, ScreeningInterface } from "#src/interfaces/index.js";
import { Validator } from "#src/middleware/validator.js";
import { requireRole } from "#src/utils/roleChecker.js";
import { phqNineSchema } from "#src/validators/index.js";


export const ScreeningResolver = {
  Mutation: {
    phqNineScreening: async (
      parent: ParentNode,
      args: { input: ScreeningInterface },
      contextValue: ContextInterface
    ) => {
        requireRole(contextValue.role, [RoleEnum.patient]);
        Validator.check(phqNineSchema,args.input);
        const result = 
    },
  },
};
