import { query } from "../../config/db.js";
import { isValidStatus, orDefault, toBoolean, toNumber } from "../../utils/validators.js";
import { productSchema, productStatusSchema } from "./validation.js";
const PRODUCT_WITH_CATEGORY_SELECT = `
  SELECT p.*, c.name AS category_name
  FROM products p
  JOIN categories c ON c.id = p.category_id
`;

function normalizeProductBody(body = {}, req = {}) {
    const normalized = { ...body };

    if (!normalized.categoryId && normalized.category_id) {
        normalized.categoryId = normalized.category_id;
    }

    if (!normalized.productType && normalized.product_type) {
        normalized.productType = normalized.product_type;
    }

    if (!normalized.availableDate && normalized.available_date) {
        normalized.availableDate = normalized.available_date;
    }

    if (!normalized.expiryDate && normalized.expiry_date) {
        normalized.expiryDate = normalized.expiry_date;
    }

    if (!normalized.id && req.params?.id) {
        normalized.id = req.params.id;
    }

    return normalized;
}

function buildProductValues(body, existingImageUrl) {
    const image = orDefault(body.image_url, existingImageUrl);
    return {
        name: body.name.trim(),
        sku: body.sku.trim(),
        description: orDefault(body.description, ""),
        price: toNumber(body.price, 0),
        stock: toNumber(body.stock, 0),
        brand: orDefault(body.brand, ""),
        categoryId: toNumber(body.categoryId),
        productType: orDefault(body.productType || body.product_type, "Physical"),
        availability: orDefault(body.availability, "Available"),
        featured: toBoolean(body.featured),
        returnable: body.returnable === undefined ? true : toBoolean(body.returnable),
        availableDate: orDefault(body.availableDate || body.available_date),
        expiryDate: orDefault(body.expiryDate || body.expiry_date),
        imageUrl: image,
        status: orDefault(body.status, "Active"),
    };
}

function hasRequiredFields(body) {
    return Boolean(body.name?.trim() && body.sku?.trim() && body.category_id);
}

export async function listProducts(req, res, next) {
    try {
        const { rows } = await query(`${PRODUCT_WITH_CATEGORY_SELECT} ORDER BY p.id DESC`);
        res.json({ success: true, data: rows });
    } catch (error) {
        next(error);
    }
}

export async function getProduct(req, res, next) {
    try {
        const { rows } = await query(`${PRODUCT_WITH_CATEGORY_SELECT} WHERE p.id = $1`, [req.params.id]);
        if (!rows[0]) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        next(error);
    }
}

export async function saveProduct(req, res, next) {
    try {
        const normalizedBody = normalizeProductBody(req.body, req);
        const targetId = normalizedBody.id || req.params?.id;

        const { error, value } = productSchema.validate(normalizedBody, {
            abortEarly: false,
            convert: true,
            allowUnknown: true,
            stripUnknown: true,
        });

        if (error) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                details: error.details.map(d => d.message),
            });
        }
        const cat = await query(`SELECT id FROM categories WHERE id = $1`, [value.categoryId]);
        if (!cat.rows[0]) {
            return res.status(400).json({ success: false, message: "Invalid categoryId" });
        }
        let uploadedImage = req.file ? `/uploads/${req.file.filename}` : null;
        if (targetId) {
            const current = await query(`SELECT image_url FROM products WHERE id = $1`, [targetId]);
            if (!current.rows[0]) {
                return res.status(404).json({ success: false, message: "Product not found" });
            }
            uploadedImage = uploadedImage || current.rows[0].image_url;
        }
        const v = buildProductValues(value, uploadedImage);
        let rows;
        if (targetId) {
            const result = await query(
                `UPDATE products SET
          name = $1, sku = $2, description = $3, price = $4, stock = $5, brand = $6,
          category_id = $7, product_type = $8, availability = $9, featured = $10,
          returnable = $11, available_date = $12, expiry_date = $13, image_url = $14,
          status = $15, updated_at = CURRENT_TIMESTAMP
         WHERE id = $16
         RETURNING *`,
                [
                    v.name, v.sku, v.description, Number(v.price), Number(v.stock), v.brand, Number(v.categoryId),
                    v.productType, v.availability, v.featured, v.returnable,
                    v.availableDate, v.expiryDate, v.imageUrl, v.status, Number(targetId),
                ]
            );
            rows = result.rows;
        } else {
            const result = await query(
                `INSERT INTO products
          (name, sku, description, price, stock, brand, category_id, product_type,
           availability, featured, returnable, available_date, expiry_date, image_url, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
         RETURNING *`,
                [
                    v.name, v.sku, v.description, Number(v.price), Number(v.stock), v.brand, Number(v.categoryId),
                    v.productType, v.availability, v.featured, v.returnable,
                    v.availableDate, v.expiryDate, v.imageUrl, v.status,
                ]
            );
            rows = result.rows;
        }
        res.status(targetId ? 200 : 201).json({
            success: true,
            data: rows[0],
            message: targetId ? "Product updated" : "Product created",
        });
    } catch (error) {
        console.log("Error in saveProduct:", error);
        next(error);
    }
}



export async function updateProductStatus(req, res, next) {
    try {
        const { error, value } = productStatusSchema.validate(req.body, {
            abortEarly: false,
            convert: true,
            allowUnknown: false,
            stripUnknown: true,
        });
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                details: error.details.map(d => d.message),
            });
        }
        const { rows } = await query(
            `UPDATE products SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
            [value.status, req.params.id]
        );
        if (!rows[0]) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.json({ success: true, message: "Status updated" });
    } catch (error) {
        console.log("Error in updateProductStatus:", error);
        next(error);
    }
}

export async function deleteProduct(req, res, next) {
    try {
        const { rowCount } = await query(`DELETE FROM products WHERE id = $1`, [req.params.id]);
        if (!rowCount) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.json({ success: true, message: "Product deleted" });
    } catch (error) {
        next(error);
    }
}
