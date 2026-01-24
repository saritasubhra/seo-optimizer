import { useNavigate } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export const action = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function Index() {
  const shopify = useAppBridge();
  const navigate = useNavigate();

  // Unified styles object
  const styles = {
    // --- LAYOUT & CONTAINER STYLES ---

    // The main wrapper is set to full width and removes any internal margin/padding
    // that might be imposed by the default app template.
    mainWrapper: {
      width: "100%",
      minHeight: "100vh",
      // IMPORTANT: Overrides to ensure full width and no surrounding admin padding
      // You may need to inspect the outer frame's CSS and adjust the parent div's
      // padding to truly get edge-to-edge content.
      margin: "0",
      padding: "0",
      boxSizing: "border-box",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "San Francisco", "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
      backgroundColor: "#f4f6f8", // Light background for a clean look (similar to Polaris)
    },

    // Fixed-width content container for the Hero section
    contentContainer: {
      maxWidth: "1200px", // Increased width for a more open layout
      margin: "0 auto",
      padding: "40px 20px",
      textAlign: "center",
      position: "relative",
      zIndex: 10,
    },

    // --- NAVBAR STYLES ---
    navWrapper: {
      display: "flex",
      justifyContent: "center",
      padding: "12px 0",
      backgroundColor: "#ffffff", // White background
      borderBottom: "1px solid #e1e3e5", // Subtle bottom border (Polaris-like)
      marginBottom: "40px",
      boxShadow: "0 1px 0 rgba(0, 0, 0, 0.05)",
      width: "100%",
      top: 0,
      zIndex: 100, // Fixed position removed to avoid conflicts, placed inside main wrapper
    },
    navLinks: {
      display: "flex",
      gap: "40px",
      fontSize: "16px",
      fontWeight: "500",
      color: "#212b36",
    },
    navLinkItem: {
      padding: "8px 12px",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "background-color 0.2s, color 0.2s",
      userSelect: "none",
      zIndex: 100,
    },
    navLinkActive: {
      backgroundColor: "#e4e5e7", // Light gray for active state
      fontWeight: "600",
      color: "#00848e", // Accent color
    },

    // --- HERO STYLES ---
    badge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      border: "1px solid #c9c9c9",
      borderRadius: "24px",
      padding: "8px 16px",
      marginBottom: "24px",
      fontSize: "14px",
      fontWeight: "500",
      color: "#0f766e",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    },
    title: {
      fontSize: "56px",
      fontWeight: "800",
      background: "linear-gradient(135deg, #0f172a 0%, #0f766e 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      marginBottom: "20px",
      lineHeight: "1.1",
    },
    subtitle: {
      fontSize: "20px",
      color: "#475569",
      maxWidth: "700px",
      margin: "0 auto 40px",
      lineHeight: "1.6",
    },
    button: {
      background: "linear-gradient(135deg, #20b2aa 0%, #1a9a92 100%)",
      color: "white",
      border: "none",
      padding: "16px 36px",
      fontSize: "18px",
      fontWeight: "600",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 8px 20px rgba(32, 178, 170, 0.3)",
    },
    helperText: {
      fontSize: "14px",
      color: "#7e8b9a",
      fontWeight: "400",
      marginTop: "12px",
    },
    // --- DECORATIVE SHAPES ---
    decorativeCircle1: {
      position: "absolute",
      width: "500px",
      height: "500px",
      background:
        "radial-gradient(circle, rgba(79, 172, 254, 0.1) 0%, transparent 70%)",
      borderRadius: "50%",
      top: "100px",
      right: "50px",
    },
    decorativeCircle2: {
      position: "absolute",
      width: "400px",
      height: "400px",
      background:
        "radial-gradient(circle, rgba(32, 178, 170, 0.08) 0%, transparent 70%)",
      borderRadius: "50%",
      bottom: "0px",
      left: "0px",
    },
  };

  const handleButtonClick = () => {
    shopify.toast.show("Redirecting to Blog setup...");
    navigate("/app/seo");
  };

  // We are removing the <s-page> tag as that is likely a custom web component
  // that imposes the width restriction you are experiencing.
  return (
    <div style={styles.mainWrapper}>
      {/* DECORATIVE SHAPES */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          zIndex: 0,
        }}
      >
        {/* <div style={styles.decorativeCircle1}></div> */}
        {/* <div style={styles.decorativeCircle2}></div> */}
      </div>

      {/* NAVBAR: Now uses a full-width div */}
      <nav style={styles.navWrapper}>
        <div style={styles.navLinks}>
          <span
            style={{ ...styles.navLinkItem, ...styles.navLinkActive }}
            onClick={() => navigate("/app")}
          >
            Home
          </span>

          <span style={styles.navLinkItem} onClick={() => navigate("/app/seo")}>
            Blogs
          </span>
          {/* 
          <span style={styles.navLinkItem} onClick={() => navigate("/app/seo")}>
            SEO
          </span> */}
        </div>
      </nav>

      {/* HERO CONTENT CONTAINER: Max-width centers content */}
      <div style={styles.contentContainer}>
        {/* HERO */}
        <div>
          <div style={styles.badge}>✨ **AI-Powered Content Creation**</div>

          <h1 style={styles.title}>Shopify AI SEO Blog</h1>

          <p style={styles.subtitle}>
            Transform your Shopify store with intelligent, **SEO-rich blog
            posts**. Create compelling content that drives traffic and converts
            visitors.
          </p>

          <button style={styles.button} onClick={handleButtonClick}>
            Start Creating Blog Posts →
          </button>

          <p style={styles.helperText}>
            No credit card required • **Free to get started**
          </p>
        </div>
      </div>
    </div>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
