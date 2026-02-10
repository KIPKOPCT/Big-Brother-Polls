import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Missing contestant id" });
  }

  const votes = (await kv.get("votes")) || {};
  votes[id] = (votes[id] || 0) + 100;

  await kv.set("votes", votes);

  res.status(200).json(votes);
}
