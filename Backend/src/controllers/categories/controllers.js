
import { query } from "../../config/db.js";
import { isValidStatus } from "../../utils/validators.js";

const CATEGORY_WITH_COUNT_SELECT = `
  SELECT c.*, COUNT(p.id)::int AS product_count
  FROM categories c
  LEFT JOIN products p ON p.category_id = c.id
`;

export async function listCategories(req, res, next) {
    try {
        const { rows } = await query(`
      ${CATEGORY_WITH_COUNT_SELECT}
      GROUP BY c.id
      ORDER BY c.id DESC
    `);
        res.json({ success: true, data: rows });
    } catch (error) {
        next(error);
    }
}

export async function getCategory(req, res, next) {
    try {
        const { rows } = await query(
            `${CATEGORY_WITH_COUNT_SELECT} WHERE c.id = $1 GROUP BY c.id`,
            [req.params.id]
        );
        if (!rows[0]) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        next(error);
    }
}

export async function createCategory(req, res, next) {
    try {
        const { name, description = "", status = "Active" } = req.body;
        if (!name?.trim()) {
            return res.status(400).json({ success: false, message: "Category name is required" });
        }
        if (!isValidStatus(status)) {
            return res.status(400).json({ success: false, message: "Status must be Active or Inactive" });
        }
        const { rows } = await query(
            `INSERT INTO categories (name, description, status) VALUES ($1, $2, $3) RETURNING *`,
            [name.trim(), description, status]
        );
        console.log
        res.status(201).json({ success: true, message: "Category created" });
    } catch (error) {
        next(error);
    }
}

export async function updateCategory(req, res, next) {
    try {
        const { name, description = "", status = "Active" } = req.body;
        if (!name?.trim()) {
            return res.status(400).json({ success: false, message: "Category name is required" });
        }
        if (!isValidStatus(status)) {
            return res.status(400).json({ success: false, message: "Status must be Active or Inactive" });
        }
        const { rows } = await query(
            `UPDATE categories
       SET name = $1, description = $2, status = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`,
            [name.trim(), description, status, req.params.id]
        );
        if (!rows[0]) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        res.json({ success: true, data: rows[0], message: "Category updated" });
    } catch (error) {
        next(error);
    }
}

export async function updateCategoryStatus(req, res, next) {
    try {
        const { status } = req.body;
        if (!isValidStatus(status)) {
            return res.status(400).json({ success: false, message: "Status must be Active or Inactive" });
        }
        const { rows } = await query(
            `UPDATE categories SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
            [status, req.params.id]
        );
        if (!rows[0]) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        res.json({ success: true, data: rows[0], message: "Status updated" });
    } catch (error) {
        next(error);
    }
}

export async function deleteCategory(req, res, next) {
    try {
        const { rows: usage } = await query(
            `SELECT COUNT(*)::int AS count FROM products WHERE category_id = $1`,
            [req.params.id]
        );
        if (usage[0].count > 0) {
            return res.status(409).json({
                success: false,
                message: "This category still has products assigned to it and cannot be deleted.",
            });
        }
        const { rowCount } = await query(`DELETE FROM categories WHERE id = $1`, [req.params.id]);
        if (!rowCount) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        res.json({ success: true, message: "Category deleted" });
    } catch (error) {
        next(error);
    }
}
