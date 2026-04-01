import express from "express";
import { body } from "express-validator";
import {
  createOrder,
  getDashboardStats,
  getOrders,
  updateOrderStatus
} from "../controllers/orderController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/order",
  upload.single("paymentScreenshot"),
  [
    body("customerName").trim().notEmpty(),
    body("email").isEmail(),
    body("phone").trim().notEmpty(),
    body("address").trim().notEmpty(),
    body("subtotal").isFloat({ min: 0 }),
    body("total").isFloat({ min: 0 })
  ],
  createOrder
);

router.get("/admin/orders", authMiddleware, getOrders);
router.get("/admin/dashboard", authMiddleware, getDashboardStats);
router.post(
  "/admin/order/update/:id",
  authMiddleware,
  [body("status").isIn(["pending", "paid", "shipped"])],
  updateOrderStatus
);

export default router;
