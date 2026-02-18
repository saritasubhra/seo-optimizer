import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  try {
    const { admin } = await authenticate.admin(request);
    const data = await request.json();

    const response = await admin.graphql(
      `#graphql
      mutation articleCreate($article: ArticleCreateInput!) {
        articleCreate(article: $article) {
          article {
            id
            title
          }
          userErrors {
            field
            message
          }
        }
      }
      `,
      {
        variables: {
          article: {
            blogId: data.blogId, // ✅ MUST be inside article
            title: data.title,
            body: data.bodyHtml,
            tags: data.tags || [],
            isPublished: true,
            author: {
              name: "Gemini", // you can customize later
            },
            // image: data.image || null,
            // seo: {
            //   title: data.seoTitle,
            //   description: data.seoDescription,
            // },
          },
        },
      },
    );

    const result = await response.json();

    // Handle Shopify errors
    if (result.errors || result.data?.articleCreate?.userErrors?.length > 0) {
      console.error("Shopify articleCreate error:", result);
      return Response.json(
        { error: "Failed to create article", details: result },
        { status: 400 },
      );
    }

    return Response.json({
      success: true,
      article: result.data.articleCreate.article,
    });
  } catch (err) {
    console.error("🔥 article-create crashed:", err);
    return Response.json(
      { error: err.message || "Server error" },
      { status: 500 },
    );
  }
};
