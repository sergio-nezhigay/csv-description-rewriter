import OpenAI from "openai";
import dotenv from "dotenv";
import { systemContent, getPrompt } from "./instructions";
import { CSVRow } from "./types";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Correct access to the environment variable
});

export async function processRow(row: CSVRow): Promise<CSVRow> {
  const oldDescription = row.description;
  const prompt = getPrompt(oldDescription);

  try {
    const response = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemContent },
        { role: "user", content: prompt },
      ],
      model: "gpt-4o",
      temperature: 0.5,
      max_tokens: 600,
    });

    const formattedDescription =
      response.choices[0]?.message?.content || "<p>No response</p>";
    const description = formattedDescription
      .replace(/```html\n/, "")
      .replace(/```/, "");

    return {
      ...row,
      "old-description": oldDescription,
      description,
    };
  } catch (error) {
    console.error(
      `Error processing row with SKU ${row["Variant SKU"]}:`,
      error
    );
    return {
      ...row,
      "old-description": oldDescription,
      description: "<p>Error processing description</p>",
    };
  }
}
