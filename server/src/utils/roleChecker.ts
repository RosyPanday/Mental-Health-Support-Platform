import { RoleEnum } from "#src/enums/roleEnum.js";

export const requireRole = (
  userRole: string | undefined,
  allowedRoles: RoleEnum[],
) => {
  if (!userRole) {
    throw new Error("Forbidden: Improper token recieved/unauthorized user");
  }
  if (!allowedRoles.includes(userRole as RoleEnum)) {
    throw new Error("Forbidden: Permission Denied ");
  }
};
