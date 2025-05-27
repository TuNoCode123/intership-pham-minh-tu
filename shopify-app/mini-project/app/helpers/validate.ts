const isInventoryItemGID = (value: unknown): boolean =>
  typeof value === "string" &&
  /^gid:\/\/shopify\/InventoryItem\/\d+$/.test(value);

const isLocationGID = (value: unknown): boolean =>
  typeof value === "string" && /^gid:\/\/shopify\/Location\/\d+$/.test(value);

const isProductVariantGID = (value: unknown): boolean =>
  typeof value === "string" &&
  /^gid:\/\/shopify\/ProductVariant\/\d+$/.test(value);

const isNumber = (value: unknown): boolean =>
  typeof value === "string" && !isNaN(Number(value));

export { isInventoryItemGID, isLocationGID, isProductVariantGID, isNumber };
