import Joi from "joi";

import { numberSchema } from "./schemas.js";

const joinVideoCallSchema = Joi.object({
  consultationId: numberSchema.positive().required(),
});

export { joinVideoCallSchema };
