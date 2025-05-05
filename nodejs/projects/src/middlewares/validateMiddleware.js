import { ZodError } from "zod";
import { customErrorZod } from "../helpers/customError.js";
import HttpError from "../interfaces/error.js";
import pkg from "lodash";
const { isEmpty, isArray, isPlainObject } = pkg;
const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      let input = {};
      const body = req.body;
      const query = req.query;
      const params = req.params;
      const mergeIfNotEmpty = (obj) => {
        if (!isEmpty(obj)) {
          const newInput = { ...input, ...obj };
          input = "id" in obj ? { ...newInput, id: +newInput.id } : newInput;
        }
      };

      if (!body) {
        mergeIfNotEmpty(query);
        mergeIfNotEmpty(params);
      } else {
        if (isArray(body)) {
          input = body;
          if (input.length <= 0)
            return next(new HttpError(400, "missing data required"));
        } else if (isPlainObject(body)) {
          mergeIfNotEmpty(body);
          mergeIfNotEmpty(query);
          mergeIfNotEmpty(params);
        }
      }
      // if (!input || isEmpty(input)) {
      //   return next(new HttpError(400, "missing data required"));
      // }
      console.log(input);
      let result = await schema.parseAsync(input); // Chờ validation hoàn tất
      req.data = result;
      next();
    } catch (error) {
      console.log(error);
      // Xử lý lỗi từ Zod (cả đồng bộ và bất đồng bộ)
      if (error instanceof ZodError) {
        const errors = customErrorZod(error.errors);
        return next(new HttpError(400, errors));
      }
      next(new HttpError(400, error));
    }
  };
};

export default validateRequest;
