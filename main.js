const names = [
  "buhle",
  "kokii",
  "mshefane",
  "didi",
  "que",
  "ramona",
  "king",
  "neli",
];

const MAX_VOTES = 500;
const VOTE_COST = 100;

/* ===== GET MONDAY ===== */
function getMonday(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff)).toDateString();
}

/* ===== INIT ===== */
function init() {
  // Init votes storage
  if (!localStorage.getItem("votes")) {
    const v = {};
    names.forEach((n) => (v[n] = 0));
    localStorage.setItem("votes", JSON.stringify(v));
  }

  const thisMonday = getMonday();
  const savedMonday = localStorage.getItem("voteMonday");

  // Weekly reset of user vote balance
  if (savedMonday !== thisMonday) {
    localStorage.setItem("voteBalance", MAX_VOTES);
    localStorage.setItem("voteMonday", thisMonday);
  }

  // Init balance if missing
  if (!localStorage.getItem("voteBalance")) {
    localStorage.setItem("voteBalance", MAX_VOTES);
  }

  updateUI();
}

/* ===== VOTE ===== */
function vote(name) {
  let balance = parseInt(localStorage.getItem("voteBalance"));

  if (balance < VOTE_COST) {
    alert("You have used all your 500 votes for this week.");
    return;
  }

  const votes = JSON.parse(localStorage.getItem("votes"));
  votes[name] += VOTE_COST;

  balance -= VOTE_COST;

  localStorage.setItem("votes", JSON.stringify(votes));
  localStorage.setItem("voteBalance", balance);

  updateUI();
}

/* ===== UI UPDATE ===== */
function updateUI() {
  const v = JSON.parse(localStorage.getItem("votes"));
  const total = Object.values(v).reduce((a, b) => a + b, 0) || 1;

  names.forEach((n) => {
    const percent = ((v[n] / total) * 40).toFixed(1);
    document.getElementById("p-" + n).innerText = percent + "%";
    document.getElementById("b-" + n).style.height = percent * 7 + "px";
  });

  // Optional: show remaining votes in console (safe)
  console.log("Remaining votes:", localStorage.getItem("voteBalance"));
}

init();
