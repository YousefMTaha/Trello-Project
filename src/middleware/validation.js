const validation = (schema) => {
  return (req, res, next) => {
    const reqFields = ["body", "params", "query", "headers", "file", "files"];
    const validationErr = [];

    reqFields.forEach((key) => {
      if (schema[key]) {
        const validationResult = schema[key].validate(req[key], {
          abortEarly: false,
        });

        if (validationResult.error) {
          validationErr.push(validationResult.error);
        }
      }
    });

    if (validationErr.length) {
      return res
        .status(400)
        .json({ message: "Validation Err", validationErr });
    }

    return next();
  };
};

export default validation;
