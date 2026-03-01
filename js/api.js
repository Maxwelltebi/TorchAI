// js/api.js — Calls the FastAPI backend which proxies Gemini

const API_BASE = "https://torch-ai-ten.vercel.app/";

async function getCareerRecommendation(answers) {
  const kitList = CAREER_KITS.map((k) => `- ${k.id}: ${k.title} (${k.field})`).join("\n");

  const prompt = `You are Torch AI, a career advisor for university students at CIReN (Campus Innovation & Research Network).

A student has completed a detailed career assessment. Here are their responses:

1. Major / Field of Study: ${answers.major}
2. Year of Study: ${answers.year}
3. Work Style Preference: ${answers.workStyle}
4. Preferred Work Environment: ${answers.environment}
5. Comfort with Technical Tools: ${answers.techComfort}
6. Technical Skills & Tools: ${answers.techSkills}
7. Past Experience & Projects: ${answers.experience}
8. Preferred Learning Style: ${answers.learningStyle}
9. Problem-Solving Approach: ${answers.problemSolving}
10. Topics That Excite Them: ${answers.interests}
11. Long-Term Career Ambition: ${answers.ambition}
12. Core Career Values: ${answers.values}
13. Importance of Work-Life Balance: ${answers.workLife}
14. Greatest Strengths: ${answers.strengths}
15. Things They Want to Avoid at Work: ${answers.dislikes}
16. Leadership vs Individual Contributor: ${answers.leadership}
17. Preferred Industry: ${answers.industry}
18. Additional Context: ${answers.extra || "None provided"}

Based on this comprehensive profile, recommend the SINGLE most relevant career path from this list:
${kitList}

Respond ONLY with a valid JSON object in this exact format (no markdown, no extra text, no backticks):
{
  "recommendedId": "the-kit-id-here",
  "reasoning": "3-4 sentence personalized explanation referencing specific answers from their profile and why this path is the best match",
  "alternativeId": "another-kit-id-as-secondary-option"
}`;

  const response = await fetch(`${API_BASE}/recommend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || `Server error ${response.status}`);
  }

  const data = await response.json();
  const text = data.text || "";

  try {
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    throw new Error("Failed to parse AI response. Please try again.");
  }
}
