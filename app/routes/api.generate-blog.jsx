export async function action({ request }) {
  try {
    const { topic, keywords, tone, length, outline, apiKey } =
      await request.json();

    if (!apiKey) {
      return Response.json(
        { error: "Missing Gemini API key" },
        { status: 400 },
      );
    }

    const prompt = `
You are an expert SEO blog writer.

Write a ${length.toLowerCase()} length, ${tone.toLowerCase()} tone blog post.

Topic: ${topic}
Primary Keywords: ${keywords.join(", ")}
Outline (if provided): ${outline || "Create a logical SEO structure."}

Requirements:
- SEO optimized title (H1)
- Use clear H2/H3 headings
- Naturally include keywords
- 100% human-readable
- No explanations, only the final blog content
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
        apiKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      },
    );

    const data = await response.json();

    const content =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Failed to generate content.";

    return Response.json({ content });
  } catch (err) {
    console.error("Gemini error:", err);
    return Response.json({ error: "AI generation failed" }, { status: 500 });
  }
}
