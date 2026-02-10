import { kv } from "@vercel/kv";

const contestants = [
  "ashay",
  "bravo",
  "didi",
  "dube",
  "ilano",
  "wanda",
  "liema",
  "neliswa",
  "que",
  "ramona",
  "thandeka",
  "thedon",
  "trixie",
  "tumi",
];

export default async function handler(req, res) {
  let votes = await kv.get("votes");

  if (!votes) {
    votes = {};
    contestants.forEach((id) => (votes[id] = 0));
    await kv.set("votes", votes);
  }

  res.status(200).json(votes);
}
