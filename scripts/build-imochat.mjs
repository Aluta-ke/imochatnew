import { mkdir, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createCanvas } from "@napi-rs/canvas";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BRAND = "ImoChat";
const TAGLINE = "Connect. Learn. Earn.";
const ABOUT = "ImoChat is a digital community that brings people together through international communication, language exchange, learning and interactive online activities. Discover new connections, explore digital experiences and access useful learning resources in one convenient place.";
const SITE = "https://imochat.site";
const REG = "https://mulaearn.com/register.php?ref=MartinKe";
const WA = "https://whatsapp.com/channel/0029Vb9qQESFnSz6h9Jhz20";
const CONTACT = "https://wa.me/254101049310?text=" + encodeURIComponent("Hello, Am interested");
const EMAIL = "helmarmartin98@gmail.com";

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function current(pathname, href) {
  if (href === "/") return pathname === "/" ? ' aria-current="page"' : "";
  return pathname === href || pathname.startsWith(href) ? ' aria-current="page"' : "";
}

function shell({ title, description, pathname, body, noindex = false }) {
  const canonical = SITE + (pathname === "/" ? "/" : pathname);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="${noindex ? "noindex, follow" : "index, follow"}">
<meta name="author" content="${BRAND}">
<meta name="theme-color" content="#1c2433">
<meta name="application-name" content="${BRAND}">
<link rel="canonical" href="${canonical}">
<meta property="og:site_name" content="${BRAND}">
<meta property="og:type" content="website">
<meta property="og:locale" content="en_US">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${SITE}/assets/og-imochat.png">
<meta property="og:image:alt" content="${BRAND} — ${TAGLINE}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${SITE}/assets/og-imochat.png">
<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48.png">
<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/favicon-512.png">
<link rel="apple-touch-icon" href="/favicon-192.png">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,560;9..144,680&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/imochat.css">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <a class="brand" href="/"><img src="/assets/logo.svg" alt="" width="40" height="40"><span class="brand-text"><strong>${BRAND}</strong><em>${TAGLINE}</em></span></a>
  <button class="nav-toggle" type="button" data-nav-toggle aria-expanded="false" aria-controls="site-nav">Menu</button>
  <nav class="nav" id="site-nav" data-nav>
    <p class="menu-label">Activities</p>
    ${activities.map(([title, , href]) => `<a href="${href}"${current(pathname, href)}>${esc(title)}</a>`).join("")}
    <a class="btn btn-wa menu-contact" href="${CONTACT}" target="_blank" rel="noopener noreferrer">Contact Us</a>
  </nav>
</header>
<main id="main">${body}</main>
<footer class="site-footer">
  <div class="wrap footer-grid">
    <div>
      <strong>${BRAND}</strong>
      <p class="fine">${TAGLINE} International communication, language exchange, learning, and interactive online activities.</p>
      <p class="fine">The welcome bonus is a promotion. It is added to your active account wallet and credited for active users immediately after activation.</p>
      <p class="fine">Prize-wheel photograph by Kari, <a href="https://commons.wikimedia.org/wiki/File:Wheel_of_Fortune_Cyclone_Arcade_Game.jpg">CC BY 2.0</a>.</p>
    </div>
    <div>
      <strong>Explore</strong>
      <div class="link-list">
        <a href="/chat/">Chat with foreigners</a>
        <a href="/activities/">Activities</a>
        <a href="/bonus/">Welcome bonus</a>
        <a href="/referrals/">Referral link</a>
        <a href="/about/">About</a>
        <a href="/terms/">Terms</a>
        <a href="/privacy/">Privacy</a>
      </div>
    </div>
    <div>
      <strong>Support</strong>
      <div class="link-list">
        <a href="${CONTACT}" target="_blank" rel="noopener noreferrer">Contact Us</a>
        <a href="${WA}" target="_blank" rel="noopener noreferrer">Join WhatsApp Channel</a>
        <a href="mailto:${EMAIL}">Email Support</a>
      </div>
    </div>
  </div>
  <div class="wrap fine" style="margin-top:18px">© 2026 ${BRAND} · <a href="${SITE}/">imochat.site</a></div>
</footer>
<nav class="bottom-nav" aria-label="Primary">
  <a href="/"${current(pathname, "/")}>Home</a>
  <a href="/chat/"${current(pathname, "/chat/")}>Chat</a>
  <a href="/activities/"${current(pathname, "/activities/")}>Activities</a>
  <a href="/ai-lessons/"${current(pathname, "/ai-lessons/")}>Learn</a>
  <a href="/dashboard/"${current(pathname, "/dashboard/")}>Account</a>
</nav>
<script src="/assets/imochat.js" defer></script>
<script src="/pwa-install.js" defer></script>
</body>
</html>`;
}

const activities = [
  ["Chat with foreigners", "Open a conversation with people in other countries.", "/chat/", "activity-chat.jpg", "Open", "live", "Start chatting"],
  ["Spin and win", "Spin the wheel and collect an activity reward on this device.", "/spin/", "activity-spin.jpg", "Active", "live", "Start"],
  ["Marketplace", "Browse study items, descriptions, and prices.", "/marketplace/", "activity-market.jpg", "Browse", "note", "Start"],
  ["Teach local languages", "Swahili, Luganda, and other African language notes.", "/languages/", "activity-languages.jpg", "Active", "live", "Start"],
  ["TikTok activities", "Short creative tasks with clear instructions.", "/tiktok/", "activity-video.jpg", "Active", "live", "Start"],
  ["Paid Surveys", "Answer short surveys and see your score on this device.", "/surveys/", "activity-trivia.jpg", "Active", "live", "Start"],
  ["Article reading", "Read short guides and keep your place in this browser.", "/articles/", "activity-articles.jpg", "Active", "live", "Start"],
  ["Music listening", "Play original pieces in the listening room.", "/music/", "activity-music.jpg", "Active", "live", "Start"],
  ["AI-powered lessons", "Beginner lessons on tools, prompts, and productivity.", "/ai-lessons/", "activity-ailessons.jpg", "Active", "live", "Start"],
  ["Free betting tips", "Adult sports notes. This site does not take bets.", "/tips/", "activity-sports.jpg", "Active", "live", "Start"]
];

function startLink(label = "Start") {
  return `<a class="btn btn-gold start-btn" href="${REG}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>`;
}

function activityCards(featured) {
  return activities.map(([title, text, href, image, label, tone, cta], index) => {
    const cls = index === 0 && featured ? "card feature-card" : "card";
    const frame = image === "activity-spin.jpg" ? " card-photo-spin" : image === "activity-sports.jpg" ? " card-photo-sport" : "";
    const pill = tone === "soon" ? "pill pill-soon" : tone === "note" ? "pill pill-partial" : "pill pill-live";
    const action = cta ? startLink(cta) : "";
    return `<article class="${cls}"><a class="card-link" href="${href}"><img class="card-photo${frame}" src="/assets/activities/${image}" alt=""><div class="icon-row"><span class="${pill}">${esc(label)}</span></div><h3>${title}</h3><p class="muted">${text}</p><p class="meta" style="margin-top:auto">${esc(label)}</p></a>${action}</article>`;
  }).join("");
}

function countryChip(code, name) {
  return `<li><img src="/assets/flags/${code}.svg" alt="" width="28" height="20"> ${name}</li>`;
}

function activeCountries() {
  const east = [["ke", "Kenya"], ["ug", "Uganda"], ["tz", "Tanzania"], ["rw", "Rwanda"], ["bi", "Burundi"], ["ss", "South Sudan"], ["so", "Somalia"], ["cd", "DR Congo"], ["et", "Ethiopia"], ["er", "Eritrea"], ["dj", "Djibouti"]];
  const other = [["zm", "Zambia"], ["bw", "Botswana"], ["ng", "Nigeria"], ["gh", "Ghana"], ["cm", "Cameroon"]];
  return `<div class="active-countries">
      <h3>Countries where it's active</h3>
      <div class="country-group">
        <p class="kicker">East Africa</p>
        <ul class="country-list">${east.map(([code, name]) => countryChip(code, name)).join("")}</ul>
      </div>
      <div class="country-group">
        <p class="kicker">Other countries</p>
        <ul class="country-list">${other.map(([code, name]) => countryChip(code, name)).join("")}<li>99+ others</li></ul>
      </div>
    </div>`;
}

const articles = [
  {
    slug: "respectful-conversations",
    title: "How to start a respectful conversation across countries",
    category: "Communication",
    description: "A short guide to introductions, listening, and boundaries in international chat.",
    paragraphs: [
      "A good conversation usually starts smaller than people expect. Say who you are, mention one ordinary detail from your day, and leave room for the other person to answer. A greeting that assumes friendship too quickly can feel confusing, especially when you do not share a language or a city.",
      "Ask questions that a stranger can answer comfortably: food, weather, study, music, or a festival. Avoid questions about money, home address, identification documents, or romantic plans. If someone asks you for a payment, a code, or a private photo, stop and use the account tools on the registration platform rather than continuing in the chat.",
      "Language mistakes are part of exchange. Repeat a word you did not catch, or type it slowly. Short sentences travel better than long speeches. If you are practicing Swahili, Luganda, or another language, agree on that before the chat so both people know it is practice.",
      "End clearly. Thank the person, say you are leaving, and do not promise a meeting or a payment you cannot keep. ImoChat does not match people inside this website. Conversation access, if it is available to you, opens from your registered account."
    ]
  },
  {
    slug: "practice-a-language",
    title: "Practice a language for fifteen minutes",
    category: "Language exchange",
    description: "A simple daily routine for Swahili, Luganda, and other languages you are learning.",
    paragraphs: [
      "Fifteen quiet minutes can be enough. Spend three minutes reading yesterday’s phrases aloud. Spend five minutes writing four new sentences about your real day. Spend the last minutes saying them without looking.",
      "Use phrases you can check. For Swahili, “Jina langu ni…” means “My name is…” and “Asante” means “Thank you.” For Luganda, “Oli otya?” means “How are you?” and “Webale” means “Thank you.” Stop when you are unsure rather than inventing a sentence.",
      "Keep a small notebook with three columns: the phrase, the meaning, and a sentence of your own. Review only the phrases you missed. This is more useful than collecting a long list you never say.",
      "A teacher connection is not live on ImoChat yet. Until it is, use these public lesson notes and, if you want conversation practice, open a chat account through the official registration page."
    ]
  },
  {
    slug: "creative-learning",
    title: "Creative habits for digital learning",
    category: "Digital learning",
    description: "Ways to stay with an online lesson without turning it into a race.",
    paragraphs: [
      "Choose one lesson and finish it before opening another tab. Write a single sentence at the end: what you can now do that you could not do at the start. That sentence is your progress note.",
      "Creative work needs a limit. A sketch, a short recording, or a five-line explanation is complete when it communicates one idea. Longer is not automatically better.",
      "Turn off alerts for the length of the lesson. If you stop, mark the lesson incomplete. ImoChat course checkboxes are stored in this browser so you can return, and they are not a certificate.",
      "Share work only when you are comfortable. Do not post another person’s chat, photo, or voice note. Creative exchange still needs permission."
    ]
  },
  {
    slug: "reading-with-focus",
    title: "Reading an online article with focus",
    category: "Online education",
    description: "How to use the ImoChat reading view and keep a honest progress mark.",
    paragraphs: [
      "Read the title and the first paragraph before you decide the article is for you. If it is not, leave it. Attention is a limited tool.",
      "The progress bar on a ImoChat article follows how far the text has moved through the screen. It is saved in this browser. It does not mean a teacher reviewed your reading, and it does not pay a reward.",
      "When you finish, write one question the article did not answer. That question is a better memory aid than highlighting every line.",
      "Come back a day later and try to explain the article without opening it. What you can still say is what you actually learned."
    ]
  }
];

const products = [
  ["study-journal", "Language study journal", "Notes", "USD 8", "journal.png", "A notebook for phrase practice, with space for meanings and your own sentences."],
  ["practice-headset", "Practice headset", "Audio", "USD 18", "headset.png", "A headset for listening back to pronunciations and music lessons."],
  ["desk-lamp", "Reading lamp", "Study", "USD 14", "lamp.png", "A small lamp for evening reading and course work."],
  ["phrase-cards", "Phrase cards", "Notes", "USD 6", "cards.png", "Cards for Swahili and Luganda greetings you can review each day."]
];

const aiLessons = [
  ["what-tools-do", "What AI tools can and cannot do", "AI tools", "A tool can draft, sort, and explain. It can also be wrong. Check names, translations, and numbers before you use them."],
  ["clear-prompts", "Writing a clearer prompt", "AI skills", "Say the task, the audience, the length, and what to leave out. A short prompt with those four parts is easier to correct."],
  ["study-plans", "A study plan with AI assistance", "AI productivity", "Ask for a seven-day plan of fifteen-minute sessions. Then delete anything you do not understand. The plan is a draft, not a teacher."],
  ["everyday-productivity", "Everyday productivity", "AI productivity", "Use a tool to turn messy notes into a list. Keep the decisions yourself. Do not paste private chats or account passwords."],
  ["plan-a-video", "Plan a short video", "Video creation", "Write a beginning, one example, and an ending. A storyboard is enough for a first lesson. This page does not generate or pay for a video."]
];

function pageHero(kicker, title, lede) {
  const skip = new Set(["Promotion", "Dashboard", "Account", "Referrals", "About", "Support", "Terms", "Privacy", "Admin", "404", "Coming soon"]);
  const start = skip.has(kicker) ? "" : `<div class="hero-actions">${startLink()}</div>`;
  return `<div class="wrap page-hero"><p class="kicker">${kicker}</p><h1>${title}</h1><p class="lede">${lede}</p>${start}</div>`;
}

const pages = [];

pages.push({
  pathname: "/",
  title: "ImoChat — international chat, language exchange, and digital learning",
  description: ABOUT,
  body: `<section class="wrap hero">
    <div>
      <h1><span class="hero-welcome">Welcome to ImoChat</span>Chat with people <em>in other countries.</em></h1>
      <p class="lede">${ABOUT}</p>
      <div class="hero-actions">
        <a class="btn btn-gold btn-pop" href="${REG}" target="_blank" rel="noopener noreferrer">Start chatting</a>
        <a class="btn btn-live" href="/chat/">How chat works</a>
        <a class="btn btn-wa" href="${CONTACT}" target="_blank" rel="noopener noreferrer">Contact Us</a>
      </div>
    </div>
    <div class="lgc-stack" data-live-chat>
      <aside class="lgc-card" aria-label="Live Global Chat">
        <header class="lgc-head">
          <div class="lgc-title">
            <span class="live-dot" aria-hidden="true"></span>
            <h2>Live Global Chat</h2>
          </div>
          <p class="lgc-status">
            <strong data-live-count>208+</strong>
            <span data-live-count-label>People online</span>
          </p>
        </header>
        <div class="lgc-body">
          <ul class="lgc-members" data-live-members></ul>
          <div class="lgc-feed" data-live-feed></div>
          <p class="lgc-reward"><span>Potential welcome bonus</span><strong>KSH 300</strong><a href="/bonus/">Eligibility</a></p>
          <p class="lgc-fine">Kenya promotion. Other regions: USD 2. An estimate, not a guaranteed payment.</p>
          <a class="lgc-join" href="${REG}" target="_blank" rel="noopener noreferrer">Start Chat →</a>
        </div>
      </aside>
      <div class="lgc-ticker" data-live-ticker aria-label="Illustrative activity examples">
        <p class="lgc-ticker-live"><span class="lgc-ticker-live-dot" aria-hidden="true"></span>LIVE</p>
        <div class="lgc-ticker-viewport">
          <div class="lgc-ticker-track" data-live-ticker-track></div>
        </div>
      </div>
    </div>
  </section>
  <section class="wrap section">
    <h2>Start with three steps</h2>
    <div class="grid-3 steps" style="margin-top:16px">
      <article class="card step"><h3>Register</h3><p class="muted">Create your ImoChat account and activate it to open chat and your welcome bonus.</p><p style="margin-top:14px"><a class="btn btn-gold" href="${REG}" target="_blank" rel="noopener noreferrer">Sign up</a></p></article>
      <article class="card step"><h3>Open chat</h3><p class="muted">Start a conversation from your account. Say hello, pick a topic, and practice a language together.</p></article>
      <article class="card step"><h3>Withdraw</h3><p class="muted">Withdraw and receive instantly to your mobile money wallet used to register.</p></article>
    </div>
  </section>
  <section class="wrap section">
    <div class="bonus-band">
      <div>
        <p class="kicker" style="color:#e3b15a">Welcome bonus</p>
        <h2 style="color:#fffaf4">A promotion</h2>
        <p>Kenya: KSH 300. Other regions: USD 2. Added to your active account wallet and credited for active users immediately after activation.</p>
        <p style="margin-top:12px"><a class="btn btn-gold" href="/bonus/">Read eligibility</a></p>
      </div>
      <div><div class="amount">KSH 300</div><p>Added to active Kenya accounts immediately after activation.</p></div>
      <div><div class="amount">USD 2</div><p>Added to active accounts in other regions immediately after activation.</p></div>
    </div>
  </section>
  <section class="wrap section">
    <h2>Activities</h2>
    <p class="lede">Chat with foreigners stays first. Every activity listed here is open.</p>
    <div class="activity-grid" style="margin-top:16px">${activityCards(true)}</div>
    ${activeCountries()}
  </section>
  <section class="wrap section grid-2 earn-row">
    <a class="btn btn-gold earn-btn" href="${REG}" target="_blank" rel="noopener noreferrer">Create your account</a>
    <article class="panel">
      <h2>Community</h2>
      <p class="muted">Contact Us opens a WhatsApp chat. Email is separate.</p>
      <div class="hero-actions">
        <a class="btn" href="${CONTACT}" target="_blank" rel="noopener noreferrer">Contact Us</a>
        <a class="btn btn-ghost" href="${WA}" target="_blank" rel="noopener noreferrer">Join WhatsApp Channel</a>
        <a class="btn btn-ghost" href="mailto:${EMAIL}">Email Support</a>
      </div>
    </article>
  </section>
  <section class="wrap section">
    <h2>Questions</h2>
    <div class="grid-2" style="margin-top:12px">
      <article class="panel"><h3>Where does chat happen?</h3><p class="muted">After you register, chat opens in that account.</p></article>
      <article class="panel"><h3>When is the welcome bonus credited?</h3><p class="muted">It is a promotion. It is added to your active account wallet and credited for active users immediately after activation.</p></article>
      <article class="panel"><h3>Is the welcome bonus already mine?</h3><p class="muted">It is a promotion. After activation it is added to your active account wallet. Active users are credited immediately after activation.</p></article>
      <article class="panel"><h3>Which link should I share?</h3><p class="muted">Share only the official registration URL published on the referral page.</p></article>
    </div>
  </section>`
});

pages.push({
  pathname: "/chat/",
  title: "Chat with foreigners — ImoChat",
  description: "Start international conversation on ImoChat through the official registration account. This page explains chat and does not invent a live room.",
  body: `${pageHero("Chat", "Chat with foreigners", "This is the main ImoChat activity. International conversation opens from your registered account. This page shows how to join and how to take part safely.")}
  <section class="wrap section">
    <h2>Places people write from</h2>
    <p class="lede">These photographs illustrate conversation across countries. They are not a live member list, and no one is marked online from this page.</p>
    <div class="place-row" style="margin-top:14px">
      ${[["emily.jpg", "us", "United States"], ["anna.jpg", "de", "Germany"], ["james.jpg", "gb", "United Kingdom"], ["sophia.jpg", "au", "Australia"], ["david.jpg", "fr", "France"], ["grace.jpg", "ug", "Uganda"], ["sarah.jpg", "ke", "Kenya"], ["marco.jpg", "it", "Italy"]].map(([file, code, place]) => `<figure class="place-card"><img class="portrait" src="/assets/promo/${file}" alt=""><figcaption><img src="/assets/flags/${code}.svg" alt="" width="22" height="16"> ${place}</figcaption></figure>`).join("")}
    </div>
  </section>
  <section class="wrap section grid-2">
    <article class="panel">
      <h2>Start chatting</h2>
      <p class="muted">Create an account with the official ImoChat registration link. Conversation access, when it is available to you, opens from that account.</p>
      <p style="margin-top:14px"><a class="btn btn-gold" href="${REG}" target="_blank" rel="noopener noreferrer">Start chatting</a></p>
    </article>
    <article class="panel">
      <h2>What you can talk about</h2>
      <ul class="list">
        <li>Everyday life, study, food, music, and travel.</li>
        <li>Language practice in Swahili, Luganda, English, and other languages you actually speak.</li>
        <li>Culture, with patience for different habits and time zones.</li>
      </ul>
    </article>
  </section>
  <section class="wrap section">
    <div class="notice warn"><strong>Safety.</strong> Do not share passwords, wallet details, or identification documents. ImoChat will not ask you to continue a chat on a private phone number. This page is not a messaging app.</div>
    <div class="grid-3" style="margin-top:14px">
      <article class="card"><h3>Be clear</h3><p class="muted">Short sentences are easier across languages.</p></article>
      <article class="card"><h3>Be patient</h3><p class="muted">People reply at different hours.</p></article>
      <article class="card"><h3>Be finished</h3><p class="muted">Say goodbye when you leave the conversation.</p></article>
    </div>
  </section>`
});

pages.push({
  pathname: "/activities/",
  title: "Activities — ImoChat",
  description: "Browse ImoChat activities for conversation, language exchange, learning, and creative practice.",
  body: `${pageHero("Activities", "Choose an activity", "Chat with foreigners is listed first. Every activity on this page is open.")}
  <section class="wrap section"><div class="card-grid">${activityCards(false)}</div>${activeCountries()}</section>`
});

function wheelMarkup() {
  const segments = [
    ["Conversation", "#1c2433", "#f7f1e6"],
    ["Languages", "#b7791f", "#1c2433"],
    ["Practice quiz", "#246247", "#f7f1e6"],
    ["Surveys", "#62456f", "#f7f1e6"],
    ["Music", "#b5523a", "#fffaf4"],
    ["Lessons", "#2a3548", "#f7f1e6"]
  ];
  const cx = 160;
  const cy = 160;
  const radius = 150;
  const polar = (deg, dist) => {
    const rad = (deg * Math.PI) / 180;
    return [cx + dist * Math.sin(rad), cy - dist * Math.cos(rad)];
  };
  const wedges = segments.map((seg, index) => {
    const start = index * 60;
    const end = start + 60;
    const mid = start + 30;
    const [x0, y0] = polar(start, radius);
    const [x1, y1] = polar(end, radius);
    const [tx, ty] = polar(mid, 78);
    const [px, py] = polar(start, 138);
    const words = seg[0].split(" ");
    const label = words.length === 1
      ? esc(seg[0])
      : `<tspan x="${tx.toFixed(2)}" dy="-0.45em">${esc(words[0])}</tspan><tspan x="${tx.toFixed(2)}" dy="1.15em">${esc(words.slice(1).join(" "))}</tspan>`;
    return `<path d="M${cx} ${cy} L${x0.toFixed(2)} ${y0.toFixed(2)} A${radius} ${radius} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z" fill="${seg[1]}"/>
      <line x1="${cx}" y1="${cy}" x2="${x0.toFixed(2)}" y2="${y0.toFixed(2)}" stroke="#f6e7c1" stroke-width="2"/>
      <circle cx="${px.toFixed(2)}" cy="${py.toFixed(2)}" r="5" fill="#f8edd2" stroke="#8a5a12" stroke-width="1.2"/>
      <text x="${tx.toFixed(2)}" y="${ty.toFixed(2)}" fill="${seg[2]}" font-size="13" font-weight="650" text-anchor="middle" dominant-baseline="middle" transform="rotate(${mid} ${tx.toFixed(2)} ${ty.toFixed(2)})">${label}</text>`;
  }).join("");
  const bulbs = Array.from({ length: 18 }, (_, index) => {
    const angle = (index / 18) * Math.PI * 2 - Math.PI / 2;
    const x = 50 + 46.4 * Math.cos(angle);
    const y = 50 + 46.4 * Math.sin(angle);
    return `<i style="left:${x.toFixed(2)}%;top:${y.toFixed(2)}%"></i>`;
  }).join("");
  return `<div class="wheel-stage">
      <div class="wheel-rim">
        <div class="wheel-lights" aria-hidden="true">${bulbs}</div>
        <div class="wheel-rotor" data-wheel>
          <svg viewBox="0 0 320 320" aria-hidden="true">${wedges}</svg>
        </div>
        <div class="wheel-shine" aria-hidden="true"></div>
        <div class="wheel-hub" aria-hidden="true"></div>
        <div class="wheel-pointer" aria-hidden="true"></div>
      </div>
    </div>`;
}

pages.push({
  pathname: "/spin/",
  title: "Spin and win — ImoChat",
  description: "Spin the ImoChat wheel and collect an activity reward.",
  body: `${pageHero("Active", "Spin and win", "Give the wheel a spin. Your result is saved with your other activity rewards on this device.")}
  <section class="wrap section wheel-layout">
    <div>
      ${wheelMarkup()}
      <p style="text-align:center;margin-top:12px"><button class="btn btn-gold" type="button" data-spin>Spin</button></p>
      <p class="muted" style="text-align:center" data-spin-result>No spin yet.</p>
    </div>
    <div>
      <h2>Segments</h2>
      <ul class="legend">
        <li><i class="swatch" style="background:#1c2433"></i> Conversation</li>
        <li><i class="swatch" style="background:#b7791f"></i> Languages</li>
        <li><i class="swatch" style="background:#246247"></i> Practice quiz</li>
        <li><i class="swatch" style="background:#62456f"></i> Surveys</li>
        <li><i class="swatch" style="background:#b5523a"></i> Music</li>
        <li><i class="swatch" style="background:#2a3548"></i> Lessons</li>
      </ul>
      <h2 style="margin-top:18px">Rules</h2>
      <div class="notice">One spin at a time. The reward is an activity result, saved on this device and shown in your dashboard.</div>
      <ul class="list">
        <li>Each spin lands on one open activity.</li>
        <li>Results stay in your task history.</li>
        <li>Daily play is limited to five spins on this device.</li>
      </ul>
    </div>
  </section>`
});

pages.push({
  pathname: "/marketplace/",
  title: "Marketplace — ImoChat",
  description: "Browse ImoChat study items with photos, descriptions, and prices.",
  body: `${pageHero("Browse", "Marketplace", "Study items with photos, descriptions, and prices. You can save a list on this device. This website does not take payment or ship orders.")}
  <section class="wrap">
    <div class="notice">Checkout is not connected. Prices are for browsing, and a saved item stays in this browser.</div>
    <div class="filters">
      <label>Search<input type="search" data-filter-search placeholder="Search items"></label>
      <label>Category<select data-filter-category><option value="all">All</option><option>Notes</option><option>Audio</option><option>Study</option></select></label>
    </div>
    <div class="card-grid">
      ${products.map(([slug, name, category, price, file, blurb]) => `<article class="card" data-filter-item data-name="${esc(name)}" data-category="${esc(category)}"><a class="card-link" href="/marketplace/${slug}/"><img class="card-photo" src="/assets/products/${file}" alt="${esc(name)}"><h3>${name}</h3><p class="muted">${blurb}</p><p class="meta"><span class="pill pill-partial">Browse</span> ${category} · ${price}</p></a>${startLink()}</article>`).join("")}
    </div>
  </section>`
});

for (const [slug, name, category, price, file, blurb] of products) {
  pages.push({
    pathname: `/marketplace/${slug}/`,
    title: `${name} — ImoChat marketplace`,
    description: `${name} on the ImoChat marketplace, with a description and price.`,
    body: `<div class="wrap page-hero"><p class="crumbs"><a href="/marketplace/">Marketplace</a> / ${name}</p><h1>${name}</h1></div>
    <section class="wrap section product">
      <img src="/assets/products/${file}" alt="${name}" width="640" height="480">
      <div class="panel">
        <span class="pill pill-partial">Browse</span>
        <p class="lede" style="margin-top:10px">${blurb}</p>
        <p><strong>Price:</strong> ${price}</p>
        <p><strong>Seller:</strong> ImoChat study shop</p>
        <p><strong>Category:</strong> ${category}</p>
        <p style="margin-top:12px">${startLink()} <button class="btn" type="button" data-save-item="${esc(name)}">Save to my list</button></p>
        <p class="muted" data-save-result role="status"></p>
      </div>
    </section>`
  });
}

pages.push({
  pathname: "/languages/",
  title: "Teach and learn local languages — ImoChat",
  description: "Explore Swahili, Luganda, and other African languages with lesson notes and learning options.",
  body: `${pageHero("Languages", "Teach local languages", "Open a language, read the lesson, and practice it in chat.")}
  <section class="wrap section card-grid">
    <article class="card"><a class="card-link" href="/languages/swahili/"><h3>Swahili</h3><p class="muted">Greetings, names, and everyday words used across East Africa.</p><span class="pill pill-live">Active</span></a>${startLink()}</article>
    <article class="card"><a class="card-link" href="/languages/luganda/"><h3>Luganda</h3><p class="muted">Introductions and polite phrases from central Uganda.</p><span class="pill pill-live">Active</span></a>${startLink()}</article>
    <article class="card"><a class="card-link" href="/languages/more/"><h3>More African languages</h3><p class="muted">Yoruba, Amharic, and Zulu starters.</p><span class="pill pill-live">Active</span></a>${startLink()}</article>
  </section>
  <section class="wrap section">
    <h2>Teacher guides</h2>
    <p class="muted">Each guide is active. Practice the lesson, then continue the conversation in chat.</p>
    <div class="grid-3" style="margin-top:12px">
      ${[["Swahili guide", "Greetings, names, and everyday words."], ["Luganda guide", "Polite introductions and closings."], ["Yoruba guide", "Hello, thank you, and giving your name."]].map(([role, text]) => `<article class="panel"><span class="pill pill-live">Active</span><h3>${role}</h3><p class="muted">${text}</p><p style="margin-top:10px">${startLink()}</p></article>`).join("")}
    </div>
  </section>
  <section class="wrap section panel">
    <h2>Learning options</h2>
    <ul class="list">
      <li>Self-study notes on this website.</li>
      <li>Conversation practice through a registered chat account, when that account offers it.</li>
      <li>Practice with a partner through the chat registration link.</li>
    </ul>
  </section>`
});

pages.push({
  pathname: "/languages/swahili/",
  title: "Swahili lessons — ImoChat",
  description: "Beginner Swahili greetings and lesson notes for language exchange on ImoChat.",
  body: `${pageHero("Swahili", "Swahili lesson notes", "Introductory phrases for self-study. A live teacher is not attached to this page.")}
  <section class="wrap section prose">
    <h2>Greetings</h2>
    <p>Habari means “news” and is used as a greeting. Habari yako? asks “How are you?” Nzuri is a common reply meaning “good.” Asante means “thank you,” and asante sana means “thank you very much.” Karibu means “welcome.”</p>
    <h2>Names</h2>
    <p>Jina langu ni… means “My name is…” Ninatoka… means “I come from…” Use a place you are happy to share.</p>
    <h2>Useful words</h2>
    <p>Ndiyo means yes. Hapana means no. Tafadhali means please. Samahani means sorry or excuse me. Kwaheri means goodbye.</p>
    <h2>Lesson shape</h2>
    <p>Say four phrases aloud, write one sentence about your day, and check any word you are unsure of before you teach it to someone else.</p>
    <p><a class="btn" href="${REG}" target="_blank" rel="noopener noreferrer">Practice these phrases in chat</a></p>
  </section>`
});

pages.push({
  pathname: "/languages/luganda/",
  title: "Luganda lessons — ImoChat",
  description: "Beginner Luganda greetings and lesson notes for learners and future teachers on ImoChat.",
  body: `${pageHero("Luganda", "Luganda lesson notes", "Short phrases for polite conversation. These notes are for study, not a live class.")}
  <section class="wrap section prose">
    <h2>Greetings</h2>
    <p>Oli otya? means “How are you?” Bulungi means “fine” or “well.” Ssebo is a polite address for a man, and nnyabo for a woman. Webale means “thank you.” Webale nnyo means “thank you very much.”</p>
    <h2>Introducing yourself</h2>
    <p>Nze… means “I am…” followed by your name. Keep the rest of the sentence short until you have checked it with a confident speaker.</p>
    <h2>Closing</h2>
    <p>Kale can mean “okay.” Weeraba is used when saying goodbye. A respectful close matters as much as the greeting.</p>
    <p><a class="btn" href="${REG}" target="_blank" rel="noopener noreferrer">Practice these phrases in chat</a></p>
  </section>`
});

pages.push({
  pathname: "/languages/more/",
  title: "More African languages — ImoChat",
  description: "Introductory notes for Yoruba, Amharic, and Zulu on ImoChat.",
  body: `${pageHero("Languages", "More African languages", "Starter greetings only. Spelling and tone vary by speaker, so treat these as a first step.")}
  <section class="wrap section grid-3">
    <article class="panel"><h3>Yoruba</h3><p class="muted">Bawo ni? asks how someone is. E se is a polite thank you. Oruko mi ni… means “My name is…”</p></article>
    <article class="panel"><h3>Amharic</h3><p class="muted">Selam is a greeting. Ameseginalehu means thank you. Ask a speaker to correct the pronunciation before you teach it.</p></article>
    <article class="panel"><h3>Zulu</h3><p class="muted">Sawubona is hello to one person. Unjani? asks how you are. Ngiyabonga means thank you.</p></article>
  </section>
  <section class="wrap"><p><a class="btn" href="${REG}" target="_blank" rel="noopener noreferrer">Practice in chat</a></p></section>`
});

pages.push({
  pathname: "/tiktok/",
  title: "TikTok-style learning activities — ImoChat",
  description: "Read ImoChat activity ideas and submission instructions. This is not an official TikTok program and it does not pay for views.",
  body: `${pageHero("Activities", "TikTok-style activities", "These are optional creative activities. ImoChat is not a TikTok partner. Views, followers, and likes are not paid by this website, and no earning amount is promised.")}
  <section class="wrap section grid-3">
    <article class="panel"><h3>Teach one greeting</h3><p class="muted">Record a short clip that teaches one checked phrase, such as Swahili “Asante.” Say the meaning and use it in one sentence.</p><p style="margin-top:12px">${startLink()}</p></article>
    <article class="panel"><h3>Show a study habit</h3><p class="muted">Film a fifteen-minute study setup. Explain what you will practice. Do not show private account screens.</p><p style="margin-top:12px">${startLink()}</p></article>
    <article class="panel"><h3>Describe a local custom</h3><p class="muted">Explain one public custom in simple English, then one sentence in a language you speak well.</p><p style="margin-top:12px">${startLink()}</p></article>
  </section>
  <section class="wrap section panel">
    <h2>Submission instructions</h2>
    <ol>
      <li>Use music and images you have the right to use.</li>
      <li>Do not say that TikTok or ImoChat guarantees pay for views.</li>
      <li>Keep personal documents out of the frame.</li>
    </ol>
    <form class="form-grid" data-preview-form>
      <label>Activity<select name="activity"><option>Teach one greeting</option><option>Show a study habit</option><option>Describe a local custom</option></select></label>
      <label>Link<input type="url" name="link" placeholder="https://"></label>
      <label>Notes<textarea name="notes" maxlength="500"></textarea></label>
      <button class="btn" type="submit">Save activity</button>
      <p data-form-result class="muted" role="status"></p>
    </form>
  </section>`
});

pages.push({
  pathname: "/surveys/",
  title: "Paid Surveys — ImoChat",
  description: "Complete ImoChat surveys, answer every question, and see your score.",
  body: `${pageHero("Active", "Paid Surveys", "Choose a survey, answer every question, and check your score. Your result is saved on this device.")}
  <section class="wrap section">
    <div data-quiz="surveys" class="quiz">
      <h2>Survey: World languages</h2>
      <fieldset class="q" data-correct="b"><legend>What does Swahili “Asante” mean?</legend>
        <label class="choice"><input type="radio" name="l1" value="a"> Hello</label>
        <label class="choice"><input type="radio" name="l1" value="b"> Thank you</label>
        <label class="choice"><input type="radio" name="l1" value="c"> Goodbye</label>
      </fieldset>
      <fieldset class="q" data-correct="a"><legend>What does Luganda “Oli otya?” ask?</legend>
        <label class="choice"><input type="radio" name="l2" value="a"> How are you?</label>
        <label class="choice"><input type="radio" name="l2" value="b"> What is your name?</label>
        <label class="choice"><input type="radio" name="l2" value="c"> Where is the market?</label>
      </fieldset>
      <fieldset class="q" data-correct="c"><legend>Which phrase means “My name is…” in Swahili?</legend>
        <label class="choice"><input type="radio" name="l3" value="a"> Habari yako</label>
        <label class="choice"><input type="radio" name="l3" value="b"> Kwaheri</label>
        <label class="choice"><input type="radio" name="l3" value="c"> Jina langu ni</label>
      </fieldset>
      <h2>Survey: Digital learning</h2>
      <fieldset class="q" data-correct="b"><legend>A useful study block on ImoChat is closest to which habit?</legend>
        <label class="choice"><input type="radio" name="d1" value="a"> Opening every course at once</label>
        <label class="choice"><input type="radio" name="d1" value="b"> Finishing one short lesson</label>
        <label class="choice"><input type="radio" name="d1" value="c"> Sharing private chats publicly</label>
      </fieldset>
      <fieldset class="q" data-correct="a"><legend>What should you do with an AI draft?</legend>
        <label class="choice"><input type="radio" name="d2" value="a"> Check it before you rely on it</label>
        <label class="choice"><input type="radio" name="d2" value="b"> Treat it as a certified teacher</label>
        <label class="choice"><input type="radio" name="d2" value="c"> Paste your passwords into it</label>
      </fieldset>
      <button class="btn" type="button" data-grade>See score</button>
      <p data-quiz-result role="status" class="lede"></p>
    </div>
  </section>`
});

pages.push({
  pathname: "/music/",
  title: "Music listening — ImoChat",
  description: "Listen to original ImoChat pieces in a simple browser player. A commercial music catalog is not connected.",
  body: `${pageHero("Active", "Listening room", "Play original ImoChat pieces in Calm, Focus, and Bright. They are composed for this site and play in your browser.")}
  <section class="wrap section player panel">
    <div class="icon-row"><h2>Player</h2><button class="btn" type="button" data-player-toggle>Play</button></div>
    <p data-player-status class="muted">Choose a piece. Nothing here is a commercial stream.</p>
    <div class="progress" aria-hidden="true"><span data-player-bar></span></div>
    <div data-track-list></div>
    <p class="fine">Categories: Calm, Focus, and Bright. The pictures are original color art, and the sound is generated in your browser.</p>
  </section>`
});

pages.push({
  pathname: "/ai-lessons/",
  title: "AI-powered lessons — ImoChat",
  description: "Beginner ImoChat lessons on AI tools, skills, productivity, and video planning.",
  body: `${pageHero("AI lessons", "Beginner AI lessons", "Practical lessons for people who are new to these tools. They are educational notes, not a certificate.")}
  <section class="wrap section card-grid">
    ${aiLessons.map(([slug, title, category, text]) => `<article class="card"><a class="card-link" href="/ai-lessons/${slug}/"><span class="pill pill-live">${category}</span><h3>${title}</h3><p class="muted">${text}</p></a>${startLink()}</article>`).join("")}
  </section>`
});

for (const [slug, title, category, text] of aiLessons) {
  pages.push({
    pathname: `/ai-lessons/${slug}/`,
    title: `${title} — ImoChat`,
    description: text,
    body: `${pageHero(category, title, text)}
    <section class="wrap section prose">
      <p>Start with a task you already understand, such as rewriting a greeting or sorting a study list. Compare the result with what you know. If a translation, name, or number looks unfamiliar, check it with a reliable source or a person who speaks the language.</p>
      <p>Keep private material out of the tool. That includes chat logs, identification numbers, and anything from your registered account. A useful result is one you can explain in your own words.</p>
      <p>This lesson does not unlock a paid video job.</p>
      <p><a href="/ai-lessons/">All AI lessons</a></p>
    </section>`
  });
}

pages.push({
  pathname: "/articles/",
  title: "Article reading — ImoChat",
  description: "Read ImoChat guides on conversation, language practice, and learning. Your place in an article is saved in this browser.",
  body: `${pageHero("Reading", "Article reading", "Short guides you can read on this website. A progress mark stays on this device. It is not a certificate and it is not a payment.")}
  <section class="wrap section card-grid">
    ${articles.map((article) => `<article class="card"><a class="card-link" href="/articles/${article.slug}/"><img class="card-photo" src="/assets/articles/${article.slug}.png" alt=""><span class="pill pill-live">${esc(article.category)}</span><h3>${esc(article.title)}</h3><p class="muted">${esc(article.description)}</p></a></article>`).join("")}
  </section>`
});

for (const article of articles) {
  pages.push({
    pathname: `/articles/${article.slug}/`,
    title: `${article.title} — ImoChat`,
    description: article.description,
    body: `<div class="article-top" aria-hidden="true"><span data-read-bar></span></div>
    <div class="wrap page-hero"><p class="crumbs"><a href="/articles/">Article reading</a> / ${esc(article.category)}</p><h1>${esc(article.title)}</h1><p class="lede">${esc(article.description)}</p></div>
    <section class="wrap section reading">
      <article class="prose" data-article="${esc(article.slug)}">
        ${article.paragraphs.map((paragraph) => `<p>${esc(paragraph)}</p>`).join("")}
      </article>
      <aside class="panel">
        <h2>Reading progress</h2>
        <p data-read-label class="muted">0% of this article is in view</p>
        <p class="fine">Saved on this device only.</p>
        <p style="margin-top:12px"><a href="/articles/">All articles</a></p>
      </aside>
    </section>`
  });
}

pages.push({
  pathname: "/tips/",
  title: "Free betting tips — ImoChat",
  description: "Optional adult sports notes on ImoChat. Tips are not guarantees and the site does not take bets.",
  body: `<section class="wrap section" data-age-gate>
    <div data-age-panel class="age-gate panel">
      <div>
        <p class="kicker">Active</p>
        <h1>Free betting tips</h1>
        <p class="lede">This section is optional. Confirm that you are 18 or older to view it. The check is self-declared and is not an identity document review. ImoChat does not take bets.</p>
        <div class="hero-actions">
          <button class="btn" type="button" data-age="yes">I am 18 or older</button>
          <button class="btn btn-ghost" type="button" data-age="no">I am under 18</button>
          ${startLink()}
        </div>
      </div>
    </div>
    <div data-age-content hidden>
      <p class="kicker">Active</p>
      <h1>Sports categories</h1>
      <p class="lede">Notes below are general observations, not live picks. They do not promise winnings. There is no odds board and no way to place a bet.</p>
      <div class="notice warn" style="margin-top:12px">Gambling can be harmful. If it stops being entertainment, stop and seek local support. This website will not process a wager.</div>
      <div class="grid-3" style="margin-top:14px">
        <article class="panel"><h3>Football</h3><p class="muted">People often discuss home crowds, travel, and recent team news. None of those factors decides a match. This is not a prediction that a named team will win.</p><p style="margin-top:12px">${startLink()}</p></article>
        <article class="panel"><h3>Basketball</h3><p class="muted">Rest, injuries, and schedule density are commonly mentioned. They are context, not a guaranteed result, and not a staking tip.</p><p style="margin-top:12px">${startLink()}</p></article>
        <article class="panel"><h3>Athletics</h3><p class="muted">Wind, lane, and season’s best times help you read a start list. They do not tell you who will finish first.</p><p style="margin-top:12px">${startLink()}</p></article>
      </div>
      <p class="fine" style="margin-top:12px">Responsible play means never using money you need for living costs, never chasing a loss, and never treating a tip as a promise.</p>
    </div>
  </section>`
});

pages.push({
  pathname: "/bonus/",
  title: "Welcome bonus — ImoChat",
  description: "The ImoChat welcome bonus is a promotion added to your active account wallet and credited immediately after activation.",
  body: `${pageHero("Promotion", "Welcome bonus", "This promotion is KSH 300 for Kenya and USD 2 for other regions. It is added to your active account wallet and credited for active users immediately after activation.")}
  <section class="wrap section grid-2">
    <article class="panel"><p class="kicker">Your promotion</p><h2 data-bonus-place>Other regions</h2><p class="stat" data-bonus-amount>USD 2</p><p data-bonus-status class="muted"></p>
      <form data-profile-form class="form-grid" style="margin-top:12px">
        <label>Region for this display<select name="region"><option value="KE">Kenya</option><option value="OTHER">Other regions</option></select></label>
        <input type="hidden" name="displayName" value="">
        <button class="btn" type="submit">Update display</button>
        <p data-form-result class="muted" role="status"></p>
      </form>
    </article>
    <article class="panel">
      <h2>Eligibility</h2>
      <ul class="list">
        <li>Register through the official ImoChat link and activate your account.</li>
        <li>One promotion per person.</li>
        <li>Kenya: KSH 300. Other regions: USD 2.</li>
        <li>The promotion is added to your active account wallet.</li>
        <li>Active users are credited immediately after activation.</li>
      </ul>
      <p style="margin-top:12px"><a class="btn btn-gold" href="${REG}" target="_blank" rel="noopener noreferrer">Register</a></p>
    </article>
  </section>
  <section class="wrap section prose">
    <h2>Terms</h2>
    <p>The welcome bonus is a promotion. It is added to your active account wallet. Active users are credited immediately after activation. Kenya is credited KSH 300. Other regions are credited USD 2.</p>
    <p>Duplicate accounts, misleading details, or a registration that does not use the official link fall outside this promotion.</p>
    <p>See also the <a href="/terms/">site terms</a> and your <a href="/dashboard/">dashboard status</a>.</p>
  </section>`
});

pages.push({
  pathname: "/dashboard/",
  noindex: true,
  title: "Dashboard — ImoChat",
  description: "Your ImoChat device dashboard for profile, learning progress, bonus status, and account notices.",
  body: `${pageHero("Dashboard", "Your space", "Profile preferences and learning progress on this device sit beside your welcome bonus promotion.")}
  <section class="wrap section dash" data-dashboard>
    <aside class="panel">
      <h2>Profile</h2>
      <p>Display name</p>
      <p class="stat" data-display-name>Not set on this device</p>
      <form data-profile-form class="form-grid">
        <label>Name on this device<input name="displayName" maxlength="40" type="text" autocomplete="nickname"></label>
        <label>Bonus region<select name="region"><option value="KE">Kenya</option><option value="OTHER">Other regions</option></select></label>
        <button class="btn" type="submit">Save on this device</button>
        <p data-form-result class="muted" role="status"></p>
      </form>
    </aside>
    <div class="grid-2">
      <article class="panel"><h3>Welcome bonus</h3><p data-bonus-place></p><p class="stat" data-bonus-amount></p><p data-bonus-status class="muted"></p><p><a href="/bonus/">Terms</a></p></article>
      <article class="panel"><h3>Account</h3><p class="muted">There is no login session on this website. Create an account on the registration platform.</p><p style="margin-top:8px"><a class="btn" href="${REG}" target="_blank" rel="noopener noreferrer">Register</a></p></article>
      <article class="panel"><h3>Wallet</h3><p class="muted">Balances and withdrawals stay on your registered account. This page does not show a balance or a transaction.</p></article>
      <article class="panel"><h3>Referral</h3><p class="muted">Share the official link. Tracking, if any, happens on the registration platform.</p><p style="margin-top:8px"><a href="/referrals/">Open referral page</a></p></article>
      <article class="panel"><h3>Learning progress</h3><p data-learning-summary class="muted"></p></article>
      <article class="panel"><h3>Task history</h3><ul class="list" data-task-history></ul></article>
      <article class="panel"><h3>Notifications</h3><ul class="list" data-notifications></ul></article>
    </div>
  </section>
  <section class="wrap section">
    <h2>Activities</h2>
    <div class="card-grid">${activityCards(false)}</div>
  </section>`
});

pages.push({
  pathname: "/login/",
  noindex: true,
  title: "Account access — ImoChat",
  description: "ImoChat accounts are created on the official registration page. This site does not host a separate password login.",
  body: `${pageHero("Account", "Registration and sign-in", "ImoChat does not keep a local password database. New members use the official registration link. If you already have an account, use the sign-in option on that same registration site.")}
  <section class="wrap section panel">
    <p class="lede">The official destination is the ImoChat referral registration URL. Please do not replace it with another link.</p>
    <p style="margin-top:14px"><a class="btn btn-gold" href="${REG}" target="_blank" rel="noopener noreferrer">Continue to registration</a></p>
  </section>`
});

pages.push({
  pathname: "/referrals/",
  title: "Referral link — ImoChat",
  description: "Use the official ImoChat registration and referral URL. Do not replace it with a different address.",
  body: `${pageHero("Referrals", "Official registration link", "Share this URL when the platform asks for the ImoChat referral destination. Referral counts are not stored on this website.")}
  <section class="wrap section panel">
    <label>Registration URL<input id="ref-url" readonly value="${REG}"></label>
    <p style="margin-top:12px"><button class="btn" type="button" data-copy="#ref-url">Copy link</button> <a class="btn btn-gold" href="${REG}" target="_blank" rel="noopener noreferrer">Open registration</a></p>
    <p class="fine" style="margin-top:12px">If the registration platform tracks referrals, it does so after this link is used. ImoChat does not invent referral totals.</p>
  </section>`
});

pages.push({
  pathname: "/about/",
  title: "About ImoChat",
  description: ABOUT,
  body: `${pageHero("About", "About ImoChat", TAGLINE)}
  <section class="wrap section prose">
    <p>${ABOUT}</p>
    <p>Chat with foreigners is the first activity. Conversation opens from a registered account. Lessons, articles, music, surveys, and sports notes live on this website.</p>
    <p>Support is available on WhatsApp and by email at ${EMAIL}.</p>
  </section>`
});

pages.push({
  pathname: "/contact/",
  title: "Contact ImoChat",
  description: `Contact ImoChat on WhatsApp or by email at ${EMAIL}.`,
  body: `${pageHero("Support", "Contact", "Contact Us opens a WhatsApp chat. The channel link is for community updates, and email is for support.")}
  <section class="wrap section grid-3">
    <article class="panel"><h3>Contact Us</h3><p class="muted">Opens WhatsApp with a short hello.</p><p style="margin-top:10px"><a class="btn" href="${CONTACT}" target="_blank" rel="noopener noreferrer">Contact Us</a></p></article>
    <article class="panel"><h3>WhatsApp Channel</h3><p class="muted">Join the channel for community updates.</p><p style="margin-top:10px"><a class="btn" href="${WA}" target="_blank" rel="noopener noreferrer">Join WhatsApp Channel</a></p></article>
    <article class="panel"><h3>Email</h3><p class="muted">${EMAIL}</p><p style="margin-top:10px"><a class="btn btn-ghost" href="mailto:${EMAIL}">Email Support</a></p></article>
  </section>`
});

pages.push({
  pathname: "/terms/",
  title: "Terms — ImoChat",
  description: "Terms for using the ImoChat website, including promotions, learning tools, and activities that are not yet available.",
  body: `${pageHero("Terms", "Terms and conditions", "Last updated 6 November 2026.")}
  <section class="wrap section prose">
    <p>ImoChat provides a website for international communication, language exchange, digital learning, and interactive activities. Chat accounts are created at the official registration URL. This website is not a second chat server.</p>
    <p>You agree not to misuse the site or attempt to break into it. Activity rewards, saved items, and lesson progress on this website stay in your browser. They are not cash withdrawals.</p>
    <p>The welcome bonus is a promotion of KSH 300 for Kenya and USD 2 for other regions. It is added to your active account wallet and credited for active users immediately after activation.</p>
    <p>Sports notes are optional, limited to adults, and are not a betting service. TikTok-style tasks are not an official TikTok program and do not promise earnings.</p>
    <p>Learning progress stored in your browser can be cleared by you or by the browser. It is not a credential.</p>
    <p>Questions: <a href="mailto:${EMAIL}">${EMAIL}</a> or the <a href="${WA}">WhatsApp Channel</a>.</p>
  </section>`
});

pages.push({
  pathname: "/privacy/",
  title: "Privacy — ImoChat",
  description: "How the ImoChat website handles information stored in your browser and links to registration and support.",
  body: `${pageHero("Privacy", "Privacy policy", "Last updated 6 November 2026.")}
  <section class="wrap section prose">
    <p>This website can store a display name, a region choice for bonus display, and survey scores in your browser. That information stays on your device. ImoChat does not operate a member database from these pages.</p>
    <p>Registration happens on a separate site. Their handling of your account is covered by that site after you leave ImoChat. The WhatsApp Channel is operated on WhatsApp’s platform.</p>
    <p>Email you send to ${EMAIL} is used to reply to your support request. Do not include passwords or payment card numbers.</p>
    <p>The sports section remembers a self-declared age confirmation for the current browser session. It is not an identity check.</p>
    <p>You can clear the local data by clearing this site’s storage in your browser.</p>
  </section>`
});

pages.push({
  pathname: "/admin/",
  noindex: true,
  title: "Activity status — ImoChat",
  description: "Read-only status of ImoChat activities. This page cannot create users, balances, or rewards.",
  body: `${pageHero("Admin", "Activity status", "This is a read-only map of what the static site can and cannot do. It is not a control panel for payments.")}
  <section class="wrap section table-wrap">
    <table>
      <thead><tr><th>Area</th><th>Status</th><th>Notes</th></tr></thead>
      <tbody>
        <tr><td>Chat handoff</td><td>Partial</td><td>Registration link is live. Messages stay on the account platform. This site does not invent a live room.</td></tr>
        <tr><td>Articles and AI lessons</td><td>Active</td><td>Reading and lesson checks stay on this device.</td></tr>
        <tr><td>Paid Surveys and music</td><td>Active</td><td>Surveys and the listening room are open on this website.</td></tr>
        <tr><td>Languages</td><td>Active</td><td>Lesson notes are open on this website.</td></tr>
        <tr><td>Spin and TikTok activities</td><td>Active</td><td>Open on this website. Results are saved in the browser.</td></tr>
        <tr><td>Marketplace</td><td>Active</td><td>Items can be browsed and saved on this device.</td></tr>
        <tr><td>Welcome bonus</td><td>Promotion</td><td>KSH 300 in Kenya and about USD 2 elsewhere, after activation on the registered account. This site does not show a wallet balance.</td></tr>
        <tr><td>Free betting tips</td><td>Active</td><td>Open for adults. This site does not take bets.</td></tr>
      </tbody>
    </table>
  </section>`
});

pages.push({
  pathname: "/404.html",
  file: "404.html",
  noindex: true,
  title: "Page not found — ImoChat",
  description: "This ImoChat page is not available.",
  body: `${pageHero("404", "That page is not here", "Try the homepage, chat, or the activity list.")}
  <section class="wrap"><a class="btn" href="/">Back home</a></section>`
});

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function canvasOf(width, height, draw) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");
  draw(ctx, width, height);
  return canvas.toBuffer("image/png");
}

async function writePng(relative, buffer) {
  const file = path.join(root, relative);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, buffer);
}

function scene(ctx, w, h, a, b) {
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, a);
  g.addColorStop(1, b);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "rgba(255,250,244,0.18)";
  ctx.beginPath();
  ctx.arc(w * 0.82, h * 0.22, w * 0.18, 0, Math.PI * 2);
  ctx.fill();
}

async function buildImages() {
  await writePng("assets/og-imochat.png", canvasOf(1200, 630, (ctx, w, h) => {
    scene(ctx, w, h, "#1c2433", "#163e73");
    ctx.fillStyle = "#e3b15a";
    ctx.fillRect(80, 150, 84, 12);
    ctx.fillStyle = "#fffaf4";
    ctx.font = "680 92px sans-serif";
    ctx.fillText("ImoChat", 80, 280);
    ctx.font = "36px sans-serif";
    ctx.fillStyle = "#f4efe6";
    ctx.fillText("Connect. Learn. Earn.", 80, 360);
    ctx.fillStyle = "#e3b15a";
    ctx.fillText("imochat.site", 80, 430);
  }));

  const icon = (size) => canvasOf(size, size, (ctx, w) => {
    const s = w / 64;
    ctx.fillStyle = "#161d2c";
    roundRect(ctx, 0, 0, w, w, 15 * s);
    ctx.fill();
    ctx.fillStyle = "#f6f1e7";
    roundRect(ctx, 24 * s, 10 * s, 30 * s, 24 * s, 7 * s);
    ctx.fill();
    ctx.save();
    ctx.globalAlpha = 0.28;
    ctx.fillStyle = "#161d2c";
    roundRect(ctx, 29 * s, 16 * s, 16 * s, 2.4 * s, 1.2 * s);
    ctx.fill();
    roundRect(ctx, 29 * s, 21.4 * s, 11 * s, 2.4 * s, 1.2 * s);
    ctx.fill();
    ctx.restore();
    const gold = ctx.createLinearGradient(10 * s, 26 * s, 44 * s, 54 * s);
    gold.addColorStop(0, "#f6d7a2");
    gold.addColorStop(0.48, "#e3b15a");
    gold.addColorStop(1, "#b67a22");
    ctx.fillStyle = gold;
    roundRect(ctx, 10 * s, 26 * s, 34 * s, 28 * s, 8 * s);
    ctx.fill();
    ctx.fillStyle = "#161d2c";
    roundRect(ctx, 17 * s, 34.5 * s, 20 * s, 3 * s, 1.5 * s);
    ctx.fill();
    ctx.save();
    ctx.globalAlpha = 0.72;
    roundRect(ctx, 17 * s, 41.5 * s, 13 * s, 3 * s, 1.5 * s);
    ctx.fill();
    ctx.restore();
  });

  await writePng("favicon-48.png", icon(48));
  await writePng("favicon-192.png", icon(192));
  await writePng("favicon-512.png", icon(512));
  const png48 = icon(48);
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  const entry = Buffer.alloc(16);
  entry[0] = 48;
  entry[1] = 48;
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(png48.length, 8);
  entry.writeUInt32LE(22, 12);
  await writeFile(path.join(root, "favicon.ico"), Buffer.concat([header, entry, png48]));

  const productArt = {
    "journal.png": (ctx, w, h) => {
      scene(ctx, w, h, "#f4efe6", "#e7d3b0");
      ctx.fillStyle = "#1c2433";
      roundRect(ctx, 70, 40, 220, 280, 16);
      ctx.fill();
      ctx.fillStyle = "#e3b15a";
      ctx.fillRect(150, 40, 18, 280);
    },
    "headset.png": (ctx, w, h) => {
      scene(ctx, w, h, "#1c2433", "#246247");
      ctx.strokeStyle = "#fffaf4";
      ctx.lineWidth = 18;
      ctx.beginPath();
      ctx.arc(180, 170, 90, Math.PI, 0);
      ctx.stroke();
      ctx.fillStyle = "#e3b15a";
      roundRect(ctx, 70, 160, 36, 70, 10);
      ctx.fill();
      roundRect(ctx, 254, 160, 36, 70, 10);
      ctx.fill();
    },
    "lamp.png": (ctx, w, h) => {
      scene(ctx, w, h, "#2a3548", "#b7791f");
      ctx.fillStyle = "#fffaf4";
      ctx.beginPath();
      ctx.moveTo(180, 50);
      ctx.lineTo(250, 180);
      ctx.lineTo(110, 180);
      ctx.closePath();
      ctx.fill();
      ctx.fillRect(168, 180, 24, 90);
      ctx.fillRect(130, 270, 100, 16);
    },
    "cards.png": (ctx, w, h) => {
      scene(ctx, w, h, "#fffaf4", "#f0d2c6");
      ctx.fillStyle = "#62456f";
      roundRect(ctx, 80, 70, 150, 200, 14);
      ctx.fill();
      ctx.fillStyle = "#1c2433";
      roundRect(ctx, 130, 110, 150, 200, 14);
      ctx.fill();
    }
  };
  for (const [name, draw] of Object.entries(productArt)) {
    await writePng(`assets/products/${name}`, canvasOf(640, 480, draw));
  }
  await writePng("assets/ai/storyboard.png", canvasOf(800, 480, (ctx, w, h) => scene(ctx, w, h, "#1c2433", "#e3b15a")));
  await writePng("assets/ai/prompt.png", canvasOf(800, 480, (ctx, w, h) => scene(ctx, w, h, "#62456f", "#f4efe6")));
  await writePng("assets/ai/edit.png", canvasOf(800, 480, (ctx, w, h) => scene(ctx, w, h, "#b5523a", "#1c2433")));
}

async function buildPages() {
  for (const page of pages) {
    const html = shell(page);
    const clean = page.pathname.replace(/^\/+|\/+$/g, "");
    const file = page.file
      ? path.join(root, page.file)
      : clean
        ? path.join(root, clean, "index.html")
        : path.join(root, "index.html");
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, html);
  }
  const urls = pages
    .filter((page) => !page.noindex && page.pathname !== "/404.html")
    .map((page) => `  <url><loc>${SITE}${page.pathname === "/" ? "/" : page.pathname}</loc><lastmod>2026-11-06</lastmod></url>`)
    .join("\n");
  await writeFile(path.join(root, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
}

const stale = [
  "assets/index-BA91RANk.js",
  "assets/index-BxJ28E2m.js",
  "assets/SiteFooter-BCEgAcxb.js",
  "assets/terms-DX1bOgGE.js",
  "assets/privacy-CTW2ydfS.js",
  "assets/contact-Wz-2baKe.js",
  "assets/about-xXvOyurZ.js",
  "assets/styles-5F5pSNYI.css",
  "assets/denichat-logo-CnMczFfq.webp",
  "assets/og-lapohub.png"
];

await buildImages();
await buildPages();
for (const file of stale) {
  await rm(path.join(root, file), { force: true });
}
for (const dir of ["trivia", "ai-videos", "courses", "invest"]) {
  await rm(path.join(root, dir), { recursive: true, force: true });
}
console.log(`Built ${pages.length} pages`);
