import { Router } from "express";
import { createCategory, deleteCategory, getCategory, listCategories, updateCategory, updateCategoryStatus } from "./Controllers.js";

const router = Router();

router.get("/", listCategories);
router.get("/:id", getCategory);
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.patch("/:id", updateCategoryStatus);
router.delete("/:id", deleteCategory);

export default router;