"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

// export const action = async ({ request }) => {
//   const { topic, keyword, tone, userApiKey } = await request.json();

//   const genAI = new GoogleGenerativeAI(userApiKey);
//   const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

//   const prompt = `Generate a 300–400 word blog on ${topic}. Tone: ${tone}. Include keyword: ${keyword}.`;

//   const result = await model.generateContent(prompt);

//   return Response.json({ content: result.response.text() });
// };

/* --- api/generate-blog-content.jsx --- */
export const action = async ({ request }) => {
  try {
    const { topic, keyword, tone, userApiKey } = await request.json();

    if (!userApiKey) {
      return Response.json({ error: "API Key is required" }, { status: 400 });
    }

    // Inside your server-side action
    const genAI = new GoogleGenerativeAI(userApiKey);

    // Pass the apiVersion configuration as the second argument
    const model = genAI.getGenerativeModel(
      { model: "gemini-2.5-flash" },
      { apiVersion: "v1" },
    );

    const prompt = `Generate a 300–400 word blog on ${topic}. Tone: ${tone}. Include keyword: ${keyword}.`;
    const result = await model.generateContent(prompt);

    // IMPORTANT: result.response.text() is an async-ish function in some SDK versions
    const text = await result.response.text();

    return Response.json({ content: text });
  } catch (error) {
    console.error("AI Generation Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
};
