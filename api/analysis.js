
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
  const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!REDIS_URL || !REDIS_TOKEN) {
    return res.status(500).json({
      success: false,
      message: "Redis belum dikonfigurasi"
    });
  }

  try {
    if (req.method === "POST") {
      const data = req.body || {};

      const response = await fetch(`${REDIS_URL}/set/latest`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${REDIS_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error("Gagal menyimpan data");
      }

      return res.status(200).json({
        success: true,
        message: "Analysis berjaya disimpan",
        data
      });
    }

    if (req.method === "GET") {
      const response = await fetch(`${REDIS_URL}/get/latest`, {
        headers: {
          Authorization: `Bearer ${REDIS_TOKEN}`
        }
      });

      if (!response.ok) {
        throw new Error("Gagal membaca data");
      }

      const result = await response.json();
      const data = result.result
        ? JSON.parse(result.result)
        : null;

      return res.status(200).json(
        data || {
          success: true,
          signal: "MENUNGGU DATA",
          probability: null,
          bull_win_rate: null,
          bear_win_rate: null
        }
      );
    }

    return res.status(405).json({
      success: false,
      message: "Method tidak dibenarkan"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
