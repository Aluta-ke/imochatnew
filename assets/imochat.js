(function () {
  "use strict";

  var REG = "https://lipahub.com/register.php?ref=MartinKe";
  var KEYS = {
    profile: "imochat.profile",
    articles: "imochat.articles",
    courses: "imochat.courses",
    trivia: "imochat.trivia",
    age: "imochat.age",
    entries: "imochat.entries"
  };

  function markLively() {
    var links = document.querySelectorAll("a");
    for (var i = 0; i < links.length; i++) {
      var text = links[i].textContent.replace(/\s+/g, " ").trim();
      if (text === "Contact Us" || text === "Join WhatsApp Channel") links[i].classList.add("wa-live");
    }
    var labels = document.querySelectorAll(".pill-live, .card .meta");
    for (var j = 0; j < labels.length; j++) {
      if (labels[j].textContent.replace(/\s+/g, " ").trim() === "Active") labels[j].classList.add("is-active-pop");
    }
  }

  function read(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {}
  }

  function profile() {
    return read(KEYS.profile, { displayName: "", region: guessRegion() });
  }

  function guessRegion() {
    try {
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      if (tz === "Africa/Nairobi") return "KE";
    } catch (e) {}
    return "OTHER";
  }

  function bonusCopy(region) {
    if (region === "KE" || region === "UG") {
      return {
        place: "Kenya",
        amount: "KSH 300",
        status: "Promotion. Added to your active account wallet and credited immediately after activation."
      };
    }
    return {
      place: "Other regions",
      amount: "USD 2",
      status: "Promotion. Added to your active account wallet and credited immediately after activation."
    };
  }

  function initNav() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var nav = document.querySelector("[data-nav]");
    if (!toggle || !nav) return;
    function setOpen(open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    }
    toggle.addEventListener("click", function () {
      setOpen(!nav.classList.contains("is-open"));
    });
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });
    document.addEventListener("click", function (event) {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(event.target) || toggle.contains(event.target)) return;
      setOpen(false);
    });
  }

  function initCopy() {
    document.querySelectorAll("[data-copy]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var el = document.querySelector(btn.getAttribute("data-copy"));
        var value = (el ? (el.value || el.textContent || "") : REG).trim();
        var done = function () {
          btn.textContent = "Copied";
          setTimeout(function () { btn.textContent = "Copy link"; }, 1600);
        };
        var fallback = function () {
          var input = document.createElement("textarea");
          input.value = value;
          document.body.appendChild(input);
          input.select();
          var ok = false;
          try { ok = document.execCommand("copy"); } catch (err) { ok = false; }
          input.remove();
          if (ok) done();
          else btn.textContent = "Select the link";
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(value).then(done).catch(fallback);
        } else fallback();
      });
    });
  }

  function addEntry(detail) {
    var entries = read(KEYS.entries, []);
    entries.unshift({ detail: detail, at: new Date().toISOString() });
    write(KEYS.entries, entries.slice(0, 12));
  }

  function initPreviewForms() {
    document.querySelectorAll("[data-preview-form]").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var data = new FormData(form);
        var activity = data.get("activity") || "Activity";
        var notes = (data.get("notes") || "").toString().trim();
        addEntry(activity + (notes ? ": " + notes.slice(0, 80) : ""));
        var slot = form.querySelector("[data-form-result]");
        if (slot) slot.textContent = "Saved. This activity is now in your dashboard history.";
        form.reset();
      });
    });
  }

  function initSaveItems() {
    document.querySelectorAll("[data-save-item]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var name = btn.getAttribute("data-save-item");
        addEntry("Saved " + name);
        var slot = btn.parentElement && btn.parentElement.parentElement
          ? btn.parentElement.parentElement.querySelector("[data-save-result]")
          : null;
        if (slot) slot.textContent = name + " is on your list.";
      });
    });
  }

  function initProfileForm() {
    var form = document.querySelector("[data-profile-form]");
    if (!form) return;
    var current = profile();
    if (form.displayName) form.displayName.value = current.displayName || "";
    if (form.region) form.region.value = current.region === "UG" ? "KE" : (current.region || "OTHER");
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      write(KEYS.profile, {
        displayName: (form.displayName.value || "").trim().slice(0, 40),
        region: form.region.value === "KE" ? "KE" : "OTHER"
      });
      var slot = form.querySelector("[data-form-result]");
      if (slot) slot.textContent = "Saved. This promotion is added to your active account wallet and credited for active users immediately after activation.";
      paintBonus();
      paintDashboard();
    });
  }

  function paintBonus() {
    var data = bonusCopy(profile().region);
    document.querySelectorAll("[data-bonus-amount]").forEach(function (el) { el.textContent = data.amount; });
    document.querySelectorAll("[data-bonus-place]").forEach(function (el) { el.textContent = data.place; });
    document.querySelectorAll("[data-bonus-status]").forEach(function (el) { el.textContent = data.status; });
  }

  function initReading() {
    var article = document.querySelector("[data-article]");
    var bar = document.querySelector("[data-read-bar]");
    if (!article) return;
    var slug = article.getAttribute("data-article");
    function paint() {
      var rect = article.getBoundingClientRect();
      var viewed = Math.min(rect.height, Math.max(0, window.innerHeight - rect.top));
      var seen = rect.height ? Math.min(100, Math.max(0, Math.round((viewed / rect.height) * 100))) : 0;
      if (bar) bar.style.width = seen + "%";
      var all = read(KEYS.articles, {});
      all[slug] = Math.max(all[slug] || 0, seen);
      write(KEYS.articles, all);
      var label = document.querySelector("[data-read-label]");
      if (label) label.textContent = seen + "% of this article is in view";
    }
    paint();
    window.addEventListener("scroll", paint, { passive: true });
  }

  function initCourses() {
    document.querySelectorAll("[data-course]").forEach(function (box) {
      var id = box.getAttribute("data-course");
      var saved = read(KEYS.courses, {});
      var done = saved[id] || [];
      box.querySelectorAll("[data-lesson]").forEach(function (input) {
        var lesson = input.getAttribute("data-lesson");
        input.checked = done.indexOf(lesson) !== -1;
        input.addEventListener("change", function () {
          var current = read(KEYS.courses, {});
          var list = current[id] || [];
          if (input.checked && list.indexOf(lesson) === -1) list.push(lesson);
          if (!input.checked) list = list.filter(function (item) { return item !== lesson; });
          current[id] = list;
          write(KEYS.courses, current);
          paintCourse(box, id);
        });
      });
      paintCourse(box, id);
    });
  }

  function paintCourse(box, id) {
    var inputs = box.querySelectorAll("[data-lesson]");
    var done = (read(KEYS.courses, {})[id] || []).length;
    var label = box.querySelector("[data-course-label]");
    if (label) label.textContent = done + " of " + inputs.length + " lessons marked complete on this device";
    var bar = box.querySelector("[data-course-bar]");
    if (bar) bar.style.width = (inputs.length ? Math.round((done / inputs.length) * 100) : 0) + "%";
  }

  function initQuiz() {
    var root = document.querySelector("[data-quiz]");
    if (!root) return;
    var button = root.querySelector("[data-grade]");
    var result = root.querySelector("[data-quiz-result]");
    if (!button) return;
    button.addEventListener("click", function () {
      var questions = root.querySelectorAll("[data-correct]");
      var score = 0;
      questions.forEach(function (q) {
        var expected = q.getAttribute("data-correct");
        var chosen = q.querySelector("input:checked");
        q.querySelectorAll(".choice").forEach(function (choice) { choice.classList.remove("is-correct", "is-wrong"); });
        q.querySelectorAll(".choice").forEach(function (choice) {
          var input = choice.querySelector("input");
          if (!input) return;
          if (input.value === expected) choice.classList.add("is-correct");
          else if (chosen && input === chosen) choice.classList.add("is-wrong");
        });
        if (chosen && chosen.value === expected) score += 1;
      });
      var category = root.getAttribute("data-quiz") || "practice";
      var history = read(KEYS.trivia, []);
      history.unshift({ category: category, score: score, total: questions.length, at: new Date().toISOString() });
      write(KEYS.trivia, history.slice(0, 12));
      if (result) {
        result.textContent = "Score: " + score + " / " + questions.length + ". Saved to your dashboard.";
      }
    });
  }

  function wheelAngle(el) {
    var transform = window.getComputedStyle(el).transform;
    if (!transform || transform === "none") return 0;
    var values = transform.match(/-?\d+\.?\d*(?:e-?\d+)?/gi);
    if (!values || values.length < 4) return 0;
    var angle = Math.atan2(parseFloat(values[1]), parseFloat(values[0])) * (180 / Math.PI);
    return angle < 0 ? angle + 360 : angle;
  }

  function initSpin() {
    var wheel = document.querySelector("[data-wheel]");
    var stage = document.querySelector(".wheel-stage");
    var button = document.querySelector("[data-spin]");
    var result = document.querySelector("[data-spin-result]");
    if (!wheel || !button) return;
    var busy = false;
    var motion = 0;
    var segments = ["Conversation", "Languages", "Practice quiz", "Trivia", "Music", "Lessons"];
    var reduceQuery = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    if (!reduceQuery || !reduceQuery.matches) wheel.classList.add("is-idling");

    function spin(fromUser) {
      if (busy) return;
      var today = new Date().toISOString().slice(0, 10);
      var spins = read("imochat.spins", { date: today, count: 0 });
      if (spins.date !== today) spins = { date: today, count: 0 };
      if (spins.count >= 5) {
        if (fromUser && result) result.textContent = "You have used today's five spins. Come back tomorrow.";
        return;
      }
      busy = true;
      var ticket = ++motion;
      var reduce = reduceQuery && reduceQuery.matches;
      var start = wheelAngle(wheel);
      var rotation = start + (reduce ? 60 : 1800 + Math.floor(Math.random() * 360));
      wheel.classList.remove("is-idling");
      wheel.style.transition = "none";
      wheel.style.transform = "rotate(" + start + "deg)";
      if (stage) stage.classList.add("is-spinning");
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          wheel.style.transition = "";
          wheel.style.transform = "rotate(" + rotation + "deg)";
        });
      });
      if (result) result.textContent = "Spinning…";
      window.setTimeout(function () {
        busy = false;
        var landed = ((rotation % 360) + 360) % 360;
        var index = Math.floor((((360 - landed) % 360) / 60)) % segments.length;
        var reward = segments[index];
        spins.count += 1;
        write("imochat.spins", spins);
        addEntry("Spin reward: " + reward);
        if (result) result.textContent = "You landed on " + reward + ". It is saved in your dashboard. " + spins.count + " of 5 spins used today.";
        if (stage) stage.classList.remove("is-spinning");
        if (!reduce) {
          window.setTimeout(function () {
            if (ticket !== motion) return;
            wheel.style.transition = "none";
            wheel.style.setProperty("--wheel-base", landed + "deg");
            wheel.classList.add("is-idling");
            wheel.style.transform = "";
          }, 1200);
        }
      }, reduce ? 250 : 4700);
    }

    button.addEventListener("click", function () { spin(true); });

    if (reduceQuery && reduceQuery.matches) return;
    var seen = false;
    function begin() {
      if (seen) return;
      seen = true;
      spin(false);
    }
    if (stage && "IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          observer.disconnect();
          begin();
        });
      }, { threshold: 0.55 });
      observer.observe(stage);
    } else {
      begin();
    }
  }

  function initSpinCards() {
    var photos = document.querySelectorAll(".card-photo-spin");
    if (!photos.length) return;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle("is-turning", entry.isIntersecting);
      });
    }, { threshold: 0.6 });
    Array.prototype.forEach.call(photos, function (photo) { observer.observe(photo); });
  }

  var tracks = [
    { title: "Paper Lantern", category: "Calm", bpm: 70, notes: [69, 72, 76, 79, 76, 72, 67, 64] },
    { title: "Study Window", category: "Focus", bpm: 84, notes: [60, 67, 72, 67, 64, 67, 72, 76] },
    { title: "Market Morning", category: "Bright", bpm: 96, notes: [72, 76, 79, 76, 74, 72, 69, 72] }
  ];

  function initMusic() {
    var list = document.querySelector("[data-track-list]");
    var status = document.querySelector("[data-player-status]");
    var bar = document.querySelector("[data-player-bar]");
    var toggle = document.querySelector("[data-player-toggle]");
    if (!list) return;
    var audioCtx = null;
    var timer = null;
    var step = 0;
    var current = 0;
    var playing = false;

    tracks.forEach(function (track, index) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "track" + (index === 0 ? " is-active" : "");
      btn.innerHTML = '<span class="art" style="background:linear-gradient(135deg,' + ["#1c2433,#e3b15a", "#246247,#f4efe6", "#b5523a,#e3b15a"][index] + ')"></span><span><strong>' + track.title + '</strong><br><span class="muted">' + track.category + " · original piece</span></span><span>Play</span>";
      btn.addEventListener("click", function () {
        current = index;
        step = 0;
        list.querySelectorAll(".track").forEach(function (el) { el.classList.remove("is-active"); });
        btn.classList.add("is-active");
        start();
      });
      list.appendChild(btn);
    });

    function ensure() {
      if (!audioCtx) {
        var Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return null;
        audioCtx = new Ctx();
      }
      return audioCtx;
    }

    function beep(note, when, dur) {
      var ctx = ensure();
      if (!ctx) return;
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = 440 * Math.pow(2, (note - 69) / 12);
      gain.gain.setValueAtTime(0.0001, when);
      gain.gain.exponentialRampToValueAtTime(0.08, when + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, when + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(when);
      osc.stop(when + dur + 0.02);
    }

    function stop() {
      playing = false;
      if (timer) window.clearInterval(timer);
      timer = null;
      if (toggle) toggle.textContent = "Play";
    }

    function start() {
      var ctx = ensure();
      if (!ctx) {
        if (status) status.textContent = "This browser cannot play the original audio.";
        return;
      }
      if (ctx.state === "suspended") ctx.resume();
      stop();
      playing = true;
      if (toggle) toggle.textContent = "Pause";
      var track = tracks[current];
      if (status) status.textContent = "Playing " + track.title + " · " + track.category;
      timer = window.setInterval(function () {
        if (!playing) return;
        var note = track.notes[step % track.notes.length];
        beep(note, ctx.currentTime, 0.28);
        step += 1;
        if (bar) bar.style.width = ((step % track.notes.length) / track.notes.length) * 100 + "%";
      }, Math.round(60000 / track.bpm));
    }

    if (toggle) {
      toggle.addEventListener("click", function () {
        if (playing) {
          stop();
          if (status) status.textContent = "Paused. These are original ImoChat pieces, not a commercial catalog.";
        } else start();
      });
    }
  }

  function initCatalog() {
    var search = document.querySelector("[data-filter-search]");
    var select = document.querySelector("[data-filter-category]");
    var cards = document.querySelectorAll("[data-filter-item]");
    if (!search && !select) return;
    function apply() {
      var q = search ? search.value.trim().toLowerCase() : "";
      var cat = select ? select.value : "all";
      cards.forEach(function (card) {
        var name = (card.getAttribute("data-name") || "").toLowerCase();
        var category = card.getAttribute("data-category") || "";
        var visible = (!q || name.indexOf(q) !== -1) && (cat === "all" || category === cat);
        card.hidden = !visible;
      });
    }
    if (search) search.addEventListener("input", apply);
    if (select) select.addEventListener("change", apply);
  }

  function initAge() {
    var gate = document.querySelector("[data-age-gate]");
    if (!gate) return;
    var panel = gate.querySelector("[data-age-panel]");
    var content = gate.querySelector("[data-age-content]");
    function open() {
      if (panel) panel.hidden = true;
      if (content) content.hidden = false;
    }
    if (sessionStorage.getItem(KEYS.age) === "yes") open();
    gate.querySelectorAll("[data-age]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (btn.getAttribute("data-age") === "yes") {
          sessionStorage.setItem(KEYS.age, "yes");
          open();
        } else if (panel) {
          panel.innerHTML = "<h2>This section is limited to adults</h2><p class='lede'>Free betting tips stay hidden because you did not confirm that you are 18 or older. ImoChat does not take bets.</p>";
        }
      });
    });
  }

  function paintDashboard() {
    if (!document.querySelector("[data-dashboard]")) return;
    var person = profile();
    var name = document.querySelector("[data-display-name]");
    if (name) name.textContent = person.displayName || "Not set on this device";
    var history = document.querySelector("[data-task-history]");
    if (history) {
      var trivia = read(KEYS.trivia, []);
      var entries = read(KEYS.entries, []);
      history.innerHTML = "";
      if (!trivia.length && !entries.length) {
        history.innerHTML = "<li>No activity results yet. Spin, complete a survey, or save an item.</li>";
      }
      entries.forEach(function (item) {
        var li = document.createElement("li");
        li.textContent = item.detail + " · " + item.at.slice(0, 10);
        history.appendChild(li);
      });
      trivia.forEach(function (item) {
        var li = document.createElement("li");
        li.textContent = "Paid Surveys: " + item.score + "/" + item.total + " · " + item.at.slice(0, 10);
        history.appendChild(li);
      });
    }
    var learn = document.querySelector("[data-learning-summary]");
    if (learn) {
      var articles = read(KEYS.articles, {});
      var courses = read(KEYS.courses, {});
      var articleBits = Object.keys(articles).map(function (key) { return key + " " + articles[key] + "%"; });
      var courseBits = Object.keys(courses).map(function (key) { return key + " (" + courses[key].length + " lessons checked)"; });
      var parts = articleBits.concat(courseBits);
      learn.textContent = parts.length ? parts.join(" · ") : "No saved progress is stored in this browser yet.";
    }
    var notes = document.querySelector("[data-notifications]");
    if (notes) {
      notes.innerHTML = "";
      [
        bonusCopy(person.region).status,
        person.displayName ? "Display name is saved only in this browser." : "You can save a display name on this device. It is not an account."
      ].forEach(function (text) {
        var li = document.createElement("li");
        li.textContent = text;
        notes.appendChild(li);
      });
    }
  }

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").catch(function () {});
  }

  markLively();
  initLiveActivity();
  initNav();
  initCopy();
  initPreviewForms();
  initSaveItems();
  initProfileForm();
  paintBonus();
  initReading();
  initCourses();
  initQuiz();
  initSpin();
  initSpinCards();
  initMusic();
  initCatalog();
  initAge();
  paintDashboard();
  initLiveChat();
  initPreviewChat();

  function initLiveChat() {
    var root = document.querySelector("[data-live-chat]");
    if (!root) return;
    var countEl = root.querySelector("[data-live-count]");
    var membersEl = root.querySelector("[data-live-members]");
    var feed = root.querySelector("[data-live-feed]");
    var tickerTrack = root.querySelector("[data-live-ticker-track]");
    if (!countEl || !membersEl || !feed || !tickerTrack) return;

    var counts = [208, 214, 221, 230, 226, 219, 212, 217, 224, 233, 218, 206];
    var countIndex = 0;
    var peopleStart = 0;
    var messageStart = 0;
    var typingIndex = 0;
    var people = [
      { name: "Emily", country: "US" },
      { name: "Daniel", country: "CA" },
      { name: "Anna", country: "DE" },
      { name: "James", country: "GB" },
      { name: "Sophia", country: "AU" },
      { name: "David", country: "FR" },
      { name: "Emma", country: "NL" },
      { name: "Lars", country: "SE" },
      { name: "Ingrid", country: "NO" },
      { name: "Marco", country: "IT" },
      { name: "Grace", country: "UG" },
      { name: "Sarah", country: "KE" }
    ];
    var messages = [
      { name: "Emily", country: "US", text: "Hi! Can someone teach me basic Swahili?" },
      { name: "David", country: "FR", text: "Habari! I want to practise my Swahili." },
      { name: "Emma", country: "NL", text: "How do you say 'How are you?' in Swahili?" },
      { name: "Anna", country: "DE", text: "Habari! Please teach me a simple Swahili greeting." },
      { name: "Sarah", country: "KE", text: "Habari from Kenya. Asante means thank you." },
      { name: "Lars", country: "SE", text: "Can we practise Swahili together? I know a few words." },
      { name: "Sophia", country: "AU", text: "What does Karibu mean in Swahili?" },
      { name: "James", country: "GB", text: "I am learning Swahili greetings. Anyone free to help?" },
      { name: "Marco", country: "IT", text: "Ciao! How do I say hello in Swahili?" },
      { name: "Daniel", country: "CA", text: "I would love to practise Swahili with someone from Kenya." },
      { name: "Grace", country: "UG", text: "I can also share one simple Luganda greeting: Oli otya?" },
      { name: "Anna", country: "DE", text: "After Swahili, I would like just a little Luganda too." },
      { name: "Emily", country: "US", text: "Hello everyone. Where are you chatting from today?" },
      { name: "Ingrid", country: "NO", text: "Hello from Norway. Just saying hi." },
      { name: "James", country: "GB", text: "Anyone watching football tonight?" }
    ];
    var tickerIcons = {
      join: '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="6" cy="5.2" r="2.1" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M2.6 13c.4-2.1 1.8-3.2 3.4-3.2s3 .1 3.4 3.2" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M11 6.2v3.6M9.2 8h3.6" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
      register: '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="2.4" width="10" height="11.2" rx="1.4" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M5.4 6.4h5.2M5.4 9h3.4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
      chat: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.8 3.2h10.4v6.8H6.4L2.8 12.6V3.2z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>',
      activity: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2.2l1.4 3 3.3.4-2.4 2.2.7 3.3L8 9.5 4.9 11.1l.7-3.3L3.2 5.6l3.3-.4z" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>',
      bonus: '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2.4" y="7" width="11.2" height="6.4" rx="1" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M8 7v6.4M2.4 9.2h11.2" stroke="currentColor" stroke-width="1.3"/><path d="M8 7C6.8 4.8 4.6 5 4.6 6.4S7 7 8 7s2.4-1.4 3.4-.6S9.2 4.8 8 7z" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>'
    };
    var activities = [
      { country: "UG", kind: "join", text: "James from Uganda joins ImoChat." },
      { country: "KE", kind: "register", text: "Sarah from Kenya registers an account." },
      { country: "TZ", kind: "chat", text: "Grace from Tanzania opens a Swahili practice chat." },
      { country: "CA", kind: "chat", text: "Emily from Canada opens a Swahili practice chat." },
      { country: "KE", kind: "bonus", text: "Sarah from Kenya may qualify for KSH 300." },
      { country: "US", kind: "activity", text: "Daniel from the USA tries an activity." },
      { country: "DE", kind: "join", text: "Anna from Germany joins ImoChat." },
      { country: "GB", kind: "activity", text: "Michael from the UK tries an activity." },
      { country: "AU", kind: "chat", text: "Sophia from Australia says hello." },
      { country: "FR", kind: "register", text: "David from France registers an account." },
      { country: "NL", kind: "join", text: "Sarah from the Netherlands joins ImoChat." },
      { country: "KE", kind: "activity", text: "James from Kenya practises a Swahili greeting." }
    ];
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function personByName(name) {
      for (var i = 0; i < people.length; i++) {
        if (people[i].name === name) return people[i];
      }
      return people[0];
    }

    function soften(node) {
      if (reduce || !node) return;
      node.classList.remove("lgc-soft");
      void node.offsetWidth;
      node.classList.add("lgc-soft");
    }

    function portrait(sizeClass) {
      var box = document.createElement("div");
      box.className = "lgc-avatar " + sizeClass;
      var img = document.createElement("img");
      img.alt = "";
      img.width = 160;
      img.height = 160;
      img.decoding = "async";
      box.appendChild(img);
      var dot = document.createElement("span");
      dot.className = "lgc-presence";
      dot.setAttribute("aria-hidden", "true");
      box.appendChild(dot);
      return box;
    }

    function flagNode() {
      var img = document.createElement("img");
      img.className = "lgc-flag";
      img.alt = "";
      img.width = 18;
      img.height = 12;
      return img;
    }

    function setFlag(img, code) {
      var next = "/assets/flags/" + code.toLowerCase() + ".svg";
      if (img.getAttribute("src") !== next) img.src = next;
    }

    function setPortrait(box, person) {
      var img = box.querySelector("img");
      var next = "/assets/promo/" + person.name.toLowerCase() + ".jpg";
      if (img.getAttribute("src") === next) return;
      img.onerror = function () {
        img.onerror = null;
        img.src = "/assets/promo/fallback.jpg";
      };
      img.src = next;
    }

    membersEl.innerHTML = "";
    feed.innerHTML = "";
    tickerTrack.innerHTML = "";

    for (var m = 0; m < 5; m++) {
      var item = document.createElement("li");
      item.className = "lgc-member";
      item.appendChild(portrait("lgc-avatar-lg"));
      var name = document.createElement("span");
      name.className = "lgc-member-name";
      item.appendChild(name);
      var online = document.createElement("span");
      online.className = "lgc-online";
      online.textContent = "Online";
      item.appendChild(online);
      item.appendChild(flagNode());
      membersEl.appendChild(item);
    }

    for (var r = 0; r < 3; r++) {
      var row = document.createElement("article");
      row.className = "lgc-row";
      row.appendChild(portrait("lgc-avatar-sm"));
      var body = document.createElement("div");
      var who = document.createElement("p");
      who.className = "lgc-who";
      var strong = document.createElement("strong");
      who.appendChild(strong);
      who.appendChild(flagNode());
      var online = document.createElement("span");
      online.className = "lgc-online";
      online.textContent = "Online";
      who.appendChild(online);
      var msg = document.createElement("p");
      msg.className = "lgc-msg";
      body.appendChild(who);
      body.appendChild(msg);
      row.appendChild(body);
      feed.appendChild(row);
    }

    var typingRow = document.createElement("article");
    typingRow.className = "lgc-row is-typing";
    typingRow.appendChild(portrait("lgc-avatar-sm"));
    var typingBody = document.createElement("div");
    var typingWho = document.createElement("p");
    typingWho.className = "lgc-who";
    var typingName = document.createElement("strong");
    typingWho.appendChild(typingName);
    typingWho.appendChild(flagNode());
    var typingOnline = document.createElement("span");
    typingOnline.className = "lgc-online";
    typingOnline.textContent = "Online";
    typingWho.appendChild(typingOnline);
    var typingMsg = document.createElement("p");
    typingMsg.className = "lgc-msg lgc-typing";
    typingMsg.innerHTML = "<i></i><i></i><i></i><span>typing</span>";
    typingBody.appendChild(typingWho);
    typingBody.appendChild(typingMsg);
    typingRow.appendChild(typingBody);
    feed.appendChild(typingRow);

    function iconNode(kind) {
      var wrap = document.createElement("span");
      wrap.className = "lgc-tick-icon lgc-tick-" + kind;
      wrap.innerHTML = tickerIcons[kind] || tickerIcons.join;
      return wrap;
    }

    function addTickerSet(hidden) {
      activities.forEach(function (item) {
        var tick = document.createElement("span");
        tick.className = "lgc-tick";
        if (hidden) tick.setAttribute("aria-hidden", "true");
        tick.appendChild(iconNode(item.kind));
        var flag = flagNode();
        setFlag(flag, item.country);
        tick.appendChild(flag);
        var label = document.createElement("span");
        label.className = "lgc-tick-text";
        label.textContent = item.text;
        tick.appendChild(label);
        tickerTrack.appendChild(tick);
      });
    }
    addTickerSet(false);
    addTickerSet(true);

    function paintMembers(animate) {
      var slots = membersEl.children;
      for (var i = 0; i < slots.length; i++) {
        var person = people[(peopleStart + i) % people.length];
        var slot = slots[i];
        var nameEl = slot.querySelector(".lgc-member-name");
        if (nameEl.textContent === person.name) continue;
        setPortrait(slot.querySelector(".lgc-avatar"), person);
        nameEl.textContent = person.name;
        setFlag(slot.querySelector(".lgc-flag"), person.country);
        if (animate) soften(slot);
      }
    }

    function paintMessages(animate) {
      var rows = feed.querySelectorAll(".lgc-row:not(.is-typing)");
      for (var i = 0; i < rows.length; i++) {
        var sample = messages[(messageStart + i) % messages.length];
        var row = rows[i];
        var strong = row.querySelector("strong");
        if (strong.textContent === sample.name && row.querySelector(".lgc-msg").textContent === sample.text) continue;
        setPortrait(row.querySelector(".lgc-avatar"), personByName(sample.name));
        strong.textContent = sample.name;
        setFlag(row.querySelector(".lgc-flag"), sample.country);
        row.querySelector(".lgc-msg").textContent = sample.text;
        if (animate) soften(row.querySelector(".lgc-msg"));
      }
    }

    function paintTyping(animate) {
      var shown = {};
      for (var i = 0; i < 3; i++) shown[messages[(messageStart + i) % messages.length].name] = true;
      var choices = [];
      for (var p = 0; p < people.length; p++) {
        if (!shown[people[p].name]) choices.push(people[p]);
      }
      if (!choices.length) choices = people;
      var person = choices[typingIndex % choices.length];
      var strong = typingRow.querySelector("strong");
      if (strong.textContent !== person.name) {
        setPortrait(typingRow.querySelector(".lgc-avatar"), person);
        strong.textContent = person.name;
        setFlag(typingRow.querySelector(".lgc-flag"), person.country);
        if (animate) soften(typingRow);
      }
    }

    function paintCount(animate) {
      var next = counts[countIndex] + "+";
      if (countEl.textContent === next) return;
      countEl.textContent = next;
      if (animate) soften(countEl);
    }

    function tick(animate) {
      paintMembers(animate);
      paintMessages(animate);
      paintTyping(animate);
      paintCount(animate);
    }

    tick(false);
    window.setInterval(function () {
      peopleStart = (peopleStart + 1) % people.length;
      messageStart = (messageStart + 1) % messages.length;
      typingIndex = (typingIndex + 1) % people.length;
      countIndex = (countIndex + 1) % counts.length;
      tick(true);
    }, 2000);
  }

  function initLiveActivity() {
    if (!window.ImoChatLive || !document.body) return;
    var box = document.createElement("div");
    box.className = "live-activity";
    box.hidden = true;
    box.setAttribute("data-live-activity", "");
    box.setAttribute("role", "status");
    box.setAttribute("aria-live", "polite");
    box.setAttribute("aria-atomic", "true");
    var flag = document.createElement("img");
    flag.className = "live-activity-flag";
    flag.alt = "";
    flag.width = 20;
    flag.height = 14;
    flag.hidden = true;
    var label = document.createElement("span");
    label.className = "live-activity-label";
    var text = document.createElement("span");
    text.className = "live-activity-text";
    box.appendChild(flag);
    box.appendChild(label);
    box.appendChild(text);
    document.body.appendChild(box);

    var queue = [];
    var lastId = "";
    var lastFlag = "";
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function nextNotice() {
      if (!queue.length) {
        queue = window.ImoChatLive.buildQueue(profile().region, Math.random);
        if (queue.length > 1 && (queue[0].id === lastId || queue[0].flag === lastFlag)) queue.push(queue.shift());
      }
      var item = queue.shift();
      lastId = item.id;
      lastFlag = item.flag;
      return item;
    }

    function paint(item) {
      item = item || nextNotice();
      label.textContent = item.label;
      text.textContent = item.text;
      if (item.flag) {
        var src = "/assets/flags/" + item.flag + ".svg";
        if (flag.getAttribute("src") !== src) flag.src = src;
        flag.hidden = false;
      } else {
        flag.hidden = true;
        flag.removeAttribute("src");
      }
      box.hidden = false;
      box.classList.remove("is-out");
      if (!reduce) {
        box.classList.remove("is-in");
        void box.offsetWidth;
        box.classList.add("is-in");
      }
    }

    function play() {
      if (!reduce && !box.hidden) {
        box.classList.remove("is-in");
        box.classList.add("is-out");
        window.setTimeout(paint, 280);
      } else {
        paint();
      }
    }

    paint();
    window.setInterval(play, 3000);
  }

  function initPreviewChat() {
    var trigger = document.querySelector("[data-preview-chat]");
    if (!trigger) return;

    var STORE = "imochat.liveChat";
    var FREE = 3;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var partners = [
      { id: "sarah", name: "Sarah", gender: "female", country: "KE", countryName: "Kenya", photo: "sarah" },
      { id: "amani", name: "Amani", gender: "male", country: "KE", countryName: "Kenya" },
      { id: "grace", name: "Grace", gender: "female", country: "UG", countryName: "Uganda", photo: "grace" },
      { id: "kato", name: "Kato", gender: "male", country: "UG", countryName: "Uganda" },
      { id: "neema", name: "Neema", gender: "female", country: "TZ", countryName: "Tanzania" },
      { id: "jabari", name: "Jabari", gender: "male", country: "TZ", countryName: "Tanzania" },
      { id: "chioma", name: "Chioma", gender: "female", country: "NG", countryName: "Nigeria" },
      { id: "tunde", name: "Tunde", gender: "male", country: "NG", countryName: "Nigeria" },
      { id: "ama", name: "Ama", gender: "female", country: "GH", countryName: "Ghana" },
      { id: "kwame", name: "Kwame", gender: "male", country: "GH", countryName: "Ghana" },
      { id: "mbala", name: "Mbala", gender: "female", country: "CM", countryName: "Cameroon" },
      { id: "etienne", name: "Etienne", gender: "male", country: "CM", countryName: "Cameroon" },
      { id: "mwansa", name: "Mwansa", gender: "female", country: "ZM", countryName: "Zambia" },
      { id: "chanda", name: "Chanda", gender: "male", country: "ZM", countryName: "Zambia" },
      { id: "james", name: "James", gender: "male", country: "GB", countryName: "United Kingdom", photo: "james" },
      { id: "olivia", name: "Olivia", gender: "female", country: "GB", countryName: "United Kingdom" },
      { id: "emily", name: "Emily", gender: "female", country: "US", countryName: "United States", photo: "emily" },
      { id: "noah", name: "Noah", gender: "male", country: "US", countryName: "United States" },
      { id: "daniel", name: "Daniel", gender: "male", country: "CA", countryName: "Canada", photo: "daniel" },
      { id: "sophia", name: "Sophia", gender: "female", country: "AU", countryName: "Australia", photo: "sophia" },
      { id: "anna", name: "Anna", gender: "female", country: "DE", countryName: "Germany", photo: "anna" },
      { id: "david", name: "David", gender: "male", country: "FR", countryName: "France", photo: "david" },
      { id: "emma", name: "Emma", gender: "female", country: "NL", countryName: "Netherlands", photo: "emma" },
      { id: "lars", name: "Lars", gender: "male", country: "SE", countryName: "Sweden", photo: "lars" },
      { id: "ingrid", name: "Ingrid", gender: "female", country: "NO", countryName: "Norway", photo: "ingrid" },
      { id: "marco", name: "Marco", gender: "male", country: "IT", countryName: "Italy", photo: "marco" }
    ];
    var hues = { KE: "#246247", UG: "#8a5a12", TZ: "#1d4f91", NG: "#1c2433", GH: "#b5523a", CM: "#62456f", ZM: "#246247", GB: "#1d4f91", US: "#1c2433", CA: "#b5523a", AU: "#246247", DE: "#62456f", FR: "#1d4f91", NL: "#b7791f", SE: "#1c2433", NO: "#1d4f91", IT: "#b5523a" };
    var swahili = [
      { keys: ["good morning"], phrase: "Habari za asubuhi", note: "Use it in the morning." },
      { keys: ["good afternoon"], phrase: "Habari za mchana", note: "That fits the afternoon." },
      { keys: ["good evening"], phrase: "Habari za jioni", note: "That is the evening greeting." },
      { keys: ["good night"], phrase: "Usiku mwema", note: "Say it when the day is ending." },
      { keys: ["how are you", "how are you doing", "how do you do"], phrase: "Habari yako?", note: "A simple reply is Nzuri." },
      { keys: ["thank you very much"], phrase: "Asante sana", note: "Sana means very much." },
      { keys: ["thank you", "thanks"], phrase: "Asante", note: "Asante means thank you." },
      { keys: ["goodbye", "bye", "see you"], phrase: "Kwaheri", note: "Tutaonana means see you later." },
      { keys: ["excuse me", "sorry"], phrase: "Samahani", note: "It works for excuse me or sorry." },
      { keys: ["please"], phrase: "Tafadhali", note: "Put it before a request." },
      { keys: ["my name", "your name"], phrase: "Jina langu ni…", note: "Ask someone with Jina lako nani?" },
      { keys: ["where are you from", "what country"], phrase: "Unatoka wapi?", note: "That asks where someone is from." },
      { keys: ["friend"], phrase: "Rafiki", note: "Rafiki yangu means my friend." },
      { keys: ["welcome"], phrase: "Karibu", note: "Karibu also means you are welcome." },
      { keys: ["water"], phrase: "Maji", note: "Maji is water." },
      { keys: ["food"], phrase: "Chakula", note: "Chakula is food." },
      { keys: ["teacher"], phrase: "Mwalimu", note: "Mwalimu means teacher." },
      { keys: ["student"], phrase: "Mwanafunzi", note: "Mwanafunzi means student." },
      { keys: ["today"], phrase: "Leo", note: "Leo means today." },
      { keys: ["tomorrow"], phrase: "Kesho", note: "Kesho means tomorrow." },
      { keys: ["yes"], phrase: "Ndiyo", note: "Ndiyo means yes." },
      { keys: ["no"], phrase: "Hapana", note: "Hapana means no." },
      { keys: ["fine", "i am fine", "i'm fine"], phrase: "Nzuri", note: "Nzuri means fine or good." },
      { keys: ["hello", "hi", "hey"], phrase: "Habari", note: "Habari is a friendly hello." }
    ];
    var luganda = [
      { keys: ["good morning"], phrase: "Wasuze otya?", note: "It is the usual morning greeting." },
      { keys: ["good afternoon", "good evening"], phrase: "Osiibye otya?", note: "People use it later in the day." },
      { keys: ["good night"], phrase: "Sula bulungi", note: "Say it when someone is going to sleep." },
      { keys: ["thank you very much"], phrase: "Weebale nnyo", note: "Nnyo strengthens the thanks." },
      { keys: ["thank you", "thanks"], phrase: "Weebale", note: "Weebale means thank you." },
      { keys: ["goodbye", "bye"], phrase: "Weraba", note: "Weraba is goodbye." },
      { keys: ["see you"], phrase: "Tunaalabagana", note: "It means we shall see each other." },
      { keys: ["please"], phrase: "Mwattu", note: "Use it with a polite request." },
      { keys: ["sorry", "excuse me"], phrase: "Nsonyiwa", note: "Nsonyiwa is a way to say sorry." },
      { keys: ["friend"], phrase: "Mukwano", note: "Mukwano means friend." },
      { keys: ["water"], phrase: "Amazzi", note: "Amazzi means water." },
      { keys: ["food"], phrase: "Emmere", note: "Emmere means food." },
      { keys: ["yes"], phrase: "Yee", note: "Yee means yes." },
      { keys: ["no"], phrase: "Nedda", note: "Nedda means no." },
      { keys: ["my name"], phrase: "Erinnya lyange nze…", note: "Then say your name." },
      { keys: ["your name"], phrase: "Erinnya lyo ggwe ani?", note: "That asks for someone's name." },
      { keys: ["welcome"], phrase: "Tukusanyukidde", note: "It welcomes someone warmly." },
      { keys: ["fine", "i am fine", "i'm fine"], phrase: "Bulungi", note: "Bulungi means fine or well." },
      { keys: ["how are you", "how are you doing", "hello", "hi", "hey"], phrase: "Oli otya?", note: "It is both hello and how are you." }
    ];

    var session = null;
    var typing = false;
    var replyQueue = [];
    var waitTimer = 0;
    var lastFocus = null;

    var overlay = document.createElement("div");
    overlay.className = "pc-overlay";
    overlay.hidden = true;
    var sheet = document.createElement("section");
    sheet.className = "pc-sheet";
    sheet.setAttribute("role", "dialog");
    sheet.setAttribute("aria-modal", "true");
    sheet.setAttribute("aria-labelledby", "pc-title");
    sheet.innerHTML = '<header class="pc-head"><button class="pc-close" type="button">Close</button><div class="pc-who"><div class="pc-avatar-slot"></div><div><h2 id="pc-title"></h2><p class="pc-meta"></p></div></div><p class="pc-count" aria-live="polite"></p></header><div class="pc-log" role="log" aria-live="polite"></div><form class="pc-form"><label class="pc-sr" for="pc-input">Message</label><input id="pc-input" maxlength="400" autocomplete="off" placeholder="Type a message"><button class="pc-send" type="submit">Send</button></form>';
    overlay.appendChild(sheet);

    var gate = document.createElement("div");
    gate.className = "pc-gate";
    gate.hidden = true;
    var gateCard = document.createElement("div");
    gateCard.className = "pc-gate-card";
    gateCard.setAttribute("role", "dialog");
    gateCard.setAttribute("aria-modal", "true");
    gateCard.setAttribute("aria-labelledby", "pc-gate-title");
    gateCard.innerHTML = '<h2 id="pc-gate-title">Enjoying your conversation? 😊</h2><p class="pc-gate-lead">You\'ve used your 3 free messages!</p><p>Create your free account to continue chatting with people worldwide, connect with new friends and access earning opportunities.</p><ul class="list"><li>Continue unlimited chatting according to your account access.</li><li>Connect with people around the world.</li><li>Teach foreigners Swahili or Luganda.</li><li>Access available earning opportunities.</li><li>Create an account to access eligible payment and withdrawal features.</li></ul><div class="pc-gate-actions"><a class="btn btn-gold" href="' + REG + '" target="_blank" rel="noopener noreferrer">Create an Account</a><button class="btn btn-ghost" type="button" data-pc-later>Maybe Later</button></div>';
    gate.appendChild(gateCard);
    document.body.appendChild(overlay);
    document.body.appendChild(gate);

    var titleEl = sheet.querySelector("#pc-title");
    var metaEl = sheet.querySelector(".pc-meta");
    var countEl = sheet.querySelector(".pc-count");
    var avatarSlot = sheet.querySelector(".pc-avatar-slot");
    var logEl = sheet.querySelector(".pc-log");
    var form = sheet.querySelector(".pc-form");
    var input = sheet.querySelector("#pc-input");
    var laterBtn = gate.querySelector("[data-pc-later]");
    var accountLink = gate.querySelector("a");

    function partnerById(id) {
      for (var i = 0; i < partners.length; i++) {
        if (partners[i].id === id) return partners[i];
      }
      return null;
    }

    function pick(list, salt) {
      var n = 0;
      var s = String(salt || "");
      for (var i = 0; i < s.length; i++) n = (n + s.charCodeAt(i) * (i + 3)) % 997;
      return list[n % list.length];
    }

    function save(data) {
      write(STORE, data);
    }

    function loadOrCreate() {
      var saved = read(STORE, null);
      var partner = saved && partnerById(saved.partnerId);
      var topicOk = saved && (saved.topic === "swahili" || saved.topic === "luganda" || saved.topic === "english");
      if (partner && topicOk && Array.isArray(saved.messages)) {
        saved.sent = Math.max(0, Math.min(FREE, Number(saved.sent) || 0));
        return saved;
      }
      var kept = saved && isFinite(Number(saved.sent)) ? Math.max(0, Math.min(FREE, Number(saved.sent))) : 0;
      var topics = ["swahili", "luganda", "english"];
      var created = {
        sent: kept,
        partnerId: partners[Math.floor(Math.random() * partners.length)].id,
        topic: topics[Math.floor(Math.random() * topics.length)],
        messages: []
      };
      save(created);
      return created;
    }

    function counterText(sent) {
      var left = FREE - sent;
      if (left === 1) return "1 free message remaining";
      return left + " free messages remaining";
    }

    function letterNode(partner) {
      var span = document.createElement("span");
      span.className = "lgc-letter";
      span.style.background = hues[partner.country] || "#1c2433";
      span.textContent = partner.name.charAt(0);
      return span;
    }

    function paintPartner(partner) {
      titleEl.textContent = partner.name;
      metaEl.innerHTML = "";
      var flag = document.createElement("img");
      flag.className = "lgc-flag";
      flag.alt = "";
      flag.width = 18;
      flag.height = 12;
      flag.src = "/assets/flags/" + partner.country.toLowerCase() + ".svg";
      metaEl.appendChild(flag);
      var place = document.createElement("span");
      place.textContent = partner.countryName;
      metaEl.appendChild(place);
      var online = document.createElement("span");
      online.className = "lgc-online";
      online.textContent = "Online";
      metaEl.appendChild(online);
      avatarSlot.innerHTML = "";
      var box = document.createElement("div");
      box.className = "lgc-avatar lgc-avatar-sm";
      if (partner.photo) {
        var img = document.createElement("img");
        img.alt = "";
        img.width = 42;
        img.height = 42;
        img.src = "/assets/promo/" + partner.photo + ".jpg";
        img.addEventListener("error", function () {
          img.remove();
          box.appendChild(letterNode(partner));
        });
        box.appendChild(img);
      } else {
        box.appendChild(letterNode(partner));
      }
      var presence = document.createElement("span");
      presence.className = "lgc-presence";
      presence.setAttribute("aria-hidden", "true");
      box.appendChild(presence);
      avatarSlot.appendChild(box);
      countEl.textContent = counterText(session.sent);
    }

    function render() {
      var partner = partnerById(session.partnerId);
      paintPartner(partner);
      logEl.innerHTML = "";
      session.messages.forEach(function (item) {
        var row = document.createElement("div");
        row.className = "pc-row " + (item.from === "you" ? "is-you" : "is-them");
        if (item.from !== "you") {
          var who = document.createElement("span");
          who.className = "pc-name";
          who.textContent = partner.name;
          row.appendChild(who);
        }
        var bubble = document.createElement("p");
        bubble.className = "pc-bubble " + (item.from === "you" ? "you" : "them");
        bubble.textContent = item.text;
        row.appendChild(bubble);
        logEl.appendChild(row);
      });
      if (typing) {
        var wait = document.createElement("div");
        wait.className = "pc-row is-them";
        var bubble = document.createElement("p");
        bubble.className = "pc-bubble them lgc-typing";
        bubble.innerHTML = "<i></i><i></i><i></i><span>typing...</span>";
        wait.appendChild(bubble);
        logEl.appendChild(wait);
      }
      logEl.scrollTop = logEl.scrollHeight;
    }

    function findPhrase(table, say) {
      var q = " " + String(say || "").toLowerCase().replace(/[^a-z'\s]/g, " ").replace(/\s+/g, " ").trim() + " ";
      var best = null;
      var bestLen = 0;
      for (var i = 0; i < table.length; i++) {
        for (var k = 0; k < table[i].keys.length; k++) {
          var key = table[i].keys[k];
          if (q.indexOf(" " + key + " ") !== -1 && key.length > bestLen) {
            best = table[i];
            bestLen = key.length;
          }
        }
      }
      return best;
    }

    function spoken(phrase) {
      return /[.?!]$/.test(phrase) ? phrase : phrase + ".";
    }

    function placeName(partner) {
      var name = partner.countryName;
      if (name === "Netherlands" || name.indexOf("United ") === 0) return "the " + name;
      return name;
    }

    function extractSay(lower) {
      var match = lower.match(/(?:how (?:do|can) (?:i|you|we) say|how to say|what(?:'s| is) (?:the )?(?:word|swahili|luganda) for)\s+["']?(.+?)["']?\s*$/);
      if (!match) return "";
      return match[1].replace(/[?.!"']+$/g, "").replace(/^(a |the |please )/, "").trim();
    }

    function opening(data, partner) {
      if (data.topic === "swahili") {
        return pick([
          "Hello! Can you teach me Swahili?",
          "Hi, I am " + partner.name + " from " + placeName(partner) + ". I would love to learn some Swahili.",
          "Habari! I am trying to learn Swahili. Can you help me?"
        ], partner.id + "sw");
      }
      if (data.topic === "luganda") {
        return pick([
          "Hi! Can you teach me Luganda?",
          "Hello, I am " + partner.name + " from " + placeName(partner) + ". I want to learn a little Luganda.",
          "Can you teach me how to say hello in Luganda?"
        ], partner.id + "lg");
      }
      return pick([
        "Hello! How are you today?",
        "Hi, I am " + partner.name + " from " + placeName(partner) + ". How is your day going?",
        "Hello from " + placeName(partner) + ". What shall we talk about?"
      ], partner.id + "en");
    }

    function taughtPhrase(table, raw) {
      var q = raw.toLowerCase();
      var best = null;
      var bestLen = 0;
      for (var i = 0; i < table.length; i++) {
        var phrase = table[i].phrase.toLowerCase().replace(/[?.!]/g, "").trim();
        if (phrase.length > 2 && q.indexOf(phrase) !== -1 && phrase.length > bestLen) {
          best = table[i];
          bestLen = phrase.length;
        }
      }
      return best;
    }

    function learnerAsk(lang, salt) {
      var word = pick(["good morning", "hello", "thank you", "how are you", "goodbye"], salt);
      return pick([
        "How do I say " + word + " in " + lang + "?",
        "Can you teach me how to say " + word + "?",
        "What is " + word + " in " + lang + "?"
      ], salt + word);
    }

    function learnerReply(data, partner, norm, raw) {
      var table = data.topic === "luganda" ? luganda : swahili;
      var lang = data.topic === "luganda" ? "Luganda" : "Swahili";
      var say = extractSay(raw.toLowerCase());
      if (say) {
        var asked = findPhrase(table, say);
        if (asked) return "I am learning that too. Is it \"" + spoken(asked.phrase) + "\"?";
        return "I do not know that one yet. Could you teach me how to say " + say + "?";
      }
      var taught = taughtPhrase(table, raw);
      if (taught) {
        var line = spoken(taught.phrase);
        return pick([
          "Thank you! So I say \"" + line + "\"",
          "Let me try. \"" + line + "\" Did I get it right?",
          "I'll remember that. \"" + line + "\""
        ], raw + partner.id);
      }
      if (/\bhow are you\b|\bhow's your day\b|\bhow is your day\b/.test(norm)) {
        return pick([
          "I'm doing great, thank you! " + learnerAsk(lang, norm),
          "I'm well, thank you. " + learnerAsk(lang, partner.id)
        ], norm + partner.id);
      }
      if (/what country|where are you|which country|chatting from|where do you live|where you from|you chatting/.test(norm)) {
        return "I'm from " + placeName(partner) + ". " + learnerAsk(lang, partner.country);
      }
      if (/your name|who are you/.test(norm)) {
        return "I'm " + partner.name + ", from " + placeName(partner) + ". " + learnerAsk(lang, partner.id);
      }
      if (/^(hi|hello|hey|habari|good morning|good afternoon|good evening)\b/.test(norm) || /\b(of course|sure|yes|i can|happy to|teach you)\b/.test(norm)) {
        return pick([
          "Thank you! " + learnerAsk(lang, norm + partner.id),
          "That is kind of you. " + learnerAsk(lang, partner.id + "b"),
          "Wonderful. " + learnerAsk(lang, raw)
        ], norm + partner.id);
      }
      if (/\bthank/.test(norm)) {
        return "You are welcome. " + learnerAsk(lang, norm);
      }
      if (/\bbye\b|\bgoodbye\b/.test(norm)) {
        return pick([
          "Goodbye for now. It was nice learning with you.",
          "Take care. Thank you for helping me practise.",
          "Bye for now. I hope we can keep learning together."
        ], norm);
      }
      return pick([
        "Thanks for that. " + learnerAsk(lang, raw),
        "I am still learning " + lang + ". " + learnerAsk(lang, partner.id + raw),
        "That helps me. " + learnerAsk(lang, norm + lang)
      ], raw + partner.id);
    }

    function socialReply(partner, norm, raw) {
      if (/\bhow are you\b|\bhow're you\b|\bhow r you\b|\bhow's your day\b|\bhow is your day\b/.test(norm)) {
        return pick([
          "I'm doing great, thank you! How about you?",
          "I'm well, thank you. How about you?",
          "Doing well today. How are you?"
        ], norm + partner.id);
      }
      if (/what country|where are you|which country|chatting from|where do you live|where you from|you chatting/.test(norm)) {
        return pick([
          "I'm from " + placeName(partner) + ".",
          "I'm chatting from " + placeName(partner) + ".",
          "I am in " + placeName(partner) + ". Where are you chatting from?"
        ], partner.country + norm);
      }
      if (/your name|who are you/.test(norm)) {
        return "I'm " + partner.name + ", from " + placeName(partner) + ".";
      }
      if (/^(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(norm)) {
        return pick([
          "Hello! How are you today?",
          "Hi! It is nice to meet you. How are you?",
          "Hello from " + placeName(partner) + ". How is your day?"
        ], partner.id + norm);
      }
      if (/\bfootball\b|\bsoccer\b|\bmatch\b/.test(norm)) {
        return pick([
          "I enjoy football too. Which team do you follow?",
          "Football is a fun topic. I watch it from " + placeName(partner) + ".",
          "I like a good match. Do you play, or mostly watch?"
        ], norm);
      }
      if (/\bmusic\b|\bsong\b/.test(norm)) {
        return pick([
          "Music is a good way to learn words. What do you like listening to?",
          "I listen to a mix of local and international songs. What about you?",
          "A song can teach a phrase quickly. Do you have a favourite?"
        ], norm);
      }
      if (/\bfood\b|\beat\b|\bcook\b|\bmeal\b/.test(norm)) {
        return pick([
          "Food is my favourite topic. What do you like to eat?",
          "In " + placeName(partner) + ", meals are a big part of the day. What do you cook?",
          "I am always happy to talk about food. What did you eat today?"
        ], norm);
      }
      if (/\bstudy\b|\bschool\b|\blearn\b|\bpractis|\bpractice\b/.test(norm)) {
        return pick([
          "Studying a little every day helps. What are you practising?",
          "I like short practice sessions. What are you learning at the moment?",
          "We can keep this useful. What do you want to practise?"
        ], norm);
      }
      if (/\bweather\b|\brain\b|\bsunny\b|\bsun\b/.test(norm)) {
        return pick([
          "The weather changes the mood of the day. What is it like where you are?",
          "I hope the weather is kind where you are. It varies in " + placeName(partner) + ".",
          "Is it warm where you are today?"
        ], norm);
      }
      if (/\btravel\b|\bvisit\b|\btrip\b/.test(norm)) {
        return pick([
          "Travel makes these chats more fun. Where would you like to go?",
          "I would like to hear about a place you recommend.",
          "From " + placeName(partner) + ", I enjoy hearing about other places. Where are you?"
        ], norm);
      }
      if (/\bthank/.test(norm)) {
        return pick([
          "You are welcome.",
          "Happy to help. What else would you like to ask?",
          "Anytime. Shall we keep going?"
        ], norm);
      }
      if (/\bbye\b|\bgoodbye\b/.test(norm)) {
        return pick([
          "Goodbye for now. It was nice chatting.",
          "Take care. I enjoyed talking with you.",
          "Bye for now. I hope we can chat again."
        ], norm);
      }
      if (norm) {
        var bit = raw.replace(/\s+/g, " ").trim();
        if (bit.length > 90) bit = bit.slice(0, 87) + "...";
        return pick([
          "I like that. You said \"" + bit + ".\" Tell me a little more.",
          "Thanks for sharing. I am " + partner.name + " in " + placeName(partner) + ". What else is new with you?",
          "That makes sense. How does that feel where you are today?"
        ], bit);
      }
      return null;
    }

    function compose(data, raw) {
      var partner = partnerById(data.partnerId);
      var norm = raw.toLowerCase().replace(/[!?.,]/g, " ").replace(/\s+/g, " ").trim();
      if (data.topic === "swahili" || data.topic === "luganda") return learnerReply(data, partner, norm, raw);
      return socialReply(partner, norm, raw);
    }

    function delayFor(text) {
      if (reduce) return 0;
      return Math.max(700, Math.min(1400, 600 + String(text || "").length * 12));
    }

    function showGate() {
      gate.hidden = false;
      accountLink.focus();
    }

    function hideGate() {
      gate.hidden = true;
      input.focus();
    }

    function enqueuePartner(text, raw) {
      replyQueue.push({ text: text, raw: raw });
      drain();
    }

    function drain() {
      if (waitTimer || !replyQueue.length) return;
      var job = replyQueue.shift();
      typing = true;
      render();
      waitTimer = window.setTimeout(function () {
        waitTimer = 0;
        typing = false;
        session.messages.push({ from: "partner", text: job.text || compose(session, job.raw) });
        save(session);
        render();
        drain();
      }, job.text ? (reduce ? 0 : 800) : delayFor(job.raw));
    }

    function queueReply(raw) {
      enqueuePartner("", raw);
    }

    function greet() {
      if (session.messages.length || replyQueue.length || waitTimer) return;
      enqueuePartner(opening(session, partnerById(session.partnerId)), "");
    }

    function openChat() {
      session = loadOrCreate();
      overlay.hidden = false;
      document.body.classList.add("pc-open");
      render();
      greet();
      input.focus();
    }

    function closeChat() {
      hideGate();
      overlay.hidden = true;
      document.body.classList.remove("pc-open");
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    function beginPreview(event) {
      if (event) event.preventDefault();
      lastFocus = trigger;
      openChat();
    }
    trigger.addEventListener("click", beginPreview);

    sheet.querySelector(".pc-close").addEventListener("click", closeChat);
    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) closeChat();
    });
    laterBtn.addEventListener("click", hideGate);
    gate.addEventListener("click", function (event) {
      if (event.target === gate) hideGate();
    });
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var text = input.value.replace(/\s+/g, " ").trim();
      if (!text) return;
      if (session.sent >= FREE) {
        showGate();
        return;
      }
      session.sent += 1;
      session.messages.push({ from: "you", text: text.slice(0, 400) });
      save(session);
      input.value = "";
      render();
      queueReply(text);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") return;
      if (!gate.hidden) {
        hideGate();
        return;
      }
      if (!overlay.hidden) closeChat();
    });
  }

})();
