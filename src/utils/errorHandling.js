export const asyncHandler = (fn) => {
  return (req, res, next) => {
    return fn(req, res, next).catch((err) => {
    return  next(new Error(err),{cause:err.cause})
    });
  };
};


export const globalErrorHandler = (error, req, res, next) => {
  return res.status(error.cause || 400).json({ errMessage: error.message, error, stack: error.stack  });
};
