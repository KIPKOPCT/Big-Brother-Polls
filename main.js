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
  try {
    // For testing without a backend, use mock data
    // Comment this out when your API is ready
    const mockVotes = generateMockVotes();
    renderBars(mockVotes);

    // Uncomment this when your API is ready
    // const res = await fetch("/api/results");
    // const votes = await res.json();
    // renderBars(votes);
  } catch (error) {
    console.error("Error loading results:", error);
  }
}

// Generate mock votes for testing
function generateMockVotes() {
  const votes = {};
  contestants.forEach((c) => {
    votes[c.id] = Math.floor(Math.random() * 100);
  });
  return votes;
}

/* ===== RENDER SORTED ===== */
function renderBars(votes) {
  const barsContainer = document.getElementById("bars-container");
  if (!barsContainer) return;

  barsContainer.innerHTML = "";

  const total = Object.values(votes).reduce((a, b) => a + b, 0) || 1;

  const sorted = [...contestants].sort(
    (a, b) => (votes[b.id] || 0) - (votes[a.id] || 0),
  );

  sorted.forEach((c) => {
    const value = votes[c.id] || 0;
    const percent = ((value / total) * 100).toFixed(1);
    // Max height 200px, min height 10px
    const barHeight = Math.max(10, percent * 2);

    const barWrapper = document.createElement("div");
    barWrapper.className = "bar-wrapper";
    barWrapper.innerHTML = `
      <div class="percent">${percent}%</div>
      <div class="bar" style="height:${barHeight}px"></div>
      <div>${c.label}</div>
      <button class="vote-btn" onclick="vote('${c.id}')">Vote</button>
    `;

    barsContainer.appendChild(barWrapper);
  });
}

/* ===== VOTE ===== */
async function vote(id) {
  if (!canVote()) {
    alert("You have used all your votes today.");
    return;
  }

  useVote();

  try {
    // Uncomment when API is ready
    // await fetch("/api/vote", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ id }),
    // });

    // For testing without backend
    console.log(`Voted for: ${id}`);
    alert(
      `Voted for ${id}! Votes remaining: ${localStorage.getItem("voteBalance")}`,
    );

    loadResults();
  } catch (error) {
    console.error("Error voting:", error);
  }
}

/* ===== INIT ===== */
// Make sure DOM is loaded before running
document.addEventListener("DOMContentLoaded", () => {
  loadResults();
  setInterval(loadResults, 5000); // auto-sync every 5s
});
