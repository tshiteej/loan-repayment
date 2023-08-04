const HttpResponseHandler = require("../utils/ResponseFormat");

const handleRequest = async (validationSchema, fn, dataValues) => {
  try {
    if (validationSchema) await validationSchema.validateAsync(dataValues);
    const data = await fn(dataValues);
    return data;
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};

const handleRESTReq = (fn, validationSchema) => {
  return async (req, res, next) => {
    try {
      const dataValues = {
        ...req.body,
        ...req.params,
        ...req.query,
        ...req.headers,
      };
      const data = await handleRequest(validationSchema, fn, dataValues);
      HttpResponseHandler.success(req, res, data);
    } catch (error) {
      HttpResponseHandler.error(req, res, error.message, 400);
    }
  };
};

module.exports = {
  handleRESTReq,
};
