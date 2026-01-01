import { useLoaderData, useNavigate } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const loader = async ({ request, params }) => {
  await authenticate.admin(request);

  const { id } = params;

  console.log(id);

  // Query the database directly instead of using fetch()
  const post = await prisma.post.findUnique({
    where: { id: id }, // Use Number(id) if your DB ID is an integer
  });

  console.log(post);

  if (!post) {
    throw new Response("Blog post not found", { status: 404 });
  }

  return { post };
};

export default function BlogDetailPage() {
  const { post } = useLoaderData();
  const navigate = useNavigate();

  if (!post) return <div>No post data found in component.</div>;

  const styles = {
    mainWrapper: {
      minHeight: "100vh",
      width: "100%",
      background:
        "linear-gradient(135deg, #f5f7fa 0%, #ffffff 50%, #f0f9ff 100%)",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "San Francisco", "Segoe UI", Roboto, sans-serif',
      margin: "0",
      padding: "0",
      boxSizing: "border-box",
    },

    navWrapper: {
      display: "flex",
      justifyContent: "center",
      padding: "12px 0",
      backgroundColor: "#ffffff",
      borderBottom: "1px solid #e1e3e5",
      marginBottom: "40px",
      boxShadow: "0 1px 0 rgba(0, 0, 0, 0.05)",
    },

    navLinks: {
      display: "flex",
      gap: "40px",
    },

    navLinkItem: {
      fontSize: "16px",
      fontWeight: "500",
      color: "#212b36",
      cursor: "pointer",
      padding: "8px 12px",
    },

    contentContainer: {
      maxWidth: "800px",
      margin: "0 auto",
      padding: "0 20px 60px 20px",
    },

    backButton: {
      background: "none",
      border: "none",
      color: "#0f766e",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "600",
      marginBottom: "20px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },

    title: {
      fontSize: "42px",
      fontWeight: "800",
      marginBottom: "20px",
      color: "#0f172a",
      lineHeight: "1.2",
    },

    badgeRow: {
      display: "flex",
      gap: "12px",
      marginBottom: "32px",
    },

    badgeSeo: {
      padding: "6px 14px",
      background: "#e0f2fe",
      color: "#0369a1",
      borderRadius: "20px",
      fontWeight: "700",
      fontSize: "13px",
      textTransform: "uppercase",
    },

    badgeKeyword: {
      padding: "6px 14px",
      background: "#ecfeff",
      color: "#0f766e",
      borderRadius: "20px",
      fontWeight: "700",
      fontSize: "13px",
      textTransform: "uppercase",
    },

    article: {
      fontSize: "18px",
      lineHeight: "1.8",
      color: "#334155",
      whiteSpace: "pre-wrap",
      backgroundColor: "white",
      padding: "40px",
      borderRadius: "12px",
      border: "1px solid #e2e8f0",
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    },
  };

  return (
    <div style={styles.mainWrapper}>
      {/* Navbar for consistency */}

      {/* <nav style={styles.navWrapper}>
        <div style={styles.navLinks}>
          <span style={styles.navLinkItem} onClick={() => navigate("/app")}>
            Home
          </span>

          <span
            style={styles.navLinkItem}
            onClick={() => navigate("/app/blogs")}
          >
            Blog
          </span>
        </div>
      </nav> */}

      <div style={styles.contentContainer}>
        <button
          style={styles.backButton}
          onClick={() => navigate("/app/blogs")}
        >
          ← Back to all posts
        </button>

        <h1 style={styles.title}>{post.title}</h1>

        <div style={styles.badgeRow}>
          <span style={styles.badgeSeo}>SEO Score: {post.score}</span>

          <span style={styles.badgeKeyword}>Keyword: {post.keyword}</span>
        </div>

        <article style={styles.article}>{post.content}</article>
      </div>
    </div>
  );
}

export const headers = (headersArgs) => boundary.headers(headersArgs);
