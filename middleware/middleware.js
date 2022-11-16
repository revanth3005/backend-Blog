const jwt = require("jsonwebtoken");


const middleware = async (req, res, next) => {
  const response = {
    success: false,
    code: 400,
    data: null,
    message: "error",
    error: "error",
    resource: req.originalUrl,
  };

  const authorization = req.headers["authorization"];

  if (!authorization) {
    response.message = "Unauthorized access missing token info";
    response.code = 401;
    return res.status(401).json(response);
  }

  const [bearer, token] = authorization.split(" ");
  if (!bearer || !token || (bearer && bearer !== "Bearer")) {
    response.message = "Unauthorized access missing token info------";
    response.code = 401;
    return res.status(401).json(response);
  }

  try {
    const decodeToken = jwt.verify(token, "sai-revanth-naidu");
    res.locals.id = decodeToken;
    next();
  } catch (error) {
    response.error = error;
    response.code = 500;
    response.message = "error-----" + error.message;
    return res.status(500).json(response);
  }
};

module.exports = middleware;
