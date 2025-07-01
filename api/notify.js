const axios = require("axios");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const { userId, nominal, game } = req.body;
  const diamond = nominal <= 1000 ? "60" : nominal <= 2000 ? "120" : "240";

  const TELEGRAM_TOKEN = "7630038202:AAG1s4A4d46dtqp9bEMKA5gb5tGFWUWQU0Y";
  const OWNER_ID = "6440970593";

  const pesan = `
💰 *PEMBAYARAN SUKSES*
🎮 Game: ${game.toUpperCase()}
🆔 ID Pemain: ${userId}
💎 Jumlah Diamond: ${diamond}
💵 Total Bayar: Rp${nominal}
`;

  try {
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      chat_id: OWNER_ID,
      text: pesan,
      parse_mode: "Markdown"
    });

    return res.json({ status: true });
  } catch (error) {
    console.error("Gagal kirim Telegram:", error.response?.data || error.message);
    return res.status(500).json({ status: false, message: "Gagal kirim notifikasi Telegram" });
  }
};
