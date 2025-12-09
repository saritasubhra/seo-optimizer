import React, { useState } from "react";
import {
  Zap,
  TrendingUp,
  BarChart3,
  Search,
  Lightbulb,
  Grid3X3,
  Clock,
} from "lucide-react";

// Mock data representing trending blog topics
const initialTopics = [
  {
    id: 1,
    title: "AI-Powered E-commerce Automation",
    description:
      "Exploring how small to mid-sized Shopify stores can leverage generative AI for marketing copy and inventory management.",
    potential: "High (9/10)",
    category: "Technology",
    keywords: [
      "AI for Shopify",
      "E-commerce automation",
      "Generative AI marketing",
    ],
    icon: Zap,
    trend: "New & Fast Growth",
  },
  {
    id: 2,
    title: "Sustainable Packaging Trends 2024",
    description:
      "A deep dive into zero-waste packaging, compostable materials, and how to communicate sustainability efforts to conscious consumers.",
    potential: "Medium (7/10)",
    category: "Logistics",
    keywords: [
      "Sustainable packaging",
      "Zero-waste shipping",
      "Eco-friendly e-commerce",
    ],
    icon: TrendingUp,
    trend: "Steady & Reliable",
  },
  {
    id: 3,
    title: "The Rise of Video Shopping (Live and Short-Form)",
    description:
      "A guide on integrating live stream shopping and TikTok/Reel content directly into the Shopify storefront using new apps.",
    potential: "High (8/10)",
    category: "Marketing",
    keywords: [
      "Live commerce",
      "TikTok shopping",
      "Short-form video marketing",
    ],
    icon: BarChart3,
    trend: "Peaking Interest",
  },
  {
    id: 4,
    title: "Headless Commerce: Is it Right for Small Brands?",
    description:
      "Analyzing the pros and cons of moving to a headless setup for speed and flexibility, focusing on the budget implications.",
    potential: "Medium (6/10)",
    category: "Development",
    keywords: ["Headless Shopify", "Front-end speed", "Hydrogen framework"],
    icon: Grid3X3,
    trend: "Niche & Technical",
  },
  {
    id: 5,
    title: "Mastering Q4 Holiday SEO Strategies",
    description:
      "Essential last-minute SEO tactics for Black Friday/Cyber Monday, focusing on long-tail keywords and localized content.",
    potential: "Seasonal (10/10)",
    category: "SEO",
    keywords: ["BFCM SEO", "Holiday marketing", "Q4 e-commerce"],
    icon: Clock,
    trend: "High Seasonality",
  },
];

const PRIMARY_COLOR = "#23b5b5";
const HOVER_COLOR = "#1e9999"; // Slightly darker for hover effect
const LIGHT_ACCENT_BG = "#e8fafa"; // Very light tint of the primary color

/**
 * Reusable Card component for a single trending topic.
 */
const TopicCard = ({ topic }) => {
  const Icon = topic.icon;

  const getPotentialColor = (potential) => {
    // Keep standard semantic colors for readability (High/Medium/Seasonal)
    if (potential.includes("High") || potential.includes("10/10"))
      return "text-red-600 bg-red-100";
    if (
      potential.includes("Medium") ||
      potential.includes("7/10") ||
      potential.includes("8/10")
    )
      return "text-amber-600 bg-amber-100";
    return "text-green-600 bg-green-100";
  };

  return (
    <div className="bg-white p-6 border border-gray-100 rounded-xl shadow-lg hover:shadow-xl transition duration-300 flex flex-col h-full">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          {/* Accent colored icon container */}
          <div
            className={`p-3 rounded-full text-[${PRIMARY_COLOR}]`}
            style={{ backgroundColor: LIGHT_ACCENT_BG }}
          >
            <Icon className="w-6 h-6" />
          </div>
          <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {topic.category}
          </span>
        </div>
        <div
          className={`text-xs font-semibold px-3 py-1 rounded-full ml-auto ${getPotentialColor(topic.potential)}`}
        >
          {topic.potential.split("(")[0].trim()}
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mt-4 mb-2 leading-snug">
        {topic.title}
      </h3>

      <p className="text-gray-600 text-sm flex-grow mb-4">
        {topic.description}
      </p>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center space-x-1">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <span>{topic.trend}</span>
        </div>
      </div>

      {/* Primary button using the new accent color */}
      <button
        onClick={() => console.log(`Analyzing topic: ${topic.title}`)}
        className={`w-full mt-auto py-2.5 px-4 bg-[${PRIMARY_COLOR}] text-white font-semibold rounded-lg shadow-md transition duration-150 transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-offset-2`}
        style={{
          backgroundColor: PRIMARY_COLOR,
          "--tw-ring-color": PRIMARY_COLOR,
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.backgroundColor = HOVER_COLOR)
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = PRIMARY_COLOR)
        }
      >
        Analyze Topic & Get Outline
      </button>
    </div>
  );
};

/**
 * Main application component for the Trending Topics Page
 */
const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const categories = [
    "All",
    "Technology",
    "Marketing",
    "Logistics",
    "SEO",
    "Development",
  ];

  const filteredTopics = initialTopics.filter((topic) => {
    const matchesSearch =
      topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "All" || topic.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center">
          {/* Accent colored icon */}
          <Lightbulb
            className={`w-8 h-8 mr-3 text-[${PRIMARY_COLOR}]`}
            style={{ color: PRIMARY_COLOR }}
          />
          Trending Blog Topic Discovery
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Find the hottest topics relevant to your Shopify store niche and
          analyze their traffic potential.
        </p>
      </header>

      {/* Controls: Search and Filter */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8 sticky top-0 z-10 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by topic or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              // Apply accent color on focus
              className={`w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 focus:border-[${PRIMARY_COLOR}] transition duration-150 shadow-sm`}
              style={{
                "--tw-ring-color": PRIMARY_COLOR,
                borderColor:
                  filterCategory !== "All" ? PRIMARY_COLOR : undefined,
              }}
            />
          </div>

          {/* Category Filter Dropdown */}
          <div className="md:w-64">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              // Apply accent color on focus
              className={`w-full py-2.5 px-4 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-offset-2 focus:border-[${PRIMARY_COLOR}] transition duration-150 shadow-sm appearance-none`}
              style={{
                paddingRight: "2.5rem",
                "--tw-ring-color": PRIMARY_COLOR,
              }}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Topic Grid */}
      <section>
        {filteredTopics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTopics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-md border border-gray-100">
            <Lightbulb className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">
              No matching topics found.
            </h2>
            <p className="text-gray-500 mt-1">
              Try adjusting your search query or filter settings.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default App;
