const CustomError = (statusCode, messageError) => {
  const error = new Error();
  error.message = messageError;
  error.statusCode = statusCode;
  return error;
};

module.exports = CustomError;
