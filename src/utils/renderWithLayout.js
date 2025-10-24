import ejs from "ejs";
import createError from "http-errors";
import { StatusCodes } from "http-status-codes";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const renderWithLayout = async (res, page, options = {}) => {
  try {
    const pagePath = path.join(__dirname, "../views/pages", page + ".ejs");
    const layoutPath = path.join(__dirname, "../views/layouts/main.ejs");

    // Render page content first
    const pageContent = await ejs.renderFile(pagePath, options);

    // Render layout with page content injected as 'body'
    const html = await ejs.renderFile(layoutPath, {
      ...options,
      body: pageContent,
    });

    res.send(html);
  } catch (err) {
    console.error("Render Error:", err);
    // Use http-errors and http-status-codes
    const error = createError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Unable to render page"
    );
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
  }
};
