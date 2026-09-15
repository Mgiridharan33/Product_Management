export const ALLOWED_STATUSES = ["Active", "Inactive"];

export function isValidStatus(value) {
  return ALLOWED_STATUSES.includes(value);
}

export function orDefault(value, fallback = null) {
  return value === undefined || value === "" ? fallback : value;
}

export function toBoolean(value) {
  return value === true || value === "true";
}

export function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
}
