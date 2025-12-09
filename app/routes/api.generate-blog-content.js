"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export const action = async ({ request }) => {
  const { topic, keyword, tone, userApiKey } = await request.json();

  const genAI = new GoogleGenerativeAI(userApiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `Generate a 300–400 word blog on ${topic}. Tone: ${tone}. Include keyword: ${keyword}.`;

  const result = await model.generateContent(prompt);

  return Response.json({ content: result.response.text() });
};
