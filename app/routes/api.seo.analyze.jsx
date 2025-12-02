export async function action({ request }) {
  const { title, content, keyword } = await request.json();

  if (!keyword) {
    return Response.json({ score: 0, checks: [] });
  }

  let score = 0;
  const checks = [];

  const lc = content.toLowerCase();
  const lt = title.toLowerCase();
  const lk = keyword.toLowerCase();

  // Keyword in title
  if (lt.includes(lk)) {
    score += 20;
    checks.push({ passed: true, msg: "Keyword found in title" });
  } else {
    checks.push({ passed: false, msg: "Keyword missing from title" });
  }

  // Title length
  if (title.length >= 40 && title.length <= 60) {
    score += 10;
    checks.push({ passed: true, msg: "Optimal title length" });
  } else {
    checks.push({ passed: false, msg: `Title length: ${title.length}` });
  }

  // Keyword density
  const words = content.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const kCount = (lc.match(new RegExp(lk, "g")) || []).length;
  const density = (kCount / wordCount) * 100;

  if (density >= 0.5 && density <= 2.5) {
    score += 20;
    checks.push({ passed: true, msg: `Density good (${density.toFixed(1)}%)` });
  } else {
    checks.push({ passed: false, msg: `Density ${density.toFixed(1)}%` });
  }

  return Response.json({ score, checks });
}

export const loader = () => Response.json({ message: "POST only" });
