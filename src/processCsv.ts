import fs from "fs";
import csv from "csv-parser";
import { format } from "@fast-csv/format";
import OpenAI from "openai";
import dotenv from "dotenv";
import { systemContent, getPrompt } from "./instructions";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

interface CSVRow {
  Handle: string;
  "Variant SKU": string;
  Title: string;
  description: string;
  [key: string]: string;
}

async function processRow(row: CSVRow): Promise<CSVRow> {
  const description = row.description;
  const prompt = getPrompt(description);

  const response = await openai.chat.completions.create({
    messages: [
      { role: "system", content: systemContent },
      { role: "user", content: prompt },
    ],
    model: "gpt-4",
    temperature: 0.6,
    max_tokens: 500,
  });

  return {
    ...row,
    processedDescription:
      response.choices[0]?.message?.content || "<p>No response</p>",
  };
}

async function processCSV(inputFile: string, outputFile: string) {
  const rows: CSVRow[] = [];

  fs.createReadStream(inputFile)
    .pipe(csv())
    .on("data", (data) => rows.push(data))
    .on("end", async () => {
      const processedRows: CSVRow[] = [];

      for (const row of rows) {
        const processedRow = await processRow(row);
        processedRows.push(processedRow);
      }

      const ws = fs.createWriteStream(outputFile);
      const csvStream = format({ headers: true });
      csvStream.pipe(ws);
      processedRows.forEach((row) => csvStream.write(row));
      csvStream.end();
      console.log("CSV processing complete.");
    });
}

// Update these file paths as needed
const inputFilePath = "input-long.csv"; // Path to your input CSV file
const outputFilePath = "output.csv"; // Path to your output CSV file

processCSV(inputFilePath, outputFilePath);
