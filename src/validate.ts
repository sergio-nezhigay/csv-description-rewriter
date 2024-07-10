import { CSVRow } from "./types";

export function validateInputRow(row: CSVRow): boolean {
  // Define length constraints for each field
  const handleMinLength = 3;
  const handleMaxLength = 100;

  const variantSkuMinLength = 3;
  const variantSkuMaxLength = 30;

  const titleMinLength = 4;
  const titleMaxLength = 255;

  const descriptionMinLength = 1;
  const descriptionMaxLength = 1000;

  // Check if all required fields are present, have correct types, and lengths
  if (
    !row.Handle ||
    typeof row.Handle !== "string" ||
    row.Handle.length < handleMinLength ||
    row.Handle.length > handleMaxLength
  )
    return false;
  if (
    !row["Variant SKU"] ||
    typeof row["Variant SKU"] !== "string" ||
    row["Variant SKU"].length < variantSkuMinLength ||
    row["Variant SKU"].length > variantSkuMaxLength
  )
    return false;
  if (
    !row.Title ||
    typeof row.Title !== "string" ||
    row.Title.length < titleMinLength ||
    row.Title.length > titleMaxLength
  )
    return false;
  if (
    !row.description ||
    typeof row.description !== "string" ||
    row.description.length < descriptionMinLength ||
    row.description.length > descriptionMaxLength
  )
    return false;

  // All checks passed, return true
  return true;
}
