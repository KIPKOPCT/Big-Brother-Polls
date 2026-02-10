import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  try {
    let votes = await kv.get("votes");

    if (!votes) {
      votes = {
        ashay: 0,
        bravo: 0,
        didi: 0,
        dube: 0,
        ilano: 0,
        wanda: 0,
        liema: 0,
        neliswa: 0,
        que: 0,
        ramona: 0,
        thandeka: 0,
        thedon: 0,
        trixie: 0,
        tumi: 0,
      };
      await kv.set("votes", votes);
    }

    res.status(200).json(votes);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
