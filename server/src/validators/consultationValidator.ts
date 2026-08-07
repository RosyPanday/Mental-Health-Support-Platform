import Joi from "joi";
import { RequestConsultationStatusEnum } from "#src/enums/requestConsultationStatusEnum.js";
import { stringSchema } from "./schemas.js";

const viewConsultationsSchema = Joi.object({
  status: stringSchema
    .valid(...Object.values(RequestConsultationStatusEnum))
    .required(),
});

export { viewConsultationsSchema };
