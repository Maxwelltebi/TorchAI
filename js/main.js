// js/main.js — UI state, question flow, theme toggle

// ─── Theme ────────────────────────────────────────────────────────────────────
function initTheme() {
  const saved = localStorage.getItem("torch-theme") || "dark";
  document.documentElement.setAttribute("data-theme", saved);
  updateThemeIcon(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("torch-theme", next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;
  btn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
  // swap icon
  btn.innerHTML = theme === "dark"
    ? `<i data-lucide="sun"></i>`
    : `<i data-lucide="moon"></i>`;
  if (window.lucide) lucide.createIcons();
}

// ─── State ────────────────────────────────────────────────────────────────────
const state = {
  currentScreen: "welcome",
  currentQuestion: 0,
  answers: {},
  result: null,
};

// ─── Questions ────────────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    key: "major",
    label: "What is your major or field of study?",
    placeholder: "e.g. Computer Science, Pharmacy, Business Administration...",
    type: "text",
  },
  {
    key: "year",
    label: "What year of study are you in?",
    type: "select",
    options: [
      { value: "1st year undergraduate", label: "1st Year (Undergraduate)" },
      { value: "2nd year undergraduate", label: "2nd Year (Undergraduate)" },
      { value: "3rd year undergraduate", label: "3rd Year (Undergraduate)" },
      { value: "4th year undergraduate", label: "4th Year (Undergraduate)" },
      { value: "postgraduate / masters", label: "Postgraduate / Masters" },
      { value: "PhD / doctoral", label: "PhD / Doctoral" },
    ],
  },
  {
    key: "workStyle",
    label: "How do you prefer to work?",
    type: "select",
    options: [
      { value: "independently with full ownership", label: "Independently with full ownership" },
      { value: "small collaborative team", label: "Small collaborative team" },
      { value: "large cross-functional team", label: "Large cross-functional team" },
      { value: "client-facing and external-facing", label: "Client-facing & external-facing" },
      { value: "mix of solo and team work", label: "Mix of solo and team work" },
    ],
  },

  {
    key: "environment",
    label: "What kind of work environment appeals to you most?",
    type: "select",
    options: [
      { value: "fast-paced tech startup", label: "Fast-paced tech startup" },
      { value: "large corporation or multinational", label: "Large corporation / multinational" },
      { value: "hospital or clinical setting", label: "Hospital / clinical setting" },
      { value: "research institution or academia", label: "Research institution / academia" },
      { value: "government or public sector", label: "Government / public sector" },
      { value: "consulting firm", label: "Consulting firm" },
      { value: "None of these"},
    ],
  },
  {
    key: "techComfort",
    label: "How comfortable are you with technical tools and coding?",
    type: "select",
    options: [
      { value: "not comfortable at all", label: "Not comfortable at all" },
      { value: "basic — spreadsheets and simple tools", label: "Basic — spreadsheets & simple tools" },
      { value: "moderate — some coding or data tools", label: "Moderate — some coding or data tools" },
      { value: "comfortable — can write scripts and use APIs", label: "Comfortable — scripts & APIs" },
      { value: "very comfortable — software development level", label: "Very comfortable — software dev level" },
    ],
  },
  {
    key: "techSkills",
    label: "Which technical skills or tools do you have experience with?",
    type: "select",
    options: [
      { value: "programming languages (Python, Java, C++, etc.)", label: "Programming (Python, Java, C++...)" },
      { value: "data tools (SQL, Excel, Tableau, Power BI)", label: "Data tools (SQL, Excel, Tableau...)" },
      { value: "cloud platforms (AWS, GCP, Azure)", label: "Cloud platforms (AWS, GCP, Azure)" },
      { value: "networking and IT infrastructure", label: "Networking & IT infrastructure" },
      { value: "lab and scientific tools", label: "Lab & scientific tools" },
      { value: "business tools (CRM, ERP, project management)", label: "Business tools (CRM, ERP, PM)" },
      { value: "none yet", label: "None yet" },
    ],
  },
  {
    key: "experience",
    label: "What kind of past experience or projects do you have?",
    type: "select",
    options: [
      { value: "software or app development projects", label: "Software / app development" },
      { value: "research papers or lab experiments", label: "Research papers / lab experiments" },
      { value: "business case studies or competitions", label: "Business cases / competitions" },
      { value: "internship in a corporate setting", label: "Corporate internship" },
      { value: "clinical or hospital attachment", label: "Clinical / hospital attachment" },
      { value: "freelance or entrepreneurial ventures", label: "Freelance / entrepreneurial ventures" },
      { value: "no formal experience yet", label: "No formal experience yet" },
    ],
  },
  {
    key: "learningStyle",
    label: "How do you prefer to learn new things?",
    type: "select",
    options: [
      { value: "hands-on building and experimenting", label: "Hands-on building & experimenting" },
      { value: "reading documentation and research papers", label: "Reading docs & research papers" },
      { value: "structured courses and certifications", label: "Structured courses & certifications" },
      { value: "mentorship and shadowing professionals", label: "Mentorship & shadowing" },
      { value: "group discussions and collaborative learning", label: "Group discussions & collaboration" },
    ],
  },
  {
    key: "problemSolving",
    label: "How would you describe your problem-solving style?",
    type: "select",
    options: [
      { value: "analytical — I rely on data and logic", label: "Analytical — data & logic driven" },
      { value: "creative — I think outside the box", label: "Creative — outside the box thinking" },
      { value: "systematic — I follow processes and frameworks", label: "Systematic — processes & frameworks" },
      { value: "people-focused — I solve problems through collaboration", label: "People-focused — collaborative" },
      { value: "strategic — I focus on the big picture", label: "Strategic — big picture thinker" },
    ],
  },
  {
    key: "interests",
    label: "What topics or activities genuinely excite you?",
    placeholder: "e.g. AI, patient care, financial markets, building products, marketing campaigns...",
    type: "text",
  },
  {
    key: "ambition",
    label: "Where do you see yourself in 10 years?",
    type: "select",
    options: [
      { value: "leading engineering teams at a top tech company", label: "Leading engineering at a top tech company" },
      { value: "running my own startup or business", label: "Running my own startup / business" },
      { value: "senior clinical or healthcare professional", label: "Senior clinical / healthcare professional" },
      { value: "policy maker or public health leader", label: "Policy maker / public health leader" },
      { value: "C-suite executive at a large corporation", label: "C-suite executive at a corporation" },
      { value: "researcher or academic expert in my field", label: "Researcher / academic expert" },
      { value: "independent consultant or advisor", label: "Independent consultant / advisor" },
    ],
  },
  {
    key: "values",
    label: "What matters most to you in a career?",
    type: "select",
    options: [
      { value: "making a meaningful social impact", label: "Making a meaningful social impact" },
      { value: "high earning potential and financial growth", label: "High earning potential" },
      { value: "job stability and security", label: "Job stability & security" },
      { value: "innovation and working on cutting-edge problems", label: "Innovation & cutting-edge problems" },
      { value: "helping people directly", label: "Helping people directly" },
      { value: "intellectual challenge and continuous learning", label: "Intellectual challenge & learning" },
    ],
  },
  {
    key: "workLife",
    label: "How important is work-life balance to you?",
    type: "select",
    options: [
      { value: "extremely important — I need clear boundaries", label: "Extremely important — clear boundaries" },
      { value: "important but I can handle busy seasons", label: "Important, but flexible during busy seasons" },
      { value: "neutral — I adapt to what the job demands", label: "Neutral — I adapt to the job" },
      { value: "not a priority — I am willing to grind hard", label: "Not a priority — willing to grind" },
    ],
  },
  {
    key: "strengths",
    label: "What are your greatest strengths?",
    type: "select",
    options: [
      { value: "strong analytical and quantitative skills", label: "Analytical & quantitative skills" },
      { value: "excellent communication and presentation", label: "Communication & presentation" },
      { value: "technical and engineering ability", label: "Technical & engineering ability" },
      { value: "leadership and team management", label: "Leadership & team management" },
      { value: "creativity and design thinking", label: "Creativity & design thinking" },
      { value: "attention to detail and precision", label: "Attention to detail & precision" },
    ],
  },
  {
    key: "dislikes",
    label: "What would you most want to avoid in your career?",
    type: "select",
    options: [
      { value: "repetitive tasks with little variety", label: "Repetitive tasks with little variety" },
      { value: "heavy coding or deep technical work", label: "Heavy coding / deep technical work" },
      { value: "frequent public speaking or client interaction", label: "Frequent public speaking / client interaction" },
      { value: "high-pressure environments with tight deadlines", label: "High-pressure, tight deadline environments" },
      { value: "slow bureaucratic or political environments", label: "Slow bureaucratic environments" },
      { value: "working in isolation with minimal teamwork", label: "Working in isolation" },
    ],
  },
  {
    key: "leadership",
    label: "Do you see yourself leading teams or working as an individual contributor?",
    type: "select",
    options: [
      { value: "I want to lead and manage people", label: "Lead and manage people" },
      { value: "I prefer deep individual contributor work", label: "Deep individual contributor work" },
      { value: "I want to be a technical lead — both IC and mentor", label: "Technical lead — IC and mentor" },
      { value: "I am open to either depending on the opportunity", label: "Open to either" },
    ],
  },
  */
  {
    key: "industry",
    label: "Which industry do you feel most drawn to?",
    type: "select",
    options: [
      { value: "technology and software", label: "Technology & software" },
      { value: "healthcare and pharmaceuticals", label: "Healthcare & pharmaceuticals" },
      { value: "finance and banking", label: "Finance & banking" },
      { value: "consulting and professional services", label: "Consulting & professional services" },
      { value: "public sector and non-profit", label: "Public sector & non-profit" },
      { value: "e-commerce and consumer products", label: "E-commerce & consumer products" },
      { value: "energy and sustainability", label: "Energy & sustainability" },
    ],
  },
  {
    key: "extra",
    label: "Anything else you'd like the AI to know about you? (Optional)",
    placeholder: "e.g. I speak 3 languages, I've lived abroad, I have a passion for music tech...",
    type: "text",
    optional: true,
  },

];

// ─── DOM helpers ──────────────────────────────────────────────────────────────
const $  = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function showScreen(name) {
  $$(".screen").forEach((s) => s.classList.remove("active"));
  const target = $(`#screen-${name}`);
  if (target) { target.classList.add("active"); window.scrollTo(0, 0); }
  state.currentScreen = name;
}

// ─── Welcome ──────────────────────────────────────────────────────────────────
function initWelcome() {
  $("#btn-find-path").addEventListener("click", () => {
    state.currentQuestion = 0;
    state.answers = {};
    renderQuestion();
    showScreen("questions");
  });
  $("#btn-browse").addEventListener("click", () => { renderBrowse(); showScreen("browse"); });
}

// ─── Questions ────────────────────────────────────────────────────────────────
function renderQuestion() {
  const q     = QUESTIONS[state.currentQuestion];
  const total = QUESTIONS.length;
  const idx   = state.currentQuestion;

  $("#q-progress-text").textContent = `${idx + 1} of ${total}`;
  $("#q-progress-fill").style.width = `${((idx + 1) / total) * 100}%`;
  $("#q-label").textContent = q.label;

  if (q.optional) {
    $("#q-optional-badge").style.display = "inline-flex";
  } else {
    $("#q-optional-badge").style.display = "none";
  }

  const inputArea = $("#q-input-area");
  inputArea.innerHTML = "";

  if (q.type === "text") {
    const input = document.createElement("input");
    input.type        = "text";
    input.className   = "q-text-input";
    input.placeholder = q.placeholder || "";
    input.value       = state.answers[q.key] || "";
    input.addEventListener("input", () => { state.answers[q.key] = input.value.trim(); updateNextBtn(); });
    input.addEventListener("keydown", (e) => { if (e.key === "Enter" && (state.answers[q.key] || q.optional)) handleNext(); });
    inputArea.appendChild(input);
    setTimeout(() => input.focus(), 80);
  } else {
    q.options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.className   = "q-option-btn";
      btn.textContent = opt.label;
      if (state.answers[q.key] === opt.value) btn.classList.add("selected");
      btn.addEventListener("click", () => {
        $$(".q-option-btn").forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
        state.answers[q.key] = opt.value;
        updateNextBtn();
      });
      inputArea.appendChild(btn);
    });
  }

  $("#q-back").style.visibility = idx === 0 ? "hidden" : "visible";
  updateNextBtn();
}

function updateNextBtn() {
  const q      = QUESTIONS[state.currentQuestion];
  const has    = !!state.answers[q.key];
  const isLast = state.currentQuestion === QUESTIONS.length - 1;
  const btn    = $("#q-next");
  btn.textContent = isLast ? "Find My Path →" : "Next →";
  btn.disabled    = !has && !q.optional;
}

function handleNext() {
  const q      = QUESTIONS[state.currentQuestion];
  const isLast = state.currentQuestion === QUESTIONS.length - 1;
  if (!state.answers[q.key] && !q.optional) return;
  if (isLast) { submitAnswers(); } else { state.currentQuestion++; renderQuestion(); }
}

function initQuestions() {
  $("#q-next").addEventListener("click", handleNext);
  $("#q-back").addEventListener("click", () => {
    if (state.currentQuestion > 0) { state.currentQuestion--; renderQuestion(); }
  });
}

// ─── Submit ───────────────────────────────────────────────────────────────────
async function submitAnswers() {
  showScreen("loading");
  try {
    const result = await getCareerRecommendation(state.answers);
    state.result = result;
    renderResults(result);
    showScreen("results");
  } catch (err) {
    showScreen("questions");
    showToast("Error: " + err.message);
  }
}

// ─── Results ──────────────────────────────────────────────────────────────────
function renderResults(result) {
  const kit = getKitById(result.recommendedId);
  const alt = getKitById(result.alternativeId);

  if (!kit) { showToast("Could not find recommended kit. Try again."); showScreen("welcome"); return; }

  $("#result-field-badge").textContent = kit.field;
  $("#result-title").textContent       = kit.title;
  $("#result-description").textContent = kit.description;
  $("#result-reasoning").textContent   = result.reasoning;

  $("#result-skills").innerHTML = kit.skills.map((s) => `<span class="skill-tag">${s}</span>`).join("");

  const kitBtn = $("#result-kit-btn");
  kitBtn.href  = kit.kitLink;

  if (alt) {
    $("#result-alt-title").textContent = alt.title;
    $("#result-alt-field").textContent = alt.field;
    const altLink = $("#result-alt-link");
    altLink.href  = alt.kitLink;
    $("#result-alternative").style.display = "flex";
  } else {
    $("#result-alternative").style.display = "none";
  }
}

function initResults() {
  $("#btn-retake").addEventListener("click", () => {
    state.currentQuestion = 0; state.answers = {};
    renderQuestion(); showScreen("questions");
  });
  $("#btn-browse-from-results").addEventListener("click", () => { renderBrowse(); showScreen("browse"); });
}

// ─── Browse ───────────────────────────────────────────────────────────────────
function renderBrowse() {
  const container = $("#browse-fields");
  container.innerHTML = "";

  FIELDS.forEach((field) => {
    const kits    = getKitsByField(field.slug);
    const section = document.createElement("div");
    section.className = "browse-field-section";
    section.innerHTML = `
      <div class="browse-field-header">
        <div class="field-icon"><i data-lucide="${field.icon}"></i></div>
        <h3>${field.label}</h3>
        <span class="kit-count">${kits.length} kits</span>
      </div>
      <div class="browse-kits-grid">
        ${kits.map((k) => `
          <a class="browse-kit-card" href="${k.kitLink}" target="_blank" rel="noopener">
            <div class="bkc-header">
              <span class="bkc-title">${k.title}</span>
              <i data-lucide="external-link" class="bkc-icon"></i>
            </div>
            <p class="bkc-desc">${k.description}</p>
            <div class="bkc-skills">
              ${k.skills.slice(0, 3).map((s) => `<span class="skill-tag small">${s}</span>`).join("")}
            </div>
          </a>`).join("")}
      </div>`;
    container.appendChild(section);
  });

  if (window.lucide) lucide.createIcons();
}

function initBrowse() {
  $("#btn-back-from-browse").addEventListener("click", () => showScreen("welcome"));
  $("#btn-find-from-browse").addEventListener("click", () => {
    state.currentQuestion = 0; state.answers = {};
    renderQuestion(); showScreen("questions");
  });
}

// ─── Toast ───────────────────────────────────────────────────────────────────
function showToast(message) {
  let toast = $("#toast");
  if (!toast) { toast = document.createElement("div"); toast.id = "toast"; document.body.appendChild(toast); }
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 4500);
}

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initWelcome();
  initQuestions();
  initResults();
  initBrowse();
  showScreen("welcome");

  // Make all logos clickable to navigate to home
  document.querySelectorAll(".logo").forEach(logo => {
    logo.addEventListener("click", () => showScreen("welcome"));
  });

  document.getElementById("theme-toggle").addEventListener("click", toggleTheme);

  if (window.lucide) lucide.createIcons();
});
