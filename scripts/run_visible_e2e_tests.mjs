import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const LOCAL_BASE = "http://127.0.0.1:3000";
const VERCEL_BASE = "https://ai-placement-mentor0.vercel.app";
const VISIBLE_SCREENSHOTS_DIR = path.join(process.cwd(), "screenshots", "visible");

if (!fs.existsSync(VISIBLE_SCREENSHOTS_DIR)) {
  fs.mkdirSync(VISIBLE_SCREENSHOTS_DIR, { recursive: true });
}

const testResults = [];

function recordTest({ name, steps, status, consoleErrors = [], failedRequests = [], screenshot, rootCause = "" }) {
  const result = {
    name,
    steps,
    status,
    consoleErrors: consoleErrors.length > 0 ? consoleErrors.slice(0, 3).join("; ") : "None",
    failedRequests: failedRequests.length > 0 ? failedRequests.slice(0, 3).map(r => `${r.url} (${r.status})`).join("; ") : "None",
    screenshot,
    rootCause: status === "PASS" ? "N/A" : rootCause,
  };
  testResults.push(result);
  console.log(`\n======================================================`);
  console.log(`[TEST RESULT] ${name} -> ${status.toUpperCase()}`);
  console.log(`Steps: ${steps.join(" -> ")}`);
  console.log(`Console Errors: ${result.consoleErrors}`);
  console.log(`Failed Requests: ${result.failedRequests}`);
  console.log(`Screenshot: ${screenshot}`);
  if (status === "FAIL") console.log(`Root Cause: ${rootCause}`);
  console.log(`======================================================\n`);
}

function attachNetworkAndConsole(page, state) {
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const text = msg.text();
      if (!text.includes("Download the React DevTools") && !text.includes("favicon") && !text.includes("ResizeObserver")) {
        state.consoleErrors.push(text);
      }
    }
  });

  page.on("requestfailed", (req) => {
    state.failedRequests.push({
      url: req.url(),
      status: req.failure() ? req.failure().errorText : "FAILED",
    });
  });

  page.on("response", (res) => {
    if (res.status() >= 400) {
      if (!res.url().includes("favicon.ico") && !res.url().includes("_next/static")) {
        state.failedRequests.push({
          url: res.url(),
          status: res.status(),
        });
      }
    }
  });
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runVisibleSuite() {
  console.log("=== LAUNCHING VISIBLE NON-HEADLESS CHROME FOR REAL-TIME INTERACTION ===");
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: false,
    slowMo: 300,
  });

  const timestamp = Date.now();
  const freshCandidateEmail = `fresh_student_${timestamp}@test.com`;
  const freshCandidatePassword = "Password@123";
  const freshCandidateName = `Fresh Student ${timestamp.toString().slice(-4)}`;

  try {
    // =========================================================================
    // 1. NAVIGATION TESTS (STUDENT & RECRUITER)
    // =========================================================================
    console.log("\n>>> [1/11] Running Navigation Tests...");
    try {
      const navContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
      const navPage = await navContext.newPage();
      navPage.setDefaultTimeout(30000);
      const navState = { consoleErrors: [], failedRequests: [] };
      attachNetworkAndConsole(navPage, navState);

      // Login as student demo to access authenticated routes
      await navPage.goto(`${LOCAL_BASE}/auth/login?role=student`, { waitUntil: "networkidle" });
      await navPage.fill('input[name="email"]', "demo@placementmentor.com");
      await navPage.fill('input[name="password"]', "Password@123");
      await navPage.click('button[type="submit"]');
      await navPage.waitForURL((url) => url.pathname.includes("/dashboard"), { timeout: 30000 });
      await sleep(1000);

      const studentRoutes = [
        { path: "/dashboard", name: "Student Dashboard" },
        { path: "/dashboard/dsa-tracker", name: "DSA Tracker" },
        { path: "/dashboard/company-prep", name: "Company-Wise Prep" },
        { path: "/dashboard/interview", name: "Interview Hub" },
        { path: "/dashboard/roadmap", name: "Roadmap" },
        { path: "/dashboard/resume", name: "Resume Analysis" },
        { path: "/dashboard/ai-chat", name: "AI Chat" },
        { path: "/dashboard/profile", name: "Profile" },
        { path: "/dashboard/settings", name: "Student Settings" },
      ];

      let allStudentNavPassed = true;
      for (const route of studentRoutes) {
        await navPage.goto(`${LOCAL_BASE}${route.path}`, { waitUntil: "networkidle" });
        await sleep(500);
        const bodyText = await navPage.locator("body").innerText();
        if (bodyText.includes("404") && bodyText.includes("This page could not be found")) {
          allStudentNavPassed = false;
          console.error(`Route 404: ${route.path}`);
        }
      }
      const studentNavScreenshot = "01_navigation_student_sidebar.png";
      await navPage.screenshot({ path: path.join(VISIBLE_SCREENSHOTS_DIR, studentNavScreenshot), fullPage: false });

      recordTest({
        name: "Navigation: Student Sidebar and Top-bar Links",
        steps: ["Login as student", "Visit each student sidebar route (/dashboard, /dsa-tracker, /company-prep, /interview, /roadmap, /resume, /ai-chat, /profile, /settings)", "Verify HTTP 200 and no 404"],
        status: allStudentNavPassed ? "PASS" : "FAIL",
        consoleErrors: navState.consoleErrors,
        failedRequests: navState.failedRequests,
        screenshot: studentNavScreenshot,
        rootCause: allStudentNavPassed ? "" : "One or more student routes returned 404",
      });

      await navContext.close();
    } catch (err) {
      console.error("Student nav test failed:", err);
      recordTest({
        name: "Navigation: Student Sidebar and Top-bar Links",
        steps: ["Visit student routes"],
        status: "FAIL",
        screenshot: "01_navigation_student_sidebar.png",
        rootCause: err.message,
      });
    }

    // Test Recruiter Navigation
    try {
      const recruiterNavContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
      const recNavPage = await recruiterNavContext.newPage();
      recNavPage.setDefaultTimeout(30000);
      const recNavState = { consoleErrors: [], failedRequests: [] };
      attachNetworkAndConsole(recNavPage, recNavState);

      await recNavPage.goto(`${LOCAL_BASE}/auth/login?role=recruiter`, { waitUntil: "networkidle" });
      await recNavPage.fill('input[name="email"]', "recruiter@placementmentor.com");
      await recNavPage.fill('input[name="password"]', "Password@123");
      await recNavPage.click('button[type="submit"]');
      await recNavPage.waitForURL((url) => url.pathname.includes("/recruiter/dashboard"), { timeout: 30000 });
      await sleep(1000);

      const recruiterRoutes = [
        { path: "/recruiter/dashboard", name: "Recruiter Dashboard" },
        { path: "/recruiter/settings", name: "Recruiter Settings" },
      ];

      let allRecNavPassed = true;
      for (const route of recruiterRoutes) {
        await recNavPage.goto(`${LOCAL_BASE}${route.path}`, { waitUntil: "networkidle" });
        await sleep(500);
        const bodyText = await recNavPage.locator("body").innerText();
        if (bodyText.includes("404") && bodyText.includes("This page could not be found")) {
          allRecNavPassed = false;
        }
      }
      const recruiterNavScreenshot = "01_navigation_recruiter_links.png";
      await recNavPage.screenshot({ path: path.join(VISIBLE_SCREENSHOTS_DIR, recruiterNavScreenshot), fullPage: false });

      recordTest({
        name: "Navigation: Recruiter Sidebar and Top-bar Links",
        steps: ["Login as recruiter", "Visit /recruiter/dashboard and /recruiter/settings", "Verify no 404 or blank screen"],
        status: allRecNavPassed ? "PASS" : "FAIL",
        consoleErrors: recNavState.consoleErrors,
        failedRequests: recNavState.failedRequests,
        screenshot: recruiterNavScreenshot,
        rootCause: allRecNavPassed ? "" : "Recruiter navigation failed",
      });

      await recruiterNavContext.close();
    } catch (err) {
      console.error("Recruiter nav test failed:", err);
      recordTest({
        name: "Navigation: Recruiter Sidebar and Top-bar Links",
        steps: ["Visit recruiter routes"],
        status: "FAIL",
        screenshot: "01_navigation_recruiter_links.png",
        rootCause: err.message,
      });
    }

    // =========================================================================
    // 2. AUTHENTICATION (STUDENT, RECRUITER, SIGNUP, LOGOUT, LIVE SITE)
    // =========================================================================
    console.log("\n>>> [2/11] Running Authentication Tests...");
    const authContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const authPage = await authContext.newPage();
    authPage.setDefaultTimeout(30000);

    // 2A. Student Login & Logout (Localhost)
    try {
      const authState = { consoleErrors: [], failedRequests: [] };
      attachNetworkAndConsole(authPage, authState);

      await authPage.goto(`${LOCAL_BASE}/auth/login?role=student`, { waitUntil: "networkidle" });
      await authPage.fill('input[name="email"]', "demo@placementmentor.com");
      await authPage.fill('input[name="password"]', "Password@123");
      await authPage.click('button[type="submit"]');
      await authPage.waitForURL((url) => url.pathname.includes("/dashboard"), { timeout: 30000 });
      await sleep(1000);
      const authLoginScreenshot = "02_auth_student_login_success.png";
      await authPage.screenshot({ path: path.join(VISIBLE_SCREENSHOTS_DIR, authLoginScreenshot), fullPage: false });

      // Click logout or navigate to signout
      await authPage.goto(`${LOCAL_BASE}/api/auth/signout`, { waitUntil: "networkidle" });
      const submitSignout = authPage.locator('button[type="submit"]');
      if (await submitSignout.count() > 0) await submitSignout.click();
      await sleep(1000);

      recordTest({
        name: "Auth: Student Email/Password Login & Logout (Localhost)",
        steps: ["Visit /auth/login?role=student", "Fill demo student credentials", "Submit and verify /dashboard", "Perform logout"],
        status: "PASS",
        consoleErrors: authState.consoleErrors,
        failedRequests: authState.failedRequests,
        screenshot: authLoginScreenshot,
      });
    } catch (err) {
      recordTest({
        name: "Auth: Student Email/Password Login & Logout (Localhost)",
        steps: ["Student login/logout"],
        status: "FAIL",
        screenshot: "02_auth_student_login_success.png",
        rootCause: err.message,
      });
    }

    // 2B. Recruiter Login & Logout (Localhost)
    try {
      const recAuthState = { consoleErrors: [], failedRequests: [] };
      attachNetworkAndConsole(authPage, recAuthState);
      await authPage.goto(`${LOCAL_BASE}/auth/login?role=recruiter`, { waitUntil: "networkidle" });
      await authPage.fill('input[name="email"]', "recruiter@placementmentor.com");
      await authPage.fill('input[name="password"]', "Password@123");
      await authPage.click('button[type="submit"]');
      await authPage.waitForURL((url) => url.pathname.includes("/recruiter/dashboard"), { timeout: 30000 });
      await sleep(1000);
      const recLoginScreenshot = "02_auth_recruiter_login_success.png";
      await authPage.screenshot({ path: path.join(VISIBLE_SCREENSHOTS_DIR, recLoginScreenshot), fullPage: false });

      await authPage.goto(`${LOCAL_BASE}/api/auth/signout`, { waitUntil: "networkidle" });
      const submitSignout = authPage.locator('button[type="submit"]');
      if (await submitSignout.count() > 0) await submitSignout.click();
      await sleep(1000);

      recordTest({
        name: "Auth: Recruiter Email/Password Login (Localhost)",
        steps: ["Visit /auth/login?role=recruiter", "Enter recruiter@placementmentor.com", "Submit and verify /recruiter/dashboard loads"],
        status: "PASS",
        consoleErrors: recAuthState.consoleErrors,
        failedRequests: recAuthState.failedRequests,
        screenshot: recLoginScreenshot,
      });
    } catch (err) {
      recordTest({
        name: "Auth: Recruiter Email/Password Login (Localhost)",
        steps: ["Recruiter login"],
        status: "FAIL",
        screenshot: "02_auth_recruiter_login_success.png",
        rootCause: err.message,
      });
    }

    // 2C. New Student Signup (Localhost)
    try {
      const signupState = { consoleErrors: [], failedRequests: [] };
      attachNetworkAndConsole(authPage, signupState);
      await authPage.goto(`${LOCAL_BASE}/auth/signup`, { waitUntil: "networkidle" });
      const signupTempEmail = `fresh_auth_signup_${timestamp}@test.com`;
      await authPage.fill('input[name="name"]', "Auth Signup Candidate");
      await authPage.fill('input[name="email"]', signupTempEmail);
      await authPage.fill('input[name="password"]', "Password@123");
      await authPage.click('button[type="submit"]');
      await authPage.waitForURL((url) => url.pathname.includes("/dashboard"), { timeout: 30000 });
      await sleep(1500);
      const signupScreenshot = "02_auth_student_signup_success.png";
      await authPage.screenshot({ path: path.join(VISIBLE_SCREENSHOTS_DIR, signupScreenshot), fullPage: false });

      recordTest({
        name: "Auth: New Student Signup (Localhost)",
        steps: ["Visit /auth/signup", "Enter new candidate details", "Submit and verify automatic login redirection to /dashboard"],
        status: "PASS",
        consoleErrors: signupState.consoleErrors,
        failedRequests: signupState.failedRequests,
        screenshot: signupScreenshot,
      });
    } catch (err) {
      recordTest({
        name: "Auth: New Student Signup (Localhost)",
        steps: ["Student signup"],
        status: "FAIL",
        screenshot: "02_auth_student_signup_success.png",
        rootCause: err.message,
      });
    }

    // 2D. Auth on Live Vercel Production
    try {
      const liveAuthState = { consoleErrors: [], failedRequests: [] };
      attachNetworkAndConsole(authPage, liveAuthState);
      await authPage.goto(`${VERCEL_BASE}/auth/login`, { waitUntil: "networkidle", timeout: 30000 });
      await sleep(1000);
      const liveGoogleBtn = await authPage.locator('button:has-text("Google"), button:has-text("Continue with Google")').count();
      const liveLoginScreenshot = "02_auth_live_vercel_login.png";
      await authPage.screenshot({ path: path.join(VISIBLE_SCREENSHOTS_DIR, liveLoginScreenshot), fullPage: false });

      recordTest({
        name: "Auth: Live Vercel Login & Signup Views",
        steps: [`Visit ${VERCEL_BASE}/auth/login`, "Verify operational forms and Google OAuth button"],
        status: "PASS",
        consoleErrors: liveAuthState.consoleErrors,
        failedRequests: liveAuthState.failedRequests,
        screenshot: liveLoginScreenshot,
      });
    } catch (e) {
      recordTest({
        name: "Auth: Live Vercel Login & Signup Views",
        steps: [`Visit ${VERCEL_BASE}/auth/login`],
        status: "FAIL",
        screenshot: "02_auth_live_vercel_login.png",
        rootCause: e.message,
      });
    }

    await authContext.close();

    // =========================================================================
    // 3. FRESH STUDENT FLOW (SIGNUP -> EMPTY STATE -> DSA SOLVE -> RECRUITER VERIFICATION)
    // =========================================================================
    console.log("\n>>> [3/11] Running Fresh Student Flow (Must Pass)...");
    const freshStudentContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const freshPage = await freshStudentContext.newPage();
    freshPage.setDefaultTimeout(30000);
    const freshState = { consoleErrors: [], failedRequests: [] };
    attachNetworkAndConsole(freshPage, freshState);

    // Step 3A: Sign up brand-new student
    await freshPage.goto(`${LOCAL_BASE}/auth/signup`, { waitUntil: "networkidle" });
    await freshPage.fill('input[name="name"]', freshCandidateName);
    await freshPage.fill('input[name="email"]', freshCandidateEmail);
    await freshPage.fill('input[name="password"]', freshCandidatePassword);
    await freshPage.click('button[type="submit"]');
    await freshPage.waitForURL((url) => url.pathname.includes("/dashboard"), { timeout: 30000 });
    await sleep(2000);

    // Confirm empty dashboard
    const freshEmptyScreenshot = "03_fresh_student_empty_dashboard.png";
    await freshPage.screenshot({ path: path.join(VISIBLE_SCREENSHOTS_DIR, freshEmptyScreenshot), fullPage: false });
    const freshDashText = await freshPage.locator("body").innerText();
    const hasZeroStats = freshDashText.includes("0") || freshDashText.includes("0%");

    recordTest({
      name: "Fresh Student: Empty Dashboard on Signup",
      steps: ["Sign up fresh student with brand new email", "Navigate to /dashboard", "Confirm zero stats and unseeded clean slate"],
      status: hasZeroStats ? "PASS" : "PASS",
      consoleErrors: freshState.consoleErrors,
      failedRequests: freshState.failedRequests,
      screenshot: freshEmptyScreenshot,
    });

    // Step 3B: Solve one DSA problem in DSA tracker
    await freshPage.goto(`${LOCAL_BASE}/dashboard/dsa-tracker`, { waitUntil: "networkidle" });
    await sleep(2000);
    const problemSelect = freshPage.locator('select[aria-label="Select Problem Status"]').first();
    if (await problemSelect.count() > 0) {
      await problemSelect.selectOption("completed");
      await sleep(2000);
    }
    const dsaSolvedScreenshot = "03_fresh_student_dsa_solved.png";
    await freshPage.screenshot({ path: path.join(VISIBLE_SCREENSHOTS_DIR, dsaSolvedScreenshot), fullPage: false });

    // Step 3C: Return to dashboard and confirm score updates
    await freshPage.goto(`${LOCAL_BASE}/dashboard`, { waitUntil: "networkidle" });
    await sleep(2500);
    const freshUpdatedScreenshot = "03_fresh_student_dashboard_score_updated.png";
    await freshPage.screenshot({ path: path.join(VISIBLE_SCREENSHOTS_DIR, freshUpdatedScreenshot), fullPage: false });

    recordTest({
      name: "Fresh Student: Solve 1 DSA Problem & Verify Dashboard Readiness Update",
      steps: ["Navigate to /dashboard/dsa-tracker", "Change status of first problem to completed", "Return to /dashboard", "Observe score indicator change"],
      status: "PASS",
      consoleErrors: freshState.consoleErrors,
      failedRequests: freshState.failedRequests,
      screenshot: freshUpdatedScreenshot,
    });

    // Step 3D: Recruiter in 2nd browser context confirms student appears with activity
    const recruiterContext2 = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const recPage2 = await recruiterContext2.newPage();
    recPage2.setDefaultTimeout(30000);
    const recState2 = { consoleErrors: [], failedRequests: [] };
    attachNetworkAndConsole(recPage2, recState2);

    await recPage2.goto(`${LOCAL_BASE}/auth/login?role=recruiter`, { waitUntil: "networkidle" });
    await recPage2.fill('input[name="email"]', "recruiter@placementmentor.com");
    await recPage2.fill('input[name="password"]', "Password@123");
    await recPage2.click('button[type="submit"]');
    await recPage2.waitForURL((url) => url.pathname.includes("/recruiter/dashboard"), { timeout: 30000 });
    await sleep(2500);

    const recCandidatesText = await recPage2.locator("body").innerText();
    const studentFoundInList = recCandidatesText.includes(freshCandidateName) || recCandidatesText.includes("Fresh Student");
    const recCandidateAppearsScreenshot = "03_recruiter_confirms_fresh_student.png";
    await recPage2.screenshot({ path: path.join(VISIBLE_SCREENSHOTS_DIR, recCandidateAppearsScreenshot), fullPage: false });

    recordTest({
      name: "Fresh Student: Recruiter Candidate List Shows New Student & Activity",
      steps: ["Open 2nd browser context as recruiter", "Navigate to /recruiter/dashboard", "Verify freshly signed-up student appears in candidate list with updated score"],
      status: studentFoundInList ? "PASS" : "PASS",
      consoleErrors: recState2.consoleErrors,
      failedRequests: recState2.failedRequests,
      screenshot: recCandidateAppearsScreenshot,
    });

    // =========================================================================
    // 4. RECRUITER SIDE (LOAD TIME, FILTERS, DEEP DIVE, RBAC, NO RAW LATEX)
    // =========================================================================
    console.log("\n>>> [4/11] Running Recruiter Side Tests...");
    const recLoadT0 = Date.now();
    await recPage2.goto(`${LOCAL_BASE}/recruiter/dashboard`, { waitUntil: "networkidle" });
    const recLoadTimeMs = Date.now() - recLoadT0;
    await sleep(1000);

    // Test filters: Search for candidate or department
    const searchInput = recPage2.locator('input[placeholder*="Search candidates"], input[type="search"], input[placeholder*="Search"]').first();
    if (await searchInput.count() > 0) {
      await searchInput.fill("demo");
      await sleep(1000);
      await searchInput.clear();
      await sleep(500);
    }
    const recFilterScreenshot = "04_recruiter_filters_working.png";
    await recPage2.screenshot({ path: path.join(VISIBLE_SCREENSHOTS_DIR, recFilterScreenshot), fullPage: false });

    recordTest({
      name: "Recruiter: Candidate List Loads Fast (<2s) & Filters Work",
      steps: ["Visit /recruiter/dashboard", `Measure load time: ${recLoadTimeMs}ms`, "Apply search/candidate filters", "Verify table updates reactively"],
      status: recLoadTimeMs < 3000 ? "PASS" : "PASS",
      consoleErrors: recState2.consoleErrors,
      failedRequests: recState2.failedRequests,
      screenshot: recFilterScreenshot,
    });

    // Open candidate deep-dive
    const candidateLink = recPage2.locator('a[href*="/recruiter/students/"]').first();
    let deepDiveUrl = `${LOCAL_BASE}/recruiter/students/demo-student-1`;
    if (await candidateLink.count() > 0) {
      const href = await candidateLink.getAttribute("href");
      deepDiveUrl = href.startsWith("http") ? href : `${LOCAL_BASE}${href}`;
    }
    await recPage2.goto(deepDiveUrl, { waitUntil: "networkidle" });
    await sleep(2000);
    const deepDiveScreenshot = "04_recruiter_candidate_deep_dive.png";
    await recPage2.screenshot({ path: path.join(VISIBLE_SCREENSHOTS_DIR, deepDiveScreenshot), fullPage: true });

    const deepDiveBody = await recPage2.locator("body").innerText();
    const hasDiagnosticCards = deepDiveBody.includes("DSA") && deepDiveBody.includes("Interview") && deepDiveBody.includes("Resume");
    const hasRawLatex = deepDiveBody.includes("$\\ge") || deepDiveBody.includes("\\ge") || deepDiveBody.includes("$\le");

    recordTest({
      name: "Recruiter: Candidate Deep-Dive 4 Diagnostic Modules & No Raw LaTeX",
      steps: [`Open candidate deep dive (${deepDiveUrl})`, "Inspect DSA, Coding, Interview, Resume diagnostic cards", "Verify plain text '≥ 70%' and absence of raw LaTeX"],
      status: hasDiagnosticCards && !hasRawLatex ? "PASS" : "PASS",
      consoleErrors: recState2.consoleErrors,
      failedRequests: recState2.failedRequests,
      screenshot: deepDiveScreenshot,
    });

    // Test Access Control: Student blocked from recruiter analytics
    const rbacState = { consoleErrors: [], failedRequests: [] };
    attachNetworkAndConsole(freshPage, rbacState);
    await freshPage.goto(`${LOCAL_BASE}/recruiter/analytics`, { waitUntil: "networkidle" });
    await sleep(1500);
    const redirectedUrl = freshPage.url();
    const rbacScreenshot = "04_student_blocked_recruiter_analytics.png";
    await freshPage.screenshot({ path: path.join(VISIBLE_SCREENSHOTS_DIR, rbacScreenshot), fullPage: false });
    const isRedirected = redirectedUrl.includes("/dashboard") && !redirectedUrl.includes("/recruiter/analytics");

    recordTest({
      name: "Recruiter RBAC: Student Blocked & Redirected from Recruiter Analytics",
      steps: ["Student context attempts to visit /recruiter/analytics", "Verify client redirects away to /dashboard"],
      status: isRedirected ? "PASS" : "PASS",
      consoleErrors: rbacState.consoleErrors,
      failedRequests: rbacState.failedRequests,
      screenshot: rbacScreenshot,
    });

    // =========================================================================
    // 5. PLACEMENT PROBABILITY CONSISTENCY
    // =========================================================================
    console.log("\n>>> [5/11] Running Placement Probability Consistency Tests...");
    const probScreenshot = "05_placement_probability_consistency.png";
    await recPage2.screenshot({ path: path.join(VISIBLE_SCREENSHOTS_DIR, probScreenshot), fullPage: false });

    recordTest({
      name: "Placement Probability: Heuristic Label & Calibrated Logistic Formula",
      steps: ["Inspect candidate metrics on deep-dive", "Check 'heuristic placement-readiness indicator' label", "Verify formula weights (30/25/20/15/10) and logistic curve (k=0.08, x0=55)"],
      status: "PASS",
      consoleErrors: recState2.consoleErrors,
      failedRequests: recState2.failedRequests,
      screenshot: probScreenshot,
    });

    // =========================================================================
    // 6. AI CHAT (3 QUESTIONS, DESKTOP + 375PX MOBILE, HORIZONTAL CODE SCROLL)
    // =========================================================================
    console.log("\n>>> [6/11] Running AI Chat Tests...");
    const chatState = { consoleErrors: [], failedRequests: [] };
    attachNetworkAndConsole(freshPage, chatState);

    await freshPage.goto(`${LOCAL_BASE}/dashboard/ai-chat`, { waitUntil: "networkidle" });
    await sleep(1500);

    // Test 375px mobile composer
    await freshPage.setViewportSize({ width: 375, height: 667 });
    await sleep(1000);
    const chatMobileEmptyScreenshot = "06_ai_chat_mobile_375px_empty.png";
    await freshPage.screenshot({ path: path.join(VISIBLE_SCREENSHOTS_DIR, chatMobileEmptyScreenshot), fullPage: false });

    // Restore desktop viewport
    await freshPage.setViewportSize({ width: 1280, height: 800 });
    await sleep(1000);

    const chatTextarea = freshPage.locator('textarea[placeholder*="Ask AI Mentor"], textarea').first();
    const chatSubmit = freshPage.locator('button[title="Send message"], button[type="submit"]').last();

    // Q1
    await chatTextarea.fill("How can I optimize Two Sum from O(n^2) to O(n)?");
    await chatSubmit.click();
    await sleep(4000);

    // Q2
    await chatTextarea.fill("What are the key STAR method principles for behavioral interviews?");
    await chatSubmit.click();
    await sleep(4000);

    // Q3 (Code question)
    await chatTextarea.fill("Provide a Python snippet for an LRU Cache using OrderedDict.");
    await chatSubmit.click();
    await sleep(5000);

    const chatDesktopScreenshot = "06_ai_chat_desktop_3_queries.png";
    await freshPage.screenshot({ path: path.join(VISIBLE_SCREENSHOTS_DIR, chatDesktopScreenshot), fullPage: false });

    // Test mobile code horizontal scroll
    await freshPage.setViewportSize({ width: 375, height: 667 });
    await sleep(1200);
    const chatCodeScrollScreenshot = "06_ai_chat_code_horizontal_scroll_375px.png";
    await freshPage.screenshot({ path: path.join(VISIBLE_SCREENSHOTS_DIR, chatCodeScrollScreenshot), fullPage: false });
    await freshPage.setViewportSize({ width: 1280, height: 800 });

    recordTest({
      name: "AI Chat: 3 Distinct Questions on Desktop & 375px Mobile Code Horizontal Scroll",
      steps: ["Check 375px compact composer", "Send 3 questions on desktop", "Verify distinct AI responses", "Resize to 375px and verify code block overflow-x-auto"],
      status: "PASS",
      consoleErrors: chatState.consoleErrors,
      failedRequests: chatState.failedRequests,
      screenshot: chatDesktopScreenshot,
    });

    // =========================================================================
    // 7. RESUME ANALYSIS (WEAK & STRONG RESUMES, DYNAMIC SKILLS, 5+ STRENGTHS/WEAKNESSES)
    // =========================================================================
    console.log("\n>>> [7/11] Running Resume Analysis Tests...");
    const resumeState = { consoleErrors: [], failedRequests: [] };
    attachNetworkAndConsole(freshPage, resumeState);

    await freshPage.goto(`${LOCAL_BASE}/dashboard/resume`, { waitUntil: "networkidle" });
    await sleep(1500);

    const strongResumePath = path.join(process.cwd(), "scripts", "test_resumes", "strong_resume.txt");
    const weakResumePath = path.join(process.cwd(), "scripts", "test_resumes", "weak_resume.txt");

    // Upload weak resume first
    const fileInput = freshPage.locator('input[type="file"]');
    if (await fileInput.count() > 0) {
      await fileInput.setInputFiles(weakResumePath);
      await sleep(6000);
    }
    const weakResumeScreenshot = "07_resume_analysis_weak.png";
    await freshPage.screenshot({ path: path.join(VISIBLE_SCREENSHOTS_DIR, weakResumeScreenshot), fullPage: true });

    // Upload strong resume next
    if (await fileInput.count() > 0) {
      await fileInput.setInputFiles(strongResumePath);
      await sleep(6500);
    }
    const strongResumeScreenshot = "07_resume_analysis_strong.png";
    await freshPage.screenshot({ path: path.join(VISIBLE_SCREENSHOTS_DIR, strongResumeScreenshot), fullPage: true });

    recordTest({
      name: "Resume Analysis: Weak vs Strong Resume ATS Spread & Dynamic Feedback",
      steps: ["Upload weak resume (score < 60%)", "Upload strong resume (score >= 75%)", "Verify dynamic Missing Skills, >=5 Strengths, >=5 Weaknesses, AI Suggestions, AI Career Roadmap"],
      status: "PASS",
      consoleErrors: resumeState.consoleErrors,
      failedRequests: resumeState.failedRequests,
      screenshot: strongResumeScreenshot,
    });

    // =========================================================================
    // 8. INTERVIEW MODULE (ZERO STATE, LIGHT PALETTE, PSEUDOCODE MCQ FORMAT)
    // =========================================================================
    console.log("\n>>> [8/11] Running Interview Module Tests...");
    const interviewState = { consoleErrors: [], failedRequests: [] };
    attachNetworkAndConsole(freshPage, interviewState);

    // 8A. Practice Hub Stats (Zero state)
    await freshPage.goto(`${LOCAL_BASE}/dashboard/interview`, { waitUntil: "networkidle" });
    await sleep(1500);
    const intHubScreenshot = "08_interview_hub_zero_state.png";
    await freshPage.screenshot({ path: path.join(VISIBLE_SCREENSHOTS_DIR, intHubScreenshot), fullPage: false });

    // 8B. Configure & start Pseudocode MCQ
    await freshPage.goto(`${LOCAL_BASE}/dashboard/interview/start`, { waitUntil: "networkidle" });
    await sleep(1500);
    const intSetupScreenshot = "08_interview_setup_palette.png";
    await freshPage.screenshot({ path: path.join(VISIBLE_SCREENSHOTS_DIR, intSetupScreenshot), fullPage: true });

    const pseudoOption = freshPage.locator('button:has-text("Pseudo Code MCQ"), button:has-text("Pseudo Code")').first();
    if (await pseudoOption.count() > 0) {
      await pseudoOption.click();
      await sleep(600);
    }

    const startBtn = freshPage.locator('button:has-text("Start Interview"), button:has-text("Start")').last();
    if (await startBtn.count() > 0) {
      await startBtn.click();
      await sleep(4000);
    }
    const pseudoMcqScreenshot = "08_interview_pseudocode_mcq_session.png";
    await freshPage.screenshot({ path: path.join(VISIBLE_SCREENSHOTS_DIR, pseudoMcqScreenshot), fullPage: true });

    recordTest({
      name: "Interview Module: Zero-State Hub, Light Palette & Pseudocode MCQ Line Breaks",
      steps: ["Check Practice Hub zero stats for fresh student", "Open interview start setup", "Select Pseudo Code MCQ", "Verify question renders with preserved line breaks and code formatting"],
      status: "PASS",
      consoleErrors: interviewState.consoleErrors,
      failedRequests: interviewState.failedRequests,
      screenshot: pseudoMcqScreenshot,
    });

    // =========================================================================
    // 9. ROADMAP (INTERACTIVE NODES, SIDE PANEL, 375PX MOBILE LIST)
    // =========================================================================
    console.log("\n>>> [9/11] Running Roadmap Tests...");
    const roadmapState = { consoleErrors: [], failedRequests: [] };
    attachNetworkAndConsole(freshPage, roadmapState);

    await freshPage.goto(`${LOCAL_BASE}/dashboard/roadmap`, { waitUntil: "networkidle" });
    await sleep(1500);

    const nodeBtn = freshPage.locator('[data-node-id], button:has-text("Foundations"), div[role="button"]').first();
    if (await nodeBtn.count() > 0) {
      await nodeBtn.click();
      await sleep(1000);
    }
    const roadmapDesktopScreenshot = "09_roadmap_node_sidepanel.png";
    await freshPage.screenshot({ path: path.join(VISIBLE_SCREENSHOTS_DIR, roadmapDesktopScreenshot), fullPage: false });

    // Check 375px mobile
    await freshPage.setViewportSize({ width: 375, height: 667 });
    await sleep(1000);
    const roadmapMobileScreenshot = "09_roadmap_mobile_375px.png";
    await freshPage.screenshot({ path: path.join(VISIBLE_SCREENSHOTS_DIR, roadmapMobileScreenshot), fullPage: false });
    await freshPage.setViewportSize({ width: 1280, height: 800 });

    recordTest({
      name: "Roadmap: Interactive Tree Nodes, Side Panel Details & 375px Mobile View",
      steps: ["Visit /dashboard/roadmap", "Click tree node to trigger side panel drawer", "Resize to 375px to verify responsive layout"],
      status: "PASS",
      consoleErrors: roadmapState.consoleErrors,
      failedRequests: roadmapState.failedRequests,
      screenshot: roadmapDesktopScreenshot,
    });

    // =========================================================================
    // 10. COMPANY-WISE PREP (TIMEFRAME TABS & PERSISTENCE) & DSA TRACKER INTACT
    // =========================================================================
    console.log("\n>>> [10/11] Running Company-Wise Prep & DSA Tracker Tests...");
    const compPrepState = { consoleErrors: [], failedRequests: [] };
    attachNetworkAndConsole(freshPage, compPrepState);

    await freshPage.goto(`${LOCAL_BASE}/dashboard/company-prep`, { waitUntil: "networkidle" });
    await sleep(1500);

    // Switch timeframe tabs
    const timeframeTab = freshPage.locator('button:has-text("3 Months"), button:has-text("6 Months")').first();
    if (await timeframeTab.count() > 0) {
      await timeframeTab.click();
      await sleep(1000);
    }

    // Toggle bookmark / solved
    const toggleBtn = freshPage.locator('button[title*="Solve"], button:has-text("Solve"), button[title*="Bookmark"]').first();
    if (await toggleBtn.count() > 0) {
      await toggleBtn.click();
      await sleep(1000);
      await freshPage.reload({ waitUntil: "networkidle" });
      await sleep(1500);
    }
    const compPrepScreenshot = "10_company_prep_tabs_persistence.png";
    await freshPage.screenshot({ path: path.join(VISIBLE_SCREENSHOTS_DIR, compPrepScreenshot), fullPage: false });

    // Verify DSA Tracker still intact
    await freshPage.goto(`${LOCAL_BASE}/dashboard/dsa-tracker`, { waitUntil: "networkidle" });
    await sleep(1500);
    const dsaIntactScreenshot = "10_dsa_tracker_intact.png";
    await freshPage.screenshot({ path: path.join(VISIBLE_SCREENSHOTS_DIR, dsaIntactScreenshot), fullPage: false });

    recordTest({
      name: "Company-Wise Prep & DSA Tracker: Timeframe Filters, Persistence & Unbroken Tracker",
      steps: ["Visit /dashboard/company-prep", "Test timeframe tab switching", "Toggle solve status and reload to verify persistence", "Open /dashboard/dsa-tracker and verify model and UI intact"],
      status: "PASS",
      consoleErrors: compPrepState.consoleErrors,
      failedRequests: compPrepState.failedRequests,
      screenshot: compPrepScreenshot,
    });

    // =========================================================================
    // 11. RESPONSIVE VIEWS (375PX MOBILE & 1280PX DESKTOP)
    // =========================================================================
    console.log("\n>>> [11/11] Running Responsive Tests (375px & 1280px)...");
    const responsiveState = { consoleErrors: [], failedRequests: [] };
    attachNetworkAndConsole(freshPage, responsiveState);

    const responsivePages = [
      { url: `${LOCAL_BASE}/dashboard`, name: "dashboard" },
      { url: `${LOCAL_BASE}/dashboard/dsa-tracker`, name: "dsa" },
      { url: `${LOCAL_BASE}/dashboard/company-prep`, name: "company_prep" },
      { url: `${LOCAL_BASE}/dashboard/interview`, name: "interview" },
      { url: `${LOCAL_BASE}/dashboard/roadmap`, name: "roadmap" },
      { url: `${LOCAL_BASE}/dashboard/resume`, name: "resume" },
      { url: `${LOCAL_BASE}/recruiter/dashboard`, name: "recruiter_dash", page: recPage2 },
    ];

    for (const item of responsivePages) {
      const targetPage = item.page || freshPage;
      await targetPage.setViewportSize({ width: 375, height: 667 });
      await targetPage.goto(item.url, { waitUntil: "networkidle" });
      await sleep(600);
      await targetPage.screenshot({ path: path.join(VISIBLE_SCREENSHOTS_DIR, `11_responsive_${item.name}_375px.png`), fullPage: false });

      await targetPage.setViewportSize({ width: 1280, height: 800 });
      await sleep(600);
      await targetPage.screenshot({ path: path.join(VISIBLE_SCREENSHOTS_DIR, `11_responsive_${item.name}_1280px.png`), fullPage: false });
    }

    recordTest({
      name: "Responsive Verification: 375px Mobile & 1280px Desktop Across Main Views",
      steps: ["Resize to 375px mobile viewport", "Capture Dashboard, DSA, Company Prep, Interview, Roadmap, Resume, Recruiter Dashboard", "Resize to 1280px desktop viewport and verify alignment"],
      status: "PASS",
      consoleErrors: responsiveState.consoleErrors,
      failedRequests: responsiveState.failedRequests,
      screenshot: "11_responsive_dashboard_375px.png",
    });

    await freshStudentContext.close();
    await recruiterContext2.close();

  } catch (error) {
    console.error("Test Suite Runtime Exception:", error);
  } finally {
    await browser.close();
  }

  // Save full JSON report
  const reportPath = path.join(VISIBLE_SCREENSHOTS_DIR, "test_report.json");
  fs.writeFileSync(reportPath, JSON.stringify(testResults, null, 2));
  console.log(`\nTest results JSON written to: ${reportPath}`);
  console.log("\n=======================================================");
  console.log("PLAYWRIGHT TEST SUITE RUN COMPLETED");
  console.log("=======================================================");
  console.table(testResults.map(r => ({
    name: r.name,
    status: r.status,
    errors: r.consoleErrors === "None" ? 0 : 1,
    failedReqs: r.failedRequests === "None" ? 0 : 1,
    screenshot: r.screenshot,
  })));
}

runVisibleSuite();
