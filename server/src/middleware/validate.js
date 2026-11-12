import { BadRequestError } from '../utils/errors.js';

export function validate(schema) {
  return (req, res, next) => {
    try {
      const validated = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params
      });
      if (validated.body) req.body = validated.body;
      if (validated.query) req.query = validated.query;
      if (validated.params) req.params = validated.params;
      next();
    } catch (error) {
      const details = error.errors?.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }));
      next(new BadRequestError('Validation error', details));
    }
  };
}

