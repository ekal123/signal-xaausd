export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  try {
    const {
      price,
      rsi,
      mfi,
      atr,
      tpDistance,
      slDistance
    } = req.body || {};

    const values = {
      price, rsi, mfi, atr, tpDistance, slDistance
    };

    for (const [key, value] of Object.entries(values)) {
      if (value === undefined || value === null || value === "") {
        return res.status(400).json({
          success: false,
          message: `Missing value: ${key}`
        });
      }

      if (!Number.isFinite(Number(value))) {
        return res.status(400).json({
          success: false,
          message: `Invalid value: ${key}`
        });
      }
    }

    const p = Number(price);
    const r = Number(rsi);
    const m = Number(mfi);
    const a = Number(atr);
    const tpD = Number(tpDistance);
    const slD = Number(slDistance);

    if (
      p <= 0 || r < 0 || r > 100 ||
      m < 0 || m > 100 || a < 0 ||
      tpD <= 0 || slD <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Values outside allowed range"
      });
    }

    let signal = "WAIT";
    let reason = "No clear signal";

    if (r < 30 && m < 20) {
      signal = "BUY";
      reason = "RSI and MFI are in low ranges";
    } else if (r > 70 && m > 80) {
      signal = "SELL";
      reason = "RSI and MFI are in high ranges";
    }

    let entry = null;
    let takeProfit = null;
    let stopLoss = null;

    if (signal === "BUY") {
      entry = p;
      takeProfit = p + tpD;
      stopLoss = p - slD;
    }

    if (signal === "SELL") {
      entry = p;
      takeProfit = p - tpD;
      stopLoss = p + slD;
    }

    return res.status(200).json({
      success: true,
      pair: "XAUUSD",
      timeframe: "15m",
      signal,
      reason,
      entry,
      takeProfit,
      stopLoss,
      atr: a,
      mode: "SIMULATION",
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("PROJECT AI API ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal API error"
    });
  }
}