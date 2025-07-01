const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

// GANTI: Langsung tulis token & owner di sini
const TELEGRAM_TOKEN = "7630038202:AAG1s4A4d46dtqp9bEMKA5gb5tGFWUWQU0Y";
const OWNER_ID = "6440970593";

app.post("/api/notify", async (req, res) => {
      console.log("🔥 /api/notify terpanggil");
  console.log("📦 Body:", req.body);
  
  const { userId, nominal, game } = req.body;
  const diamond = nominal <= 1000 ? "60" : nominal <= 2000 ? "120" : "240";

  const pesan = `
💰 *PEMBAYARAN SUKSES*
🎮 Game: ${game.toUpperCase()}
🆔 ID Pemain: ${userId}
💎 Jumlah Diamond: ${diamond}
💵 Total Bayar: Rp${nominal}
`;

  console.log("Mau kirim pesan ke Telegram:", pesan); // ✅ log untuk debug

  try {
    const resp = await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      chat_id: OWNER_ID,
      text: pesan,
      parse_mode: "Markdown"
    });

    console.log("Telegram response:", resp.data); // ✅ cek sukses atau tidak

    res.json({ status: true });
  } catch (error) {
    console.error("❌ Gagal kirim ke Telegram:", error.response?.data || error.message);
    res.status(500).json({ status: false, message: "Gagal kirim notifikasi Telegram" });
  }
});
