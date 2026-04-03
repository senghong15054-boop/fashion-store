import pool from "../config/db.js";
import { validationResult } from "express-validator";

const parseBoolean = (value) => value === true || value === "true" || value === 1 || value === "1";

const normalizeArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return value.split(",").map((item) => item.trim()).filter(Boolean);
    }
  }
  return [];
};

const normalizeUploadPaths = (files = []) => files.map((file) => `/uploads/${file.filename}`);

export const getProducts = async (req, res) => {
  try {
    const { search = "", category = "", page = 1, limit = 9 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const filters = [];
    const params = [];

    if (search) {
      filters.push("(name LIKE ? OR description LIKE ?)");
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
      filters.push("category = ?");
      params.push(category);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

    const [items] = await pool.query(
      `SELECT id, name, slug, price, compare_price, image, gallery, sizes, stock, sale, category, badge, short_description, description, is_featured
       , colors
       FROM products
       ${whereClause}
       ORDER BY id DESC
       LIMIT ? OFFSET ?`,
      [...params, Number(limit), offset]
    );

    const [countResult] = await pool.query(
      `SELECT COUNT(*) AS total FROM products ${whereClause}`,
      params
    );

    return res.json({
      items: items.map((item) => ({
        ...item,
        gallery: JSON.parse(item.gallery || "[]"),
        colors: JSON.parse(item.colors || "[]"),
        sizes: JSON.parse(item.sizes || "[]")
      })),
      total: countResult[0].total,
      page: Number(page),
      pages: Math.ceil(countResult[0].total / Number(limit))
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load products" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, slug, price, compare_price, image, gallery, sizes, stock, sale, category, badge, short_description, description, is_featured
       , colors
       FROM products
       WHERE id = ?`,
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = rows[0];

    return res.json({
      ...product,
      gallery: JSON.parse(product.gallery || "[]"),
      colors: JSON.parse(product.colors || "[]"),
      sizes: JSON.parse(product.sizes || "[]")
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load product" });
  }
};

export const addProduct = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      name,
      slug,
      price,
      comparePrice,
      colors,
      sizes,
      stock,
      sale,
      category,
      badge,
      shortDescription,
      description,
      isFeatured,
      gallery = []
    } = req.body;

    const imageFile = req.files?.image?.[0];
    const galleryFiles = req.files?.gallery || [];
    const imagePath = imageFile ? `/uploads/${imageFile.filename}` : req.body.image;
    const galleryPaths = [
      ...normalizeArray(gallery),
      ...normalizeUploadPaths(galleryFiles)
    ];

    if (!imagePath) {
      return res.status(400).json({ message: "Main product image is required" });
    }

    const [result] = await pool.query(
      `INSERT INTO products
      (name, slug, price, compare_price, image, gallery, colors, sizes, stock, sale, category, badge, short_description, description, is_featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        slug,
        Number(price),
        Number(comparePrice || 0),
        imagePath,
        JSON.stringify(galleryPaths),
        JSON.stringify(normalizeArray(colors)),
        JSON.stringify(normalizeArray(sizes)),
        Number(stock),
        parseBoolean(sale) ? 1 : 0,
        category,
        badge || null,
        shortDescription,
        description,
        parseBoolean(isFeatured) ? 1 : 0
      ]
    );

    return res.status(201).json({ id: result.insertId, message: "Product created" });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to add product" });
  }
};

export const updateProduct = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      name,
      slug,
      price,
      comparePrice,
      colors,
      sizes,
      stock,
      sale,
      category,
      badge,
      shortDescription,
      description,
      isFeatured,
      gallery = [],
      image
    } = req.body;

    const imageFile = req.files?.image?.[0];
    const galleryFiles = req.files?.gallery || [];
    const imagePath = imageFile ? `/uploads/${imageFile.filename}` : image;
    const galleryPaths = galleryFiles.length
      ? normalizeUploadPaths(galleryFiles)
      : normalizeArray(gallery);

    await pool.query(
      `UPDATE products
       SET name = ?, slug = ?, price = ?, compare_price = ?, image = ?, gallery = ?, colors = ?, sizes = ?, stock = ?, sale = ?, category = ?, badge = ?, short_description = ?, description = ?, is_featured = ?
       WHERE id = ?`,
      [
        name,
        slug,
        Number(price),
        Number(comparePrice || 0),
        imagePath,
        JSON.stringify(galleryPaths),
        JSON.stringify(normalizeArray(colors)),
        JSON.stringify(normalizeArray(sizes)),
        Number(stock),
        parseBoolean(sale) ? 1 : 0,
        category,
        badge || null,
        shortDescription,
        description,
        parseBoolean(isFeatured) ? 1 : 0,
        req.params.id
      ]
    );

    return res.json({ message: "Product updated" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update product" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await pool.query("DELETE FROM products WHERE id = ?", [req.params.id]);
    return res.json({ message: "Product deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete product" });
  }
};
