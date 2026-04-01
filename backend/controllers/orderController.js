import pool from "../config/db.js";
import { validationResult } from "express-validator";

export const createOrder = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const {
      customerName,
      email,
      phone,
      address,
      note,
      couponCode,
      subtotal,
      discount,
      total,
      items: rawItems
    } = req.body;

    const items = typeof rawItems === "string" ? JSON.parse(rawItems) : rawItems;

    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("Order items are required");
    }

    const screenshotPath = req.file ? `/uploads/${req.file.filename}` : null;

    if (!screenshotPath) {
      throw new Error("Payment screenshot is required");
    }

    const [orderResult] = await connection.query(
      `INSERT INTO orders
      (customer_name, email, phone, address, note, coupon_code, subtotal, discount, total, status, payment_screenshot)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
      [
        customerName,
        email,
        phone,
        address,
        note || null,
        couponCode || null,
        Number(subtotal),
        Number(discount || 0),
        Number(total),
        screenshotPath
      ]
    );

    for (const item of items) {
      await connection.query(
        `INSERT INTO order_items (order_id, product_id, size, qty, price)
         VALUES (?, ?, ?, ?, ?)`,
        [orderResult.insertId, item.productId, item.size, Number(item.qty), Number(item.price)]
      );

      const [stockUpdate] = await connection.query(
        `UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?`,
        [Number(item.qty), item.productId, Number(item.qty)]
      );

      if (stockUpdate.affectedRows === 0) {
        throw new Error("One or more products are out of stock");
      }
    }

    await connection.commit();

    return res.status(201).json({
      message: "Order placed successfully",
      orderId: orderResult.insertId
    });
  } catch (error) {
    await connection.rollback();
    return res.status(500).json({ message: error.message || "Failed to create order" });
  } finally {
    connection.release();
  }
};

export const getOrders = async (_req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT id, customer_name, email, phone, address, note, coupon_code, subtotal, discount, total, status, payment_screenshot, created_at
       FROM orders
       ORDER BY created_at DESC`
    );

    const [items] = await pool.query(
      `SELECT oi.order_id, oi.product_id, oi.size, oi.qty, oi.price, p.name, p.image
       FROM order_items oi
       INNER JOIN products p ON p.id = oi.product_id
       ORDER BY oi.order_id DESC, oi.id ASC`
    );

    const itemsByOrder = items.reduce((acc, item) => {
      if (!acc[item.order_id]) acc[item.order_id] = [];
      acc[item.order_id].push(item);
      return acc;
    }, {});

    return res.json(
      orders.map((order) => ({
        ...order,
        items: itemsByOrder[order.id] || []
      }))
    );
  } catch (error) {
    return res.status(500).json({ message: "Failed to load orders" });
  }
};

export const updateOrderStatus = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const [existing] = await pool.query("SELECT status FROM orders WHERE id = ?", [req.params.id]);

    if (!existing.length) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (req.body.status === "shipped" && existing[0].status !== "paid") {
      return res.status(400).json({ message: "Order must be marked paid before it can be shipped" });
    }

    await pool.query(
      "UPDATE orders SET status = ? WHERE id = ?",
      [req.body.status, req.params.id]
    );

    return res.json({ message: "Order updated" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update order" });
  }
};

export const getDashboardStats = async (_req, res) => {
  try {
    const [[sales]] = await pool.query(
      "SELECT COALESCE(SUM(total), 0) AS totalSales, COUNT(*) AS totalOrders FROM orders"
    );
    const [statusStats] = await pool.query(
      "SELECT status, COUNT(*) AS count FROM orders GROUP BY status"
    );
    const [[productCount]] = await pool.query(
      "SELECT COUNT(*) AS totalProducts FROM products"
    );

    return res.json({
      ...sales,
      totalProducts: productCount.totalProducts,
      statusStats
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load dashboard" });
  }
};
