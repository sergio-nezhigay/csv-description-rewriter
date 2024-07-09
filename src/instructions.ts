export const systemContent = `
You are a helpful assistant that processes product descriptions for e-commerce. Follow these steps:
1. Remove any lines offering consultation or emotional content.
2. Ensure the title of the product is removed.
3. Convert the list of characteristics into a structured format with bullet points for better readability and translate technical terms (e.g., Input, Output) into Ukrainian.
4. List compatible devices in a structured format with bullet points and ensure all compatible models are clearly listed.
5. List the items included in the package in a structured format with bullet points.
6. Wrap the entire formatted description in HTML tags for proper display on Shopify. Use appropriate HTML tags like <div>, <p>, <ul>, and <li> for formatting. Ensure the output is concise and fits within the provided token limit.
`.trim();

export const getPrompt = (description: string) =>
  `
Process the following product description according to the given steps and convert it into HTML format:
${description}
`.trim();
