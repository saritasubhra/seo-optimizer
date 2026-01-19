import { useState, useEffect, useMemo } from "react";
import {
  LayoutDashboard,
  PenTool,
  FileText,
  Search,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Sparkles,
  Save,
  Trash2,
  Globe,
  Loader2,
} from "lucide-react";
import PropTypes from "prop-types";

// --- Utility: SEO Analysis Engine ---
const analyzeSEO = (title, content, keyword) => {
  let score = 0;
  const checks = [];

  if (!keyword) return { score: 0, checks: [] };

  const lowerContent = content.toLowerCase();
  const lowerTitle = title.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();

  // 1. Keyword in Title (20pts)
  if (lowerTitle.includes(lowerKeyword)) {
    score += 20;
    checks.push({ passed: true, msg: "Keyword found in title" });
  } else {
    checks.push({ passed: false, msg: "Keyword missing from title" });
  }

  // 2. Title Length (10pts)
  if (title.length >= 4 && title.length <= 60) {
    score += 10;
    checks.push({ passed: true, msg: "Title length is optimal (4-60 chars)" });
  } else {
    checks.push({
      passed: false,
      msg: `Title length: ${title.length} chars (Target: 4-60)`,
    });
  }

  // 3. Keyword Density (20pts) - Rough check
  const wordCount = content.split(/\s+/).filter((w) => w.length > 0).length;
  const keywordCount = (lowerContent.match(new RegExp(lowerKeyword, "g")) || [])
    .length;
  const density = wordCount > 0 ? (keywordCount / wordCount) * 100 : 0;

  if (density >= 0.5 && density <= 10.5) {
    score += 20;
    checks.push({
      passed: true,
      msg: `Keyword density good (${density.toFixed(1)}%)`,
    });
  } else {
    checks.push({
      passed: false,
      msg: `Keyword density ${density.toFixed(1)}% (Target: 0.5% - 2.5%)`,
    });
  }

  // 4. Content Length (20pts)
  if (wordCount > 300) {
    score += 20;
    checks.push({ passed: true, msg: "Content length > 300 words" });
  } else {
    checks.push({
      passed: false,
      msg: "Content too short (Target: >300 words)",
    });
  }

  // 5. Keyword in Introduction (First 100 words) (15pts)
  const intro = lowerContent.split(/\s+/).slice(0, 100).join(" ");
  if (intro.includes(lowerKeyword)) {
    score += 15;
    checks.push({ passed: true, msg: "Keyword appears in first 100 words" });
  } else {
    checks.push({ passed: false, msg: "Keyword missing from introduction" });
  }

  // 6. Use of Headers (Simulated) (15pts)
  // In a real WYSIWYG, we'd check HTML tags. Here we check for markdown-style headers #
  if (content.includes("# ")) {
    score += 15;
    checks.push({ passed: true, msg: "Content uses subheadings" });
  } else {
    checks.push({
      passed: false,
      msg: "No subheadings detected (Use # for headers)",
    });
  }

  return { score, checks };
};

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      active
        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
        : "text-slate-600 hover:bg-slate-100"
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

// ✅ Fix ESLint warning
SidebarItem.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

const ScoreGauge = ({ score }) => {
  const getColor = (s) => {
    if (s >= 80) return "text-emerald-500 border-emerald-500";
    if (s >= 50) return "text-amber-500 border-amber-500";
    return "text-rose-500 border-rose-500";
  };

  return (
    <div
      className={`relative w-32 h-32 rounded-full border-8 flex items-center justify-center ${getColor(score)}`}
    >
      <div className="text-center">
        <span className="text-3xl font-bold text-slate-800">{score}</span>
        <span className="block text-xs text-slate-500 font-medium uppercase">
          SEO Score
        </span>
      </div>
    </div>
  );
};

ScoreGauge.propTypes = {
  score: PropTypes.number.isRequired,
};

const generateBlogContent = async (topic, keyword, tone, userApiKey) => {
  const response = await fetch("/api/generate-blog-content", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ topic, keyword, tone, userApiKey }),
  });

  let data;
  try {
    data = await response.json();
  } catch (err) {
    throw new Error("Couldn't fetch response.");
  }

  if (!response.ok) {
    throw new Error(data.error || "Failed to generate content");
  }
  return data.content;
};

export default function GoBlogApp() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  const [userApiKey, setUserApiKey] = useState("");
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  // Editor State
  const [currentPost, setCurrentPost] = useState({
    title: "",
    content: "",
    keyword: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const res = await fetch("/api/shopify/blogs");

        const data = await res.json();
        console.log("blogs", data);

        setPosts(data || []);
      } catch (err) {
        setNotification("Cannot load posts");
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  useEffect(() => {
    const savedKey =
      typeof window !== "undefined"
        ? localStorage.getItem("user_gemini_key")
        : null;

    if (savedKey) {
      setUserApiKey(savedKey);
    }
  }, []);

  const handleGenerate = async (topic, keyword, tone, userApiKey) => {
    try {
      setIsGenerating(true);
      const content = await generateBlogContent(
        topic,
        keyword,
        tone,
        userApiKey,
      );
      setCurrentPost({
        title: `${topic}: The Ultimate Guide`,
        keyword: keyword,
        content: content,
      });

      setActiveTab("editor");
      showNotification("Content generated successfully!", "success");
    } catch (err) {
      console.error("Generation error:", err);

      let message = "Failed to generate content.";

      if (err.message.includes("Invalid API key")) {
        message = "Your API key is invalid. Please update it.";
      } else if (err.message.includes("Failed to fetch")) {
        message = "Network error: cannot reach server.";
      } else if (err.message.includes("JSON")) {
        message = "Server returned unexpected response.";
      } else if (err.message) {
        message = err.message;
      }
      showNotification(message, "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const analysis = analyzeSEO(
        currentPost.title,
        currentPost.content,
        currentPost.keyword,
      );

      const payload = {
        ...currentPost,
        score: analysis.score,
      };

      const res1 = await fetch("/api/seo/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      await res1.json();

      showNotification("Blog post saved!", "success");
      setActiveTab("posts");

      // Reload post list
      const res = await fetch("/api/seo/list");
      const data = await res.json();

      setPosts(data || []);
      setCurrentPost({ title: "", content: "", keyword: "" });
    } catch (error) {
      showNotification("Some error occured.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    await fetch("/api/seo/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    showNotification("Post deleted!", "success");

    // Reload list
    const res = await fetch("/api/seo/list");
    const data = await res.json();
    setPosts(data || []);
  };

  const handleEdit = (post) => {
    setCurrentPost(post);
    setActiveTab("editor");
  };

  const resetApiKey = () => {
    localStorage.removeItem("user_gemini_key");
    setUserApiKey("");
    setShowApiKeyModal(true);
    showNotification("API key removed. Please enter a new key.", "success");
  };

  const showNotification = (msg, type) => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // SEO Analysis Memo
  const seoAnalysis = useMemo(() => {
    return analyzeSEO(
      currentPost.title,
      currentPost.content,
      currentPost.keyword,
    );
  }, [currentPost.title, currentPost.content, currentPost.keyword]);

  // Views
  const RenderDashboard = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Posts</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">
                {posts.length}
              </h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <FileText size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <span className="font-medium">+2 this week</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Avg SEO Score
              </p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">
                {posts.length > 0
                  ? Math.round(
                      posts.reduce((acc, p) => acc + (p.score || 0), 0) /
                        posts.length,
                    )
                  : 0}
              </h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
              <BarChart3 size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-slate-400">
            <span className="font-medium">Target: 80+</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Keywords Ranked
              </p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">
                {posts.length * 3}
              </h3>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
              <Globe size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <span className="font-medium">+12% vs last month</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Recent Activity</h2>
          <button
            onClick={() => setActiveTab("posts")}
            className="text-lg text-[#23b5b5] font-medium hover:text-[#167a7a]"
          >
            View All
          </button>
        </div>
        <div className="p-6">
          {posts.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              No posts yet. Start writing!
            </div>
          ) : (
            <div className="space-y-4">
              {posts.slice(0, 3).map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-lg transition-colors border border-slate-100"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                      ${
                        post.score >= 80
                          ? "bg-emerald-100 text-emerald-700"
                          : post.score >= 50
                            ? "bg-amber-100 text-amber-700"
                            : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {post.score}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 line-clamp-1">
                        {post.title}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Keyword: {post.keyword}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEdit(post)}
                    className="text-slate-400 hover:text-blue-600"
                  >
                    <PenTool size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const RenderAIWriter = () => {
    const [topic, setTopic] = useState("");
    const [keyword, setKeyword] = useState("");
    const [tone, setTone] = useState("Professional");

    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-in zoom-in-95 duration-300">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-[#23b5b5] to-[#1a9a92] rounded-2xl shadow-lg mb-4">
            <Sparkles className="text-white" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">
            AI Blog Assistant
          </h2>
          <p className="text-slate-500">
            Generate SEO-optimized content in seconds.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 space-y-6">
          <div>
            <label
              htmlFor="blogTopic"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Blog Topic
            </label>

            <input
              id="blogTopic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., The Benefits of Sustainable Fashion"
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="targetKeyword"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Target Keyword
              </label>

              <input
                id="targetKeyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g., sustainable fashion"
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="toneOfVoice"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Tone of Voice
              </label>

              <select
                id="toneOfVoice"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
              >
                <option>Professional</option>
                <option>Casual</option>
                <option>Enthusiastic</option>
                <option>Informative</option>
              </select>
            </div>
          </div>

          {userApiKey && (
            <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
              <span className="text-sm text-slate-600">
                ✅ Gemini API key is set
              </span>

              <button
                onClick={resetApiKey}
                className="text-sm font-medium text-[#23b5b5] hover:underline"
              >
                Use another key
              </button>
            </div>
          )}

          <button
            // onClick={() => handleGenerate(topic, keyword, tone)}
            onClick={async () => {
              if (!userApiKey) {
                setShowApiKeyModal(true);
                return;
              }
              handleGenerate(topic, keyword, tone, userApiKey);
            }}
            disabled={!topic || !keyword || isGenerating}
            className="w-full py-4 bg-[#23b5b5] text-white rounded-xl font-bold text-lg hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-90 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Sparkles size={20} />
            )}
            {isGenerating ? "Generating Content..." : "Generate with AI"}
          </button>
        </div>
      </div>
    );
  };

  const renderEditor = () => (
    <div className="flex gap-6 ">
      {/* Main Editor */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-lg text-slate-700 flex items-center gap-2">
            <PenTool size={18} /> Editor
          </h3>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 cursor-pointer bg-[#23b5b5] text-white rounded-lg text-sm font-medium  flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Save Draft
          </button>
        </div>

        <div className="p-6 flex flex-col h-[calc(100vh-250px)]">
          <input
            value={currentPost.title}
            onChange={(e) =>
              setCurrentPost({ ...currentPost, title: e.target.value })
            }
            placeholder="Blog Post Title"
            className="w-full text-3xl font-bold placeholder-slate-300 border-none outline-none"
          />
          <div className="flex gap-4">
            <input
              value={currentPost.keyword}
              onChange={(e) =>
                setCurrentPost({ ...currentPost, keyword: e.target.value })
              }
              placeholder="Target Keyword"
              className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border-none outline-none w-64"
            />
          </div>
          <textarea
            value={currentPost.content}
            onChange={(e) =>
              setCurrentPost({ ...currentPost, content: e.target.value })
            }
            placeholder="Start writing..."
            className="w-full flex-1 min-h-[500px] pb-10 resize-none outline-none text-lg text-slate-600 leading-relaxed font-light"
          />
        </div>
      </div>

      {/* SEO Sidebar */}
      <div className="w-80 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-lg text-slate-700 flex items-center gap-2">
            <Search size={18} /> SEO Analysis
          </h3>
        </div>
        <div className="p-6">
          <div className="flex justify-center mb-8">
            <ScoreGauge score={seoAnalysis.score} />
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Checklist
            </h4>
            {seoAnalysis.checks.map((check, idx) => (
              <div key={idx} className="flex gap-3 items-start">
                {check.passed ? (
                  <CheckCircle
                    size={18}
                    className="text-emerald-500 mt-0.5 shrink-0"
                  />
                ) : (
                  <AlertCircle
                    size={18}
                    className="text-rose-500 mt-0.5 shrink-0"
                  />
                )}
                <span
                  className={`text-sm ${check.passed ? "text-slate-600" : "text-slate-500"}`}
                >
                  {check.msg}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="text-blue-800 font-semibold mb-2 flex items-center gap-2">
              <Sparkles size={16} /> Pro Tip
            </h4>
            <p className="text-xs text-blue-700">
              Try to include your keyword {currentPost.keyword || "..."} in the
              first paragraph to hook readers and bots immediately!
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPosts = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800">My Blog Posts</h2>
        <button
          onClick={() => {
            setCurrentPost({ title: "", content: "", keyword: "" });
            setActiveTab("editor");
          }}
          className="px-4 py-2 bg-[#23b5b5] text-white rounded-lg text-sm font-medium "
        >
          New Post
        </button>
      </div>
      <div className="divide-y divide-slate-100">
        {posts.map((post) => (
          <div
            key={post.id}
            className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group"
          >
            <div className="flex-1">
              <h3 className="font-semibold text-slate-800 mb-1">
                {post.title}
              </h3>
              <div className="flex gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <Search size={14} /> {post.keyword || "No keyword"}
                </span>
                <span className="flex items-center gap-1 text-slate-500">
                  {post.createdAt
                    ? new Date(post.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "Just now"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                <span
                  className={`text-xl font-bold ${
                    post.score >= 80
                      ? "text-emerald-500"
                      : post.score >= 50
                        ? "text-amber-500"
                        : "text-rose-500"
                  }`}
                >
                  {post.score || 0}
                </span>
                <span className="text-[10px] uppercase text-slate-400 font-bold">
                  Score
                </span>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(post)}
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                >
                  <PenTool size={18} />
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <div className="p-12 text-center text-slate-400">
            <FileText size={48} className="mx-auto mb-4 opacity-20" />
            <p>No posts found. Generate one with AI!</p>
          </div>
        )}
      </div>
    </div>
  );

  const ApiKeyModal = () => {
    const [tempKey, setTempKey] = useState(userApiKey || "");

    if (!showApiKeyModal) return null;

    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-xl shadow-xl w-[400px] space-y-6">
          <h2 className="text-xl font-bold text-slate-800">
            Enter Your Gemini API Key
          </h2>

          <input
            type="password"
            value={tempKey}
            onChange={(e) => setTempKey(e.target.value)}
            placeholder="Enter your Gemini API Key"
            className="w-full p-3 border border-slate-300 rounded-lg outline-none"
          />

          <div className="flex justify-end gap-4">
            <button
              className="px-4 py-2 text-slate-600"
              onClick={() => setShowApiKeyModal(false)}
            >
              Cancel
            </button>

            <button
              className="px-4 py-2 bg-[#23b5b5] text-white rounded-lg"
              onClick={() => {
                localStorage.setItem("user_gemini_key", tempKey);
                setUserApiKey(tempKey);
                setShowApiKeyModal(false);
                showNotification("API Key saved!", "success");
              }}
            >
              Save Key
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading)
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50 text-slate-400">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-xl z-50 text-white font-medium animate-in slide-in-from-top-2
        ${notification.type === "success" ? "bg-emerald-600" : "bg-rose-600"}`}
        >
          {notification.msg}
        </div>
      )}

      {/* TOP NAVBAR (instead of sidebar) */}
      <nav className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
        {/* Logo */}
        <div className="flex items-center gap-2 text-blue-600">
          {/* <span className="text-xl font-bold text-slate-800">
            SEO Optimizer
          </span> */}
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-6 text-lg">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-2 font-medium transition-colors ${
              activeTab === "dashboard"
                ? "text-[#23b5b5]"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab("ai_writer")}
            className={`flex items-center gap-2 font-medium transition-colors ${
              activeTab === "ai_writer"
                ? "text-[#23b5b5]"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles size={18} />
            AI Writer
          </button>

          <button
            onClick={() => setActiveTab("editor")}
            className={`flex items-center gap-2 font-medium transition-colors ${
              activeTab === "editor"
                ? "text-[#23b5b5]"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <PenTool size={18} />
            Editor
          </button>

          <button
            onClick={() => setActiveTab("posts")}
            className={`flex items-center gap-2 font-medium transition-colors ${
              activeTab === "posts"
                ? "text-[#23b5b5]"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileText size={18} />
            My Posts
          </button>
        </div>

        {/* Avatar */}
        <div></div>
      </nav>

      {/* MAIN PAGE CONTENT */}
      <main className="flex-1 p-8 overflow-visible">
        {activeTab === "dashboard" && <RenderDashboard />}
        {activeTab === "ai_writer" && <RenderAIWriter />}
        {activeTab === "editor" && renderEditor()}
        {activeTab === "posts" && renderPosts()}
      </main>

      <ApiKeyModal />
    </div>
  );
}
