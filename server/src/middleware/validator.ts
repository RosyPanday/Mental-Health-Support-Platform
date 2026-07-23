import type { NextFunction, Request, Response } from "express";
import type { AlternativesSchema, ArraySchema, ObjectSchema, StringSchema } from "joi";

class Validator {
  private static instance: Validator;

  private constructor() {}

  static get(): Validator {
    if (!Validator.instance) {
      Validator.instance = new Validator();
    }
    return Validator.instance;
  }

  public check = (
    schema: ObjectSchema | ArraySchema | StringSchema|AlternativesSchema,
    input: unknown,
  ) => {
    const { error } = schema.validate(input, { abortEarly: false });
    if (error) {
      throw error; // Let Joi's built-in ValidationError handle it directly
    }
  };

  public checkNext = (schema: ObjectSchema | ArraySchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const { error } = schema.validate(req.body, { abortEarly: false });
      if (error) {
        return next(error); // Pass the error cleanly to Express error-handling middleware
      }
      next();
    };
  };
}

const validator = Validator.get();
export { validator as Validator };
