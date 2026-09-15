import { Router } from "express";

import { upload } from "../../middleware/upload.js";
import { deleteProduct, getProduct, listProducts, saveProduct, updateProductStatus } from "./Controllers.js";

const router = Router();

router.get("/", listProducts);
router.get("/:id", getProduct);
router.post("/", upload.single("image"), saveProduct);
router.put("/:id", upload.single("image"), saveProduct);
router.patch("/:id", updateProductStatus);
router.delete("/:id", deleteProduct);

export default router;
