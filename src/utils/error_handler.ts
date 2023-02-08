import { Boom } from "@hapi/boom";
import type { ErrorRequestHandler } from "express";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof Boom) {
    return res.status(err.output.statusCode).json({ message: err.message });
  }

  console.log(`Error: ${err.message}`);
  console.log(`Path: ${req.path}`);
  console.log(`Body: ${JSON.stringify(req.body)}`);
  console.log(`Query: ${JSON.stringify(req.query)}`);

  return res
    .status(500)
    .json({ message: "Something went wrong... We trying to fix it" });
};

export default errorHandler;
