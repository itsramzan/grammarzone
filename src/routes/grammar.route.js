import express from "express";
import { solveGrammar } from "../controllers/grammar.controller.js";
import { upload } from "../middlewares/upload.middleware.js";
import { renderWithLayout } from "../utils/renderWithLayout.js";

const router = express.Router();

router.get("/", (req, res) => {
  renderWithLayout(res, "index", { title: "GrammarZone" });
});

router.post("/solve", upload.single("image"), solveGrammar);

export default router;
