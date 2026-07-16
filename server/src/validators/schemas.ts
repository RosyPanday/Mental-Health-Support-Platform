import joi from "joi";

const stringSchema = joi.string();
const numberSchema = joi.number();
const booleanSchema = joi.boolean();
const alternativeSchema= joi.alternatives();

export {
  stringSchema,
  numberSchema,
  booleanSchema,
  alternativeSchema
}
