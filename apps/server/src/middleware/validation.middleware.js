export function validateBody(schema) {
  return (req, res, next) => {
    req.body = schema.parse(req.body);
    next();
  };
}

export function validateQuery(schema) {
  return (req, res, next) => {
    req.validatedQuery = schema.parse(req.query);
    next();
  };
}
