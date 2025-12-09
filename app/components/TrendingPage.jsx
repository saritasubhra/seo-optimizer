// app/routes/trending.jsx
import {
  Page,
  Text,
  Box,
  Card,
  Badge,
  Button,
  InlineStack,
  BlockStack,
} from "@shopify/polaris";
import { Link } from "@remix-run/react";

const TRENDING_TOPICS = [
  {
    title: "AI Writing Tools vs Human Writers",
    category: "Content Strategy",
    difficulty: "Intermediate",
    trendScore: "🔥 High",
    description:
      "Compare AI-generated content with human-written blogs, and show when to use each for maximum impact.",
    suggestedKeywords: ["AI content", "human writers", "content strategy"],
  },
  {
    title: "SEO for Beginners: 30-Day Blog Growth Plan",
    category: "SEO",
    difficulty: "Beginner",
    trendScore: "📈 Rising",
    description:
      "A practical, day-by-day guide that helps new bloggers grow organic traffic in one month.",
    suggestedKeywords: ["SEO for beginners", "blog growth", "30-day SEO"],
  },
  {
    title: "How to Repurpose One Blog into 10 Pieces of Content",
    category: "Content Repurposing",
    difficulty: "Intermediate",
    trendScore: "🔥 High",
    description:
      "Teach bloggers how to turn a single blog post into social posts, reels, newsletters, and more.",
    suggestedKeywords: [
      "content repurposing",
      "content batching",
      "creator tips",
    ],
  },
  {
    title: "Monetizing a Blog in 2025: What Still Works?",
    category: "Monetization",
    difficulty: "Advanced",
    trendScore: "⭐ Trending",
    description:
      "Break down the most effective monetization methods: affiliates, digital products, sponsorships, and more.",
    suggestedKeywords: [
      "blog monetization",
      "affiliate marketing",
      "blog income",
    ],
  },
  {
    title: "Writing Long-Form Content That Actually Gets Read",
    category: "Copywriting",
    difficulty: "Intermediate",
    trendScore: "📈 Rising",
    description:
      "Explain how to structure long-form posts with hooks, subheadings, and storytelling to keep readers engaged.",
    suggestedKeywords: [
      "long-form content",
      "copywriting tips",
      "blog structure",
    ],
  },
  {
    title: "Top Blogging Niches With Low Competition",
    category: "Niche Research",
    difficulty: "Beginner",
    trendScore: "🔥 High",
    description:
      "Help new bloggers choose niches where they can still rank and grow quickly.",
    suggestedKeywords: [
      "blogging niches",
      "low competition niches",
      "niche ideas",
    ],
  },
];

export const meta = () => {
  return [
    { title: "Trending Blog Topics | GoBlog Optimizer" },
    {
      name: "description",
      content:
        "Discover trending blogging topics you can write about right now.",
    },
  ];
};

export default function TrendingPage() {
  return (
    <Page
      title="Trending Blog Topics"
      subtitle="Fresh content ideas your audience (and Google) will love."
      primaryAction={{
        content: "Back to Dashboard",
        url: "/",
      }}
    >
      <Box paddingBlock="400">
        <Text as="p" variant="bodyMd" tone="subdued">
          Use these curated, high-performing topics to plan your next posts.
          Click “Use this topic” to send it into your blog optimizer workflow.
        </Text>
      </Box>

      <Box paddingBlock="200">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {TRENDING_TOPICS.map((topic) => (
            <Card key={topic.title}>
              <Box padding="400">
                <BlockStack gap="300">
                  {/* Title + badges row */}
                  <BlockStack gap="200">
                    <Text as="h2" variant="headingSm">
                      {topic.title}
                    </Text>

                    <InlineStack gap="200" align="start">
                      <Badge tone="success">{topic.category}</Badge>
                      <Badge tone="info">{topic.difficulty}</Badge>
                      <Badge tone="attention">{topic.trendScore}</Badge>
                    </InlineStack>
                  </BlockStack>

                  {/* Description */}
                  <Text as="p" variant="bodySm">
                    {topic.description}
                  </Text>

                  {/* Suggested keywords */}
                  <BlockStack gap="100">
                    <Text as="p" variant="bodyXs" tone="subdued">
                      Suggested keywords
                    </Text>
                    <InlineStack gap="150" wrap>
                      {topic.suggestedKeywords.map((kw) => (
                        <Box
                          key={kw}
                          paddingInline="200"
                          paddingBlock="100"
                          background="bg-subdued"
                          borderRadius="200"
                        >
                          <Text as="span" variant="bodyXs">
                            {kw}
                          </Text>
                        </Box>
                      ))}
                    </InlineStack>
                  </BlockStack>

                  {/* Actions */}
                  <InlineStack align="space-between">
                    <Button
                      variant="primary"
                      // TODO: wire this to your actual "create blog idea" or "optimize" route
                      url={`/optimize?topic=${encodeURIComponent(topic.title)}`}
                    >
                      Use this topic
                    </Button>

                    <Button
                      variant="tertiary"
                      url={`/keyword-research?seed=${encodeURIComponent(
                        topic.title,
                      )}`}
                    >
                      Deep keyword research
                    </Button>
                  </InlineStack>
                </BlockStack>
              </Box>
            </Card>
          ))}
        </div>
      </Box>

      {/* Optional link navigation if you prefer Remix Link instead of Page primaryAction */}
      <Box paddingBlockStart="400">
        <Link to="/">
          <Button variant="secondary">← Back to dashboard</Button>
        </Link>
      </Box>
    </Page>
  );
}
