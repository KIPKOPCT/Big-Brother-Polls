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

/* ===== DAILY LIMIT (LOCAL) ===== */
function todayKey() {
  return new Date().toISOString().split("T")[0];
}

function canVote() {
  const today = todayKey();
  if (localStorage.getItem("voteDay") !== today) {
    localStorage.setItem("voteDay", today);
    localStorage.setItem("voteBalance", MAX_VOTES);
  }
  return Number(localStorage.getItem("voteBalance")) >= VOTE_COST;
}

function useVote() {
  const b = Number(localStorage.getItem("voteBalance"));
  localStorage.setItem("voteBalance", b - VOTE_COST);
}

/* ===== FETCH RESULTS ===== */
async function loadResults() {
  const res = await fetch("/api/results");
  const votes = await res.json();
  renderBars(votes);
}

/* ===== RENDER SORTED ===== */
function renderBars(votes) {
  const bars = document.querySelector(".bars");
  bars.innerHTML = "";

  const total = Object.values(votes).reduce((a, b) => a + b, 0) || 1;

  const sorted = [...contestants].sort(
    (a, b) => (votes[b.id] || 0) - (votes[a.id] || 0),
  );

  sorted.forEach((c) => {
    const value = votes[c.id] || 0;
    const percent = ((value / total) * 40).toFixed(1);

    bars.innerHTML += `
      <div class="bar-wrapper">
        <div class="percent">${percent}%</div>
        <div class="bar" style="height:${percent * 7}px"></div>
        <div>${c.label}</div>
        <button class="vote-btn" onclick="vote('${c.id}')">Vote</button>
      </div>
    `;
  });
}

/* ===== VOTE ===== */
async function vote(id) {
  if (!canVote()) {
    alert("You have used all your votes today.");
    return;
  }

  useVote();

  await fetch("/api/vote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });

  loadResults();
}

/* ===== INIT ===== */
loadResults();
setInterval(loadResults, 5000); // auto-sync every 5s
