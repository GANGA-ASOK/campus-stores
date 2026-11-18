(() => {
  const storageKey = "campus-stores.shift.v1";
  const root = document.getElementById("campus-stores");
  const q = (selector) => root.querySelector(selector);
  const requests = [
    {
      id: "RQ-214",
      club: "Film Society",
      event: "Courtyard screening",
      owner: "Isha Rao",
      due: "Fri 8 pm",
      items: ["HDMI projector", "Portable speaker", "USB-C → HDMI adapter"],
      note: "Playback is from a USB-C-only laptop. The host will collect at 4 pm.",
    },
    {
      id: "RQ-209",
      club: "Debate Union",
      event: "Finals rehearsal",
      owner: "Tara Shah",
      due: "Sat 10 am",
      items: ["Wireless microphone"],
      note: "Rehearsal runs into the evening.",
    },
    {
      id: "RQ-217",
      club: "Photo Circle",
      event: "Street portrait walk",
      owner: "Dev Menon",
      due: "Sat noon",
      items: ["Digital camera"],
      note: "Collection on Saturday morning.",
    },
  ];
  const assets = [
    { id: "PR-04", type: "HDMI projector", model: "BenQ MH550", bin: "A2" },
    {
      id: "PR-06",
      type: "HDMI projector",
      model: "Epson EB-X49",
      bin: "Workshop",
      repair: true,
    },
    { id: "SP-02", type: "Portable speaker", model: "JBL Eon One", bin: "B1" },
    { id: "SP-05", type: "Portable speaker", model: "Bose S1", bin: "B2" },
    {
      id: "AD-12",
      type: "USB-C → HDMI adapter",
      model: "Belkin AVC002",
      bin: "C4",
    },
    {
      id: "AD-15",
      type: "USB-C → HDMI adapter",
      model: "Anker A8312",
      bin: "C4",
    },
    { id: "MI-09", type: "Wireless microphone", model: "Shure BLX", bin: "B3" },
    { id: "CA-03", type: "Digital camera", model: "Sony A6400", bin: "D2" },
  ];
  const people = [
    "Isha Rao",
    "Kabir Sen",
    "Leela Das",
    "Tara Shah",
    "Dev Menon",
  ];
  const shifts = [
    {
      time: "Friday · 3:45 pm",
      title: "Pickup at the counter",
      text: "Kabir is here for the Film Society screening. The film starts at four. Can he leave with everything he needs?",
      next: "Move to return time",
    },
    {
      time: "Friday · 7:30 pm",
      title: "The kit comes back in pieces",
      text: "Kabir has brought back the projector and speaker. “Leela still has the adapter. She’ll drop it off tomorrow at nine.” Take the return and hand over to the morning shift.",
      next: "Move to next morning",
    },
    {
      time: "Saturday · 9:00 am",
      title: "Morning shift",
      text: "You’ve just taken over. Leela walks in with an adapter. Work out what was outstanding from the screening and close the loan for the right item.",
    },
  ];
  // Hours since Friday midnight, so shift times and due times can be compared.
  const phaseAt = [15.75, 19.5, 33];
  const dueAt = {
    "Fri 8 pm": 20,
    "Sat 9 am": 33,
    "Sat 10 am": 34,
    "Sat noon": 36,
  };
  const dueList = Object.keys(dueAt);
  const pages = [
    ["Requests", "clipboard-list"],
    ["Inventory", "package"],
    ["Loan register", "book-open"],
    ["Desk book", "messages-square"],
  ];
  const original = () => ({
    version: 2,
    tab: "Requests",
    phase: 0,
    selected: "",
    mode: "",
    filter: "All items",
    loans: [
      {
        num: 401,
        req: "RQ-209",
        asset: "MI-09",
        who: "Tara Shah",
        holder: "Tara Shah",
        due: "Sat 10 am",
        back: false,
        log: [
          {
            at: "Friday · 3:30 pm",
            t: 15.5,
            kind: "issued",
            text: "Issued to Tara Shah. Due Sat 10 am.",
          },
        ],
      },
    ],
    notes: [],
    editing: false,
    onlyOpen: true,
    lookup: "",
    undo: null,
    notice: "Sample shift · All records are fictional.",
  });
  let s = original();
  const getAsset = (id) => assets.find((x) => x.id === id);
  const getReq = (id) => requests.find((x) => x.id === id);
  const out = (id) => s.loans.find((l) => l.asset === id && !l.back);
  const now = () => phaseAt[s.phase];
  const stamp = () => ({ at: shifts[s.phase].time, t: now() });
  const overdue = (l) => !l.back && now() > dueAt[l.due];
  const lateExpected = (l) =>
    !l.back && !overdue(l) && l.expected && dueAt[l.expected] > dueAt[l.due];
  const reqLoans = (id) => s.loans.filter((l) => l.req === id);
  const kit = (r) =>
    r.items.map((type) => {
      const ls = reqLoans(r.id).filter(
        (l) => getAsset(l.asset).type === type,
      );
      return { type, loan: ls.find((l) => !l.back) || ls[ls.length - 1] };
    });
  const esc = (x) =>
    String(x).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const opts = (list, value = "") =>
    list
      .map(
        ([v, t]) =>
          '<option value="' +
          esc(v) +
          '"' +
          (v === value ? " selected" : "") +
          ">" +
          esc(t) +
          "</option>",
      )
      .join("");
  const field = (label, key, options, value = "", blank = "Select…") =>
    "<label><span>" +
    esc(label) +
    '</span><select name="' +
    key +
    '"><option value="">' +
    esc(blank) +
    "</option>" +
    opts(options, value) +
    "</select></label>";
  const btn = (label, act, val = "", style = "") =>
    '<button type="button" data-action="' +
    act +
    '" data-val="' +
    esc(val) +
    '" class="' +
    style +
    '">' +
    esc(label) +
    "</button>";
  const head = (title, sub, control = "") =>
    '<div class="sectionhead"><div><h2>' +
    title +
    "</h2><small>" +
    sub +
    "</small></div>" +
    control +
    "</div>";
  const row = (label, sub, right) =>
    '<div class="row"><div><strong>' +
    esc(label) +
    "</strong><small>" +
    esc(sub) +
    "</small></div><div>" +
    right +
    "</div></div>";
  const badge = (t, style = "") =>
    '<span class="tag ' + style + '">' + esc(t) + "</span>";
  const loanTags = (l) =>
    l.back
      ? badge("Returned", "good")
      : (overdue(l) ? badge("Overdue", "warn") : badge("Out")) +
        (lateExpected(l) ? " " + badge("Back after due", "warn") : "");
  const whereabouts = (l) =>
    l.back
      ? "Returned " +
        (l.returnedAt || "") +
        (l.returnedBy ? " by " + l.returnedBy : "")
      : "With " +
        l.holder +
        " · due " +
        l.due +
        (l.expected ? " · expected " + l.expected : "");
  const people_ = people.map((p) => [p, p]);
  const dues_ = dueList.map((d) => [d, d]);

  function issue(req, asset, who, due) {
    const num = Math.max(...s.loans.map((l) => l.num)) + 1;
    s.loans.push({
      num,
      req,
      asset,
      who,
      holder: who,
      due,
      back: false,
      log: [
        {
          ...stamp(),
          kind: "issued",
          text: "Issued to " + who + ". Due " + due + ".",
        },
      ],
    });
    return num;
  }

  function kitSummary(r) {
    const k = kit(r);
    const issued = k.filter((x) => x.loan).length;
    const back = k.filter((x) => x.loan && x.loan.back).length;
    const late = k.filter((x) => x.loan && overdue(x.loan)).length;
    if (!issued) return "Not issued";
    if (back === k.length) return "All returned";
    return (
      issued -
      back +
      " of " +
      k.length +
      " out" +
      (back ? ", " + back + " back" : "") +
      (issued < k.length ? ", " + (k.length - issued) + " not issued" : "") +
      (late ? " · " + late + " overdue" : "")
    );
  }

  function requestPage() {
    let html = head(
      "Approved requests",
      "Student Activities Office · 3 approved forms",
    );
    if (!s.selected)
      return (
        html +
        requests
          .map((r) =>
            row(
              r.event,
              r.id + " · " + r.club + " · " + kitSummary(r),
              btn("View kit", "request", r.id),
            ),
          )
          .join("")
      );
    const r = getReq(s.selected);
    const k = kit(r);
    html +=
      btn("Back to list", "close") +
      '<div class="record"><small>' +
      esc(r.id) +
      " · Approved</small><h3>" +
      esc(r.event) +
      "</h3><p>" +
      esc(r.club) +
      " · Filed by " +
      esc(r.owner) +
      "</p><p><b>Return by</b> " +
      esc(r.due) +
      "</p><p>" +
      esc(r.note) +
      '</p></div><h3 class="kithead">Kit · ' +
      esc(kitSummary(r)) +
      "</h3>";
    for (const x of k) {
      const a = x.loan && getAsset(x.loan.asset);
      html += row(
        x.type,
        x.loan
          ? a.id +
              " · " +
              a.model +
              " · slip L-" +
              x.loan.num +
              " · " +
              whereabouts(x.loan)
          : "Not issued",
        x.loan ? loanTags(x.loan) : badge("Not issued"),
      );
    }
    const open = k.some((x) => x.loan && !x.loan.back);
    const pending = k.some((x) => !x.loan);
    if (!s.mode)
      html +=
        '<div class="buttons">' +
        (pending ? btn("Issue kit", "mode", "issue", "primary") : "") +
        (open
          ? btn("Record return", "mode", "return", pending ? "" : "primary")
          : "") +
        "</div>";
    if (s.mode === "issue" && pending) html += issueKitForm(r, k);
    if (s.mode === "return" && open) html += returnForm(r);
    return html;
  }

  function issueKitForm(r, k) {
    const pending = k.filter((x) => !x.loan);
    let html =
      '<form data-kit data-req="' +
      esc(r.id) +
      '" class="panel"><h3>Issue kit</h3><small>Each approved item gets its own slip. Pick the unit you are handing over.</small><div class="form">';
    pending.forEach((x, i) => {
      const units = assets.filter(
        (a) => a.type === x.type && !a.repair && !out(a.id),
      );
      html += field(
        x.type,
        "unit" + i,
        units.map((a) => [a.id, a.id + " · " + a.model + " · bin " + a.bin]),
        units[0] ? units[0].id : "",
        units.length ? "Leave for later" : "None on the shelf",
      );
    });
    html +=
      field("Collected by", "who", people_) +
      field("Return by", "due", dues_, r.due) +
      '</div><div class="buttons"><button type="submit" class="primary">Save issue slips</button>' +
      btn("Cancel", "mode", "") +
      "</div></form>";
    return html;
  }

  // The time the current holder took responsibility for the unit.
  const holderSince = (l) =>
    l.log.filter((e) => e.kind === "issued" || e.kind === "transfer").pop()
      .at;
  // "Portable speaker" reads as "portable speaker" mid-sentence; "HDMI projector" stays.
  const lower = (t) => (/^[A-Z][a-z]/.test(t) ? t[0].toLowerCase() + t.slice(1) : t);
  // Turns what staff type from a label ("ad12", "AD 12") into a unit ID.
  const unitId = (raw) => {
    const m = String(raw)
      .toUpperCase()
      .replace(/\s+/g, "")
      .match(/^([A-Z]{2})-?(\d{1,2})$/);
    return m ? m[1] + "-" + m[2].padStart(2, "0") : String(raw).trim();
  };

  function returnForm(r, only = null) {
    const open = reqLoans(r.id).filter(
      (l) => !l.back && (!only || l.num === only.num),
    );
    let html =
      '<form data-return data-req="' +
      esc(r.id) +
      '" data-via="' +
      (only ? "unit" : "slip") +
      '" class="panel">' +
      (only
        ? ""
        : "<h3>Record return</h3><small>Tick each unit that is on the counter, and check its label against the ID. For anything still out, record who has it now.</small>");
    for (const l of open) {
      const a = getAsset(l.asset);
      // Matched by unit ID: the unit is in hand, so there is nothing to tick.
      if (only) {
        html += '<input type="hidden" name="back" value="' + l.num + '" />';
        continue;
      }
      html +=
        '<fieldset class="unit"><label class="check"><input type="checkbox" name="back" value="' +
        l.num +
        '" /><span><strong>' +
        esc(a.id + " · " + a.type) +
        "</strong><small>" +
        esc(
          a.model +
            " · bin " +
            a.bin +
            " · slip L-" +
            l.num +
            " · " +
            whereabouts(l),
        ) +
        "</small></span>" +
        loanTags(l) +
        '</label><div class="form stillwith">' +
        field("Not on the counter: now with", "with-" + l.num, people_, l.holder) +
        field("Expected back", "exp-" + l.num, dues_, l.expected || "", "Not known") +
        "</div></fieldset>";
    }
    html +=
      '<div class="form">' +
      field("Returned by", "by", people_, only ? only.holder : "") +
      '</div><div class="buttons"><button type="submit" class="primary">Save return</button>' +
      (only ? btn("Clear", "clearlookup") : btn("Cancel", "mode", "")) +
      "</div></form>";
    return html;
  }

  // Typing "AD" lists every adapter with where it should be, units on loan first.
  function unitSuggestions() {
    const rank = (a) => (out(a.id) ? 0 : a.repair ? 2 : 1);
    return (
      '<datalist id="unit-ids">' +
      assets
        .slice()
        .sort((x, y) => rank(x) - rank(y) || x.id.localeCompare(y.id))
        .map((a) => {
          const l = out(a.id);
          const where = l
            ? "on loan to " +
              l.holder +
              " · L-" +
              l.num +
              (overdue(l) ? " · overdue" : "")
            : a.repair
              ? "in repair"
              : "on shelf in " + a.bin;
          return (
            '<option value="' +
            esc(a.id) +
            '" label="' +
            esc(a.type + " · " + a.model + " · " + where) +
            '"></option>'
          );
        })
        .join("") +
      "</datalist>"
    );
  }

  // Start a return from the unit in hand: type the ID printed on its label.
  function lookupPanel() {
    let html =
      '<form data-lookup class="lookup"><label><span>Unit on the counter</span><input name="unit" list="unit-ids" autocomplete="off" spellcheck="false" placeholder="ID on the label, e.g. AD-12" value="' +
      esc(s.lookup) +
      '" /></label><button type="submit" class="primary">Find slip</button>' +
      unitSuggestions() +
      "</form>";
    if (!s.lookup) return html;
    const id = s.lookup;
    const a = getAsset(id);
    const l = a && out(id);
    if (!a)
      return (
        html +
        '<p class="alert">No unit has the ID “' +
        esc(id) +
        "”. Read the label again; IDs look like AD-12.</p>"
      );
    if (!l) {
      const same = s.loans.filter(
        (x) => !x.back && getAsset(x.asset).type === a.type,
      );
      return (
        html +
        '<p class="alert"><b>' +
        esc(a.id + " isn’t on loan.") +
        "</b> " +
        esc(
          a.repair
            ? "It is booked into the " + a.bin + " for repair."
            : "It should be on the shelf in bin " + a.bin + ".",
        ) +
        " " +
        esc(
          same.length
            ? "The open " +
                lower(a.type) +
                " slip" +
                (same.length > 1 ? "s are " : " is ") +
                same
                  .map(
                    (x) =>
                      "L-" + x.num + " · " + x.asset + " (with " + x.holder + ")",
                  )
                  .join(", ") +
                ". Check whether this is the unit that was lent."
            : "No " + lower(a.type) + " is out on loan.",
        ) +
        "</p>"
      );
    }
    const r = getReq(l.req);
    return (
      html +
      '<div class="found"><small>Matched by unit ID</small><h3>' +
      esc(a.id + " · " + a.type + " · " + a.model) +
      "</h3><p>" +
      esc(
        "Slip L-" +
          l.num +
          " · " +
          r.id +
          " " +
          r.club +
          " · with " +
          l.holder +
          " since " +
          holderSince(l) +
          " · due " +
          l.due +
          (l.expected ? " · expected " + l.expected : ""),
      ) +
      " " +
      loanTags(l) +
      "</p>" +
      returnForm(r, l) +
      "</div>"
    );
  }

  function inventory() {
    let html = head(
      "Inventory",
      "Physical units · home shelf and current availability",
    );
    html +=
      '<div class="buttons"><label>Show <select data-filter>' +
      opts(
        ["All items", "On shelf", "On loan", "In repair"].map((f) => [f, f]),
      ) +
      "</select></label></div>";
    for (const a of assets) {
      const l = out(a.id);
      const status = a.repair ? "In repair" : l ? "On loan" : "On shelf";
      if (s.filter !== "All items" && s.filter !== status) continue;
      html += row(
        a.id + " · " + a.type,
        a.model + " · " + a.bin + (l ? " · with " + l.holder : ""),
        badge(status, status === "On shelf" ? "good" : "") +
          (l && overdue(l) ? " " + badge("Overdue", "warn") : ""),
      );
    }
    return html;
  }

  function slipRow(l) {
    const a = getAsset(l.asset);
    const r = getReq(l.req);
    return (
      '<div class="row slip"><div><strong>' +
      esc("L-" + l.num + " · " + a.id + " · " + a.type) +
      "</strong><small>" +
      esc(
        a.model +
          " · " +
          l.req +
          " " +
          r.club +
          " · collected by " +
          l.who +
          " · " +
          whereabouts(l),
      ) +
      '</small><details class="history"><summary>History</summary><ol>' +
      l.log
        .map(
          (e) =>
            "<li><small>" + esc(e.at) + "</small> " + esc(e.text) + "</li>",
        )
        .join("") +
      '</ol></details></div><div class="slipside">' +
      loanTags(l) +
      (l.back ? "" : btn("Record return", "returnfor", l.req)) +
      "</div></div>"
    );
  }

  function register() {
    const open = s.loans.filter((l) => !l.back);
    const late = open.filter(overdue).length;
    let html = head(
      "Loan register",
      "One slip per physical unit · " +
        open.length +
        " open" +
        (late ? " · " + late + " overdue" : ""),
      s.editing
        ? btn("Cancel", "cancel")
        : btn("New issue slip", "new", "", "primary"),
    );
    if (s.editing) {
      const available = assets.filter((a) => !a.repair && !out(a.id));
      return (
        html +
        '<form data-issue><div class="form">' +
        field(
          "Approved request",
          "req",
          requests.map((r) => [r.id, r.id + " · " + r.club]),
        ) +
        field(
          "Unit leaving the desk",
          "asset",
          available.map((a) => [a.id, a.id + " · " + a.type + " · " + a.model]),
        ) +
        field("Collected by", "who", people_) +
        field("Return by", "due", dues_) +
        '</div><button type="submit" class="primary">Save issue slip</button></form>'
      );
    }
    html +=
      lookupPanel() +
      '<div class="buttons">' +
      ["Outstanding", "All slips"]
        .map(
          (v, i) =>
            '<button type="button" data-action="scope" data-val="' +
            i +
            '" aria-pressed="' +
            (s.onlyOpen === (i === 0)) +
            '">' +
            v +
            "</button>",
        )
        .join("") +
      "</div>";
    const shown = s.loans
      .filter((l) => !s.onlyOpen || !l.back)
      .slice()
      .sort((x, y) => overdue(y) - overdue(x) || y.num - x.num);
    if (!shown.length) html += "<p>No outstanding slips.</p>";
    for (const l of shown) html += slipRow(l);
    return html;
  }

  function deskbook() {
    let html = head(
      "Desk book",
      "Messages from clubs and notes for the next shift",
    );
    const entries = [
      [
        15.33,
        "Friday · 3:20 pm",
        "Isha Rao · Film Society",
        "Kabir Sen is picking up our whole screening kit. Please issue it in his name. I’m setting up in the courtyard.",
      ],
      [
        15.5,
        "Friday · 3:30 pm",
        "Tara Shah · Debate Union",
        "Our microphone stays with me overnight. I’ll return it by 10 am Saturday.",
      ],
    ];
    if (s.phase >= 1)
      entries.push([
        19.5,
        "Friday · 7:30 pm",
        "Kabir Sen · Film Society",
        "I brought the projector and speaker. Leela Das has our adapter. She’ll be at the counter at 9 am tomorrow.",
      ]);
    for (const l of s.loans)
      for (const e of l.log)
        if (e.kind === "transfer")
          entries.push([
            e.t,
            e.at,
            "Loan register · slip L-" + l.num,
            e.text,
            "auto",
          ]);
    for (const n of s.notes)
      entries.push([
        phaseAt[n.phase],
        shifts[n.phase].time,
        "Counter handover",
        n.text,
      ]);
    const sorted = entries
      .map((e, i) => [e, i])
      .sort((a, b) => b[0][0] - a[0][0] || b[1] - a[1])
      .map(([e]) => e);
    for (const [, t, author, body, kind] of sorted)
      html +=
        '<article class="record' +
        (kind ? " " + kind : "") +
        '"><small>' +
        esc(t) +
        "</small><h3>" +
        esc(author) +
        "</h3><p>" +
        esc(body) +
        "</p></article>";
    return (
      html +
      '<form data-note><div class="form"><label class="full"><span>Note for the next shift</span><textarea name="note" rows="2" maxlength="400" required></textarea></label></div><button type="submit">Add handover note</button></form>'
    );
  }
  const screens = {
    Requests: requestPage,
    Inventory: inventory,
    "Loan register": register,
    "Desk book": deskbook,
  };
  function paint() {
    const phase = shifts[s.phase];
    q("[data-clock]").textContent = phase.time;
    q("[data-shift-title]").textContent = phase.title;
    q("[data-shift]").textContent = phase.text;
    const advance = q('[data-action="advance"]');
    advance.hidden = !phase.next;
    advance.textContent = phase.next || "";
    q("[data-nav]").innerHTML = pages
      .map(
        ([n, icon]) =>
          '<button type="button" data-action="tab" data-val="' +
          n +
          '" aria-pressed="' +
          (s.tab === n) +
          '"><svg aria-hidden="true" class="store-icon"><use href="#icon-' +
          icon +
          '"></use></svg>' +
          n +
          "</button>",
      )
      .join("");
    q("[data-page]").innerHTML = screens[s.tab]();
    if (q("[data-filter]")) q("[data-filter]").value = s.filter;
    q("[data-status]").textContent = s.notice;
    q('[data-action="undo"]').hidden = !s.undo;
  }
  function commit(msg) {
    if (msg) s.notice = msg;
    paint();
    try {
      localStorage.setItem(storageKey, JSON.stringify(s));
    } catch {
      q("[data-status]").textContent +=
        " Browser storage is unavailable. Progress lasts for this visit.";
    }
  }
  const say = (msg) => (q("[data-status]").textContent = msg);
  root.addEventListener("click", (e) => {
    const b = e.target.closest("[data-action]");
    if (!b) return;
    const v = b.dataset.val;
    switch (b.dataset.action) {
      case "restart":
        s = original();
        break;
      case "advance":
        if (s.phase < 2) s.phase++;
        s.mode = "";
        s.lookup = "";
        s.undo = null;
        s.notice = "Shift time updated.";
        break;
      case "tab":
        s.tab = v;
        s.editing = false;
        s.mode = "";
        s.lookup = "";
        break;
      case "clearlookup":
        s.lookup = "";
        break;
      case "close":
        s.selected = "";
        s.mode = "";
        break;
      case "request":
        s.selected = v;
        s.mode = "";
        break;
      case "mode":
        s.mode = v;
        break;
      case "returnfor":
        s.tab = "Requests";
        s.selected = v;
        s.mode = "return";
        break;
      case "new":
        s.editing = true;
        break;
      case "cancel":
        s.editing = false;
        break;
      case "scope":
        s.onlyOpen = v === "0";
        break;
      case "undo":
        if (!s.undo) return;
        try {
          s.loans = JSON.parse(s.undo);
        } catch {
          return;
        }
        s.undo = null;
        s.notice = "Return undone. The slips are open again.";
        break;
    }
    commit();
  });
  root.addEventListener("change", (e) => {
    if (e.target.matches("[data-filter]")) {
      s.filter = e.target.value;
      commit();
    }
    // A slip defaults to the return time on the approved request.
    if (e.target.matches('[data-issue] [name="req"]')) {
      const r = getReq(e.target.value);
      if (r) e.target.form.elements.due.value = r.due;
    }
  });
  // Picking a suggestion, or typing a full unit ID, opens its slip at once.
  root.addEventListener("input", (e) => {
    if (!e.target.matches('[data-lookup] [name="unit"]')) return;
    const id = unitId(e.target.value);
    if (getAsset(id) && id !== s.lookup) e.target.form.requestSubmit();
  });
  root.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;
    const form = new FormData(f);
    if (f.matches("[data-note]")) {
      const text = String(form.get("note")).trim();
      if (!text) return;
      s.notes.push({ phase: s.phase, text });
      commit("Handover note saved.");
      return;
    }
    if (f.matches("[data-lookup]")) {
      const raw = String(form.get("unit") || "").trim();
      if (!raw) return say("Type the ID printed on the unit’s label.");
      s.lookup = unitId(raw);
      const l = out(s.lookup);
      commit(
        l
          ? "Found slip L-" + l.num + " for " + s.lookup + "."
          : "No open slip for " + s.lookup + ".",
      );
      const by = q('[data-lookup] ~ .found [name="by"]');
      (by || q('[data-lookup] [name="unit"]')).focus();
      return;
    }
    if (f.matches("[data-kit]")) {
      const r = getReq(f.dataset.req);
      const who = form.get("who"),
        due = form.get("due");
      if (!r) return;
      if (!people.includes(who)) return say("Choose who is collecting.");
      if (!Object.hasOwn(dueAt, due)) return say("Choose a return time.");
      const picks = kit(r)
        .filter((x) => !x.loan)
        .map((x, i) => [x, getAsset(form.get("unit" + i))])
        .filter(([, a]) => a);
      if (!picks.length) return say("Choose at least one unit to issue.");
      if (picks.some(([x, a]) => a.type !== x.type || a.repair || out(a.id)))
        return say("One of those units is no longer available.");
      s.undo = null;
      const slips = picks.map(([, a]) => "L-" + issue(r.id, a.id, who, due));
      s.mode = "";
      commit(
        "Issued " +
          picks.map(([, a]) => a.id).join(", ") +
          " to " +
          who +
          " on slips " +
          slips.join(", ") +
          ". Due " +
          due +
          ".",
      );
      return;
    }
    if (f.matches("[data-return]")) {
      const r = getReq(f.dataset.req);
      if (!r) return;
      const open = reqLoans(r.id).filter((l) => !l.back);
      const ticked = form.getAll("back").map(Number);
      const by = form.get("by");
      if (ticked.length && !people.includes(by))
        return say("Choose who is returning the units.");
      const before = JSON.stringify(s.loans);
      const returned = [],
        moved = [];
      for (const l of open) {
        if (ticked.includes(l.num)) {
          l.back = true;
          l.returnedAt = shifts[s.phase].time;
          l.returnedBy = by;
          l.log.push({
            ...stamp(),
            kind: "returned",
            via: f.dataset.via,
            text:
              l.asset +
              " returned by " +
              by +
              (f.dataset.via === "unit" ? ", matched by unit ID" : "") +
              ". Slip L-" +
              l.num +
              " closed.",
          });
          returned.push(l.asset);
          continue;
        }
        const w = form.get("with-" + l.num),
          exp = form.get("exp-" + l.num) || "";
        if (!people.includes(w)) continue;
        if (w === l.holder && exp === (l.expected || "")) continue;
        const from = l.holder;
        l.holder = w;
        if (exp) l.expected = exp;
        else delete l.expected;
        const a = getAsset(l.asset);
        const text =
          l.asset +
          " (" +
          a.type +
          ", " +
          a.model +
          ") is with " +
          w +
          (w !== from ? ", not " + from : "") +
          (exp ? ". Expected back " + exp : "") +
          ". Due " +
          l.due +
          ".";
        l.log.push({ ...stamp(), kind: "transfer", text });
        moved.push(l.asset + " now with " + w + (exp ? ", expected " + exp : ""));
      }
      if (!returned.length && !moved.length)
        return say(
          "Nothing changed. Tick a unit on the counter or update who has it.",
        );
      s.undo = before;
      s.mode = "";
      s.lookup = "";
      commit(
        [
          returned.length
            ? "Returned " + returned.join(", ") + " to stock."
            : "",
          moved.length ? moved.join("; ") + "." : "",
        ]
          .filter(Boolean)
          .join(" "),
      );
      return;
    }
    if (!f.matches("[data-issue]")) return;
    const [req, asset, who, due] = ["req", "asset", "who", "due"].map((k) =>
      form.get(k),
    );
    const unit = getAsset(asset),
      r = getReq(req);
    if (
      !r ||
      !unit ||
      unit.repair ||
      out(asset) ||
      !people.includes(who) ||
      !Object.hasOwn(dueAt, due)
    )
      return say("Fill in every field to save the slip.");
    if (!r.items.includes(unit.type))
      return say(
        "This equipment type is outside the approved request. Choose an approved unit.",
      );
    if (
      s.loans.some(
        (l) => l.req === req && !l.back && getAsset(l.asset).type === unit.type,
      )
    )
      return say("The approved quantity of this equipment type is already on loan.");
    s.undo = null;
    const num = issue(req, asset, who, due);
    s.editing = false;
    commit("Issued " + asset + " to " + who + " on slip L-" + num + ".");
  });
  // Saved shifts from version 1 have no holder or history; carry them forward.
  function migrate(d) {
    if (!d || d.version !== 1 || !Array.isArray(d.loans)) return d;
    return {
      ...d,
      version: 2,
      mode: "",
      undo: null,
      loans: d.loans.map((l) => ({
        ...l,
        holder: l.who,
        log: [
          {
            at: "Earlier",
            t: 15,
            kind: "issued",
            text: "Issued to " + l.who + ". Due " + l.due + ".",
          },
        ].concat(
          l.back
            ? [{ at: "Earlier", t: 15, kind: "returned", text: l.asset + " returned." }]
            : [],
        ),
      })),
    };
  }
  function restore(d) {
    d = migrate(d);
    if (
      !d ||
      d.version !== 2 ||
      !Object.hasOwn(screens, d.tab) ||
      !shifts[d.phase] ||
      (d.selected && !getReq(d.selected)) ||
      !Array.isArray(d.notes) ||
      !d.notes.every(
        (n) => n && shifts[n.phase] && typeof n.text === "string",
      ) ||
      !Array.isArray(d.loans) ||
      !d.loans.length ||
      !d.loans.every(
        (l) =>
          l &&
          getReq(l.req) &&
          getAsset(l.asset) &&
          Number.isInteger(l.num) &&
          people.includes(l.holder) &&
          Object.hasOwn(dueAt, l.due) &&
          Array.isArray(l.log),
      ) ||
      (d.undo != null && typeof d.undo !== "string") ||
      (d.lookup != null && typeof d.lookup !== "string")
    )
      return;
    s = {
      ...original(),
      ...d,
      loans: d.loans.map((l) => ({ ...l, log: l.log.map((e) => ({ ...e })) })),
      notes: d.notes.map((n) => ({ ...n })),
    };
    paint();
  }
  paint();
  try {
    restore(JSON.parse(localStorage.getItem(storageKey)));
  } catch {
    // Keep the fresh shift when storage is unavailable or the saved data is invalid.
  }
})();
