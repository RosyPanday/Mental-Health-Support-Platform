import type { RoleEnum } from "#src/enums/roleEnum.js";

export interface ContextInterface {
  id: number | undefined;
  role: RoleEnum | undefined;
}
