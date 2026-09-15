import { Router } from "express";
const router = Router();

router.use("/products", (await import("../controllers/products/router.js")).default);
router.use("/categories", (await import("../controllers/categories/router.js")).default);

export default router;