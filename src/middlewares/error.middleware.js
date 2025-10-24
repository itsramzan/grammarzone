import { StatusCodes } from "http-status-codes";
import { renderWithLayout } from "../utils/renderWithLayout.js";

export const notFound = (req, res, next) => {
  res.status(StatusCodes.NOT_FOUND);

  renderWithLayout(res, "error", {
    title: "404 Not Found",
    status: StatusCodes.NOT_FOUND,
    message: "Sorry your requested page was not found",
  });
};

export const errorHandler = (err, req, res, next) => {
  const status = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || "Internal Server Error";

  renderWithLayout(res, "error", { title: "Error", status, message });
};
