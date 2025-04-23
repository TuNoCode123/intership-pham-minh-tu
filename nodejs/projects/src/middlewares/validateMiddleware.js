import { customErrorZod } from "../helpers/customError.js";
import HttpError from "../interfaces/error.js";
import pkg from "lodash";
const { isEmpty } = pkg;
const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      let input;
      const body = req.body;
      const query = req.query;
      const params = req.params;

      if (!isEmpty(body)) {
        input = body;
      } else if (!isEmpty(query)) {
        input = query;
      } else if (!isEmpty(params)) {
        input = params;
      }

      //   const input = req.body;
      if (!input) {
        return next(new HttpError(400, "missing data required"));
      }
      //   console.log("neathc");
      const result = schema.safeParse(input);
      // Validate body

      if (!result.success) {
        const errors = customErrorZod(result.error.errors);
        return next(new HttpError(400, errors));
      }
      req.data = result.data;
      next();
    } catch (error) {
      console.log(error);
      const arrErros = error.inner.map((err) => ({
        field: err.path,
        message: err.message,
      }));
      next(new HttpError(400, arrErros));
    }
  };
};

export default validateRequest;
