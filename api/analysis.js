
export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    const data = req.body || {};
    return res.status(200).json({
      success: true,
      message: "Data diterima",
      ...data
    });
  }

  return res.status(200).json({
    success: true,
    signal: "MENUNGGU DATA",
    probability: null,
    bull_win_rate: null,
    bear_win_rate: null
  });
}
