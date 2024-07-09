import fs from 'fs';
import csv from 'csv-parser';
import { format } from '@fast-csv/format';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'], // Ensure you have set your API key in the .env file
});

interface CSVRow {
  content: string;
  [key: string]: string;
}

async function processRow(row: CSVRow): Promise<CSVRow> {
  const content = row.content;
  const response = await openai.chat.completions.create({
    messages: [{ role: 'user', content: content }],
    model: 'gpt-3.5-turbo',
  });

  return {
    ...row,
    processedContent: response.choices[0]?.message?.content || 'No response',
  };
}

async function processCSV(inputFile: string, outputFile: string) {
  const rows: CSVRow[] = [];

  fs.createReadStream(inputFile)
    .pipe(csv())
    .on('data', (data) => rows.push(data))
    .on('end', async () => {
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
      console.log('CSV processing complete.');
    });
}

// Update these file paths as needed
const inputFilePath = 'input.csv';
const outputFilePath = 'output.csv';

processCSV(inputFilePath, outputFilePath);
