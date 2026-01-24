"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export const action = async ({ request }) => {
  try {
    const { content, keyword, userApiKey } = await request.json();

    if (!userApiKey) {
      return Response.json({ error: "API Key is required" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(userApiKey);

    const model = genAI.getGenerativeModel(
      { model: "gemini-2.5-flash" },
      { apiVersion: "v1" },
    );

    const prompt = `
You are an SEO content editor.

TASK:
Improve the SEO of the blog content below.

STRICT RULES:
- DO NOT add any introduction, explanation, notes, or commentary.
- DO NOT include phrases like "Here is", "Optimized content", "*" , "**" or "---".
- DO NOT explain what you changed.
- DO NOT add bullet points outside the article.
- Return ONLY the optimized blog content.

CONTENT RULES:
- Preserve the original meaning.
- Do not invent new facts.
- Improve readability and structure.
- Optimize for the keyword: "${keyword}".
- Use proper headings (H2/H3).
- Keep length roughly the same.

BLOG CONTENT:
${content}
`;

    const result = await model.generateContent(prompt);

    // IMPORTANT: result.response.text() is an async-ish function in some SDK versions
    const text = await result.response.text();

    return Response.json({ content: text });
  } catch (error) {
    console.error("AI Generation Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
};
