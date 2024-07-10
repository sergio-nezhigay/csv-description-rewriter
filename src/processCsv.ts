import fs from "fs";
import csv from "csv-parser";
import { format } from "@fast-csv/format";
import dotenv from "dotenv";
import { CSVRow } from "./types";
import { processRow } from "./processRow";
import { validateInputRow } from "./validate";

dotenv.config();

async function processCSV(inputFile: string, outputFile: string) {
  const rows: CSVRow[] = [];

  fs.createReadStream(inputFile)
    .pipe(csv())
    .on("data", (data) => rows.push(data))
    .on("end", async () => {
      const processedRows: CSVRow[] = [];
      const totalRows = rows.length;
      let processedCount = 0;

      for (const row of rows) {
        if (!validateInputRow(row)) {
          console.error(`Invalid row format: ${JSON.stringify(row)}`);
          return;
        }
      }

      for (const row of rows) {
        const processedRow = await processRow(row);
        processedRows.push(processedRow);
        processedCount++;

        if (processedCount % 10 === 0 || processedCount === totalRows) {
          const percentage = ((processedCount / totalRows) * 100).toFixed(2);
          console.log(
            `Processed ${processedCount}/${totalRows} rows (${percentage}%)`
          );
        }
      }

      const ws = fs.createWriteStream(outputFile, { flags: "w" });
      const csvStream = format({ headers: true });
      csvStream.pipe(ws);
      processedRows.forEach((row) => csvStream.write(row));
      csvStream.end();
      console.log("CSV processing complete.");
    })
    .on("error", (error) => {
      console.error("Error reading CSV file:", error);
    });
}

// Update these file paths as needed
const inputFilePath = "input-long.csv"; // Path to your input CSV file
const outputFilePath = "output.csv"; // Path to your output CSV file

processCSV(inputFilePath, outputFilePath);
