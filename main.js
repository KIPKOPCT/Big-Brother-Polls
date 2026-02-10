const contestants = [
  { id: "ashay", label: "ASHAY" },
  { id: "bravo", label: "BRAVO B" },
  { id: "didi", label: "DIDI" },
  { id: "dube", label: "DUBE" },
  { id: "ilano", label: "ILANO" },
  { id: "wanda", label: "KING WANDA" },
  { id: "liema", label: "LIEMA" },
  { id: "neliswa", label: "NELISWA" },
  { id: "que", label: "QUE" },
  { id: "ramona", label: "RAMONA" },
  { id: "thandeka", label: "THANDEKA" },
  { id: "thedon", label: "THE DON" },
  { id: "trixie", label: "TRIXIE" },
  { id: "tumi", label: "TUMI THE BARBER" },
];

const MAX_VOTES = 500;
const VOTE_COST = 100;

/* ===== DATE HELPERS ===== */
function todayKey() {
  return new Date().toISOString().split("T")[0];
}

/* ===== INIT ===== */
function init() {
  // Init votes
  if (!localStorage.getItem("votes")) {
    const v = {};
    contestants.forEach((c) => (v[c.id] = 0));
    localStorage.setItem("votes", JSON.stringify(v));
  }

  // Init daily balance
  const today = todayKey();
  const savedDay = localStorage.getItem("voteDay");

  if (savedDay !== today) {
    localStorage.setItem("voteBalance", MAX_VOTES);
    localStorage.setItem("voteDay", today);
  }

  renderBars();
  updateUI();
}

/* ===== RENDER BARS FROM JS ===== */
function renderBars() {
  const bars = document.querySelector(".bars");
  bars.innerHTML = "";

  contestants.forEach((c) => {
    bars.innerHTML += `
      <div class="bar-wrapper">
        <div class="percent" id="p-${c.id}">0%</div>
        <div class="bar" id="b-${c.id}"></div>
        <div>${c.label}</div>
        <button class="vote-btn" onclick="vote('${c.id}')">Vote</button>
      </div>
    `;
  });
}

/* ===== VOTE ===== */
function vote(id) {
  let balance = Number(localStorage.getItem("voteBalance"));
  if (balance < VOTE_COST) {
    alert("You have used all your votes for today.");
    return;
  }

  const votes = JSON.parse(localStorage.getItem("votes"));
  votes[id] += VOTE_COST;

  localStorage.setItem("votes", JSON.stringify(votes));
  localStorage.setItem("voteBalance", balance - VOTE_COST);

  updateUI();
}

/* ===== UPDATE UI ===== */
function updateUI() {
  const votes = JSON.parse(localStorage.getItem("votes")) || {};

  // Make sure ALL contestants exist in votes
  contestants.forEach((c) => {
    if (typeof votes[c.id] !== "number") {
      votes[c.id] = 0;
    }
  });

  // Save back in case new people were added
  localStorage.setItem("votes", JSON.stringify(votes));

  const total = Object.values(votes).reduce((a, b) => a + b, 0) || 1;

  contestants.forEach((c) => {
    const value = votes[c.id] || 0;
    const percent = ((value / total) * 40).toFixed(1);

    document.getElementById("p-" + c.id).innerText = percent + "%";
    document.getElementById("b-" + c.id).style.height = percent * 7 + "px";
  });
}

init();
