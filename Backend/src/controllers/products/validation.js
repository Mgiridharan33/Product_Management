import Joi from "joi";

export const productSchema = Joi.object({
    name: Joi.string().max(180).required(),
    sku: Joi.string().max(80).required(),
    description: Joi.string().allow(null, ""),
    price: Joi.number().min(0).required(),
    stock: Joi.number().integer().min(0).default(0),
    brand: Joi.string().max(120).allow(null, ""),
    categoryId: Joi.number().integer().min(1).required(),
    productType: Joi.string().valid("Physical", "Digital", "Service").default("Physical"),
    availability: Joi.string().valid("Available", "Pre-order", "Out of stock", "Unavailable").default("Available"),
    featured: Joi.boolean().default(false),
    returnable: Joi.boolean().default(true),
    availableDate: Joi.date().optional(),
    expiryDate: Joi.date().optional(),
    status: Joi.string().valid("Active", "Inactive").default("Active"),
});

export const productStatusSchema = Joi.object({
    status: Joi.string().valid("Active", "Inactive").required(),
})