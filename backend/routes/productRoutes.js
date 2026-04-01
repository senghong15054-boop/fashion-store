import express from "express";
import { body } from "express-validator";
import {
  addProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct
} from "../controllers/productController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

const productValidators = [
  body("name").trim().notEmpty(),
  body("slug").trim().notEmpty(),
  body("price").isFloat({ min: 0 }),
  body("stock").isInt({ min: 0 }),
  body("category").trim().notEmpty(),
  body("shortDescription").trim().notEmpty(),
  body("description").trim().notEmpty()
];

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/admin/product/add", authMiddleware, upload.single("image"), productValidators, addProduct);
router.put("/admin/product/:id", authMiddleware, upload.single("image"), productValidators, updateProduct);
router.delete("/admin/product/:id", authMiddleware, deleteProduct);

export default router;
