import { CSVRow } from "./types";

export function validateInputRow(row: CSVRow): boolean {
  // Define length constraints for each field
  const handleMinLength = 3;
  const handleMaxLength = 100;

  const variantSkuMinLength = 3;
  const variantSkuMaxLength = 30;

  const titleMinLength = 4;
  const titleMaxLength = 255;

  const descriptionMinLength = 10;
  const descriptionMaxLength = 4500;

  // Check if all required fields are present, have correct types, and lengths
  if (
    !row.Handle ||
    typeof row.Handle !== "string" ||
    row.Handle.length < handleMinLength ||
    row.Handle.length > handleMaxLength
  ) {
    console.error(
      `Invalid row format: Handle is missing or out of length bounds in row ${JSON.stringify(
        row
      )}`
    );
    return false;
  }
  if (
    !row["Variant SKU"] ||
    typeof row["Variant SKU"] !== "string" ||
    row["Variant SKU"].length < variantSkuMinLength ||
    row["Variant SKU"].length > variantSkuMaxLength
  ) {
    console.error(
      `Invalid row format: Variant SKU is missing or out of length bounds in row ${JSON.stringify(
        row
      )}`
    );
    return false;
  }
  if (
    !row.Title ||
    typeof row.Title !== "string" ||
    row.Title.length < titleMinLength ||
    row.Title.length > titleMaxLength
  ) {
    console.error(
      `Invalid row format: Title is missing or out of length bounds in row ${JSON.stringify(
        row
      )}`
    );
    return false;
  }
  if (
    !row.description ||
    typeof row.description !== "string" ||
    row.description.length < descriptionMinLength ||
    row.description.length > descriptionMaxLength
  ) {
    console.error(
      `Invalid row format: description is missing or out of length bounds in row ${JSON.stringify(
        row
      )}`
    );
    return false;
  }

  // All checks passed, return true
  return true;
}
