import express from "express";
import { body } from "express-validator";
import { adminLogin, customerLogin, customerRegister } from "../controllers/adminController.js";
import { addProduct, deleteProduct, updateProduct } from "../controllers/productController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { productUpload } from "../middleware/uploadMiddleware.js";

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

router.post(
  "/admin/login",
  [body("username").trim().notEmpty(), body("password").trim().notEmpty()],
  adminLogin
);
router.post(
  "/auth/register",
  [
    body("fullName").trim().notEmpty(),
    body("username").trim().isLength({ min: 3 }),
    body("email").isEmail(),
    body("password").isLength({ min: 6 })
  ],
  customerRegister
);
router.post(
  "/auth/login",
  [body("email").isEmail(), body("password").trim().notEmpty()],
  customerLogin
);
router.post("/admin/product/add", authMiddleware, productUpload, productValidators, addProduct);
router.put("/admin/product/:id", authMiddleware, productUpload, productValidators, updateProduct);
router.delete("/admin/product/:id", authMiddleware, deleteProduct);

export default router;
