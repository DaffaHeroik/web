document.getElementById("formTopup").addEventListener("submit", async function (e) {
  e.preventDefault(); // Mencegah reload

  const userId = document.getElementById("userId").value;
  const nominal = parseInt(document.getElementById("nominal").value);

  alert("Sedang membuat pembayaran...");

  try {
    const randomAdd = Math.floor(Math.random() * 20) + 1;
    const totalBayar = nominal + randomAdd;

    const kodeQr = "00020101021126670016COM.NOBUBANK.WWW01189360050300000879140214035011014326210303UMI51440014ID.CO.QRIS.WWW0215ID20253801852100303UMI5204541153033605802ID5925HEROIKZRE STORE OK22963696005KUKAR61057525162070703A016304B23A";

    const response = await fetch(`https://simpelz.fahriofficial.my.id/api/orkut/createpayment?apikey=new2025&amount=${totalBayar}&codeqr=${kodeQr}`);
    const result = await response.json();

    console.log("Respon dari API eksternal:", result);

    if (result?.status && result?.result?.qrImageUrl) {
      const img = document.createElement("img");
      img.src = result.result.qrImageUrl;
      img.alt = "QRIS Pembayaran";
      img.style = "max-width:300px;margin-top:15px;";

      const form = document.getElementById("formTopup");
      

      // Simpan dulu
const savedUserId = userId;
const savedNominal = nominal;
const savedGame = new URLSearchParams(window.location.search).get("game") || "unknown";

// Hapus form, tampilkan QR
form.innerHTML = `<p>Scan QR berikut untuk membayar Rp${totalBayar}:</p>`;
form.appendChild(img);

// Mulai polling dengan data yang sudah disimpan
startPolling(totalBayar, savedUserId, savedNominal, savedGame);


      // Mulai polling status pembayaran
    } else {
      alert("Gagal membuat QRIS dari API eksternal. " + (result?.message || ""));
    }
  } catch (err) {
    alert("Terjadi kesalahan saat memanggil API QRIS eksternal.");
    console.error(err);
  }
});

// Fungsi untuk polling status pembayaran
function startPolling(jumlahPembayaran, userId, nominal, game) {
  const maxPollingTime = 5 * 60 * 1000;
  const pollingInterval = 8000;
  const startTime = Date.now();

  const polling = setInterval(async () => {
    const now = Date.now();
    if (now - startTime >= maxPollingTime) {
      clearInterval(polling);
      alert("QRIS telah kedaluwarsa.");
      return;
    }

    try {
      const cek = await fetch(`https://simpelz.fahriofficial.my.id/api/orkut/cekstatus?apikey=new2025&merchant=OK2296369&keyorkut=498351617426016162296369OKCT5F3D5CD0401716106554D58981DA3ACD`);
      const data = await cek.json();
      console.log("Cek status pembayaran:", data);

      if (data?.amount == jumlahPembayaran) {
        clearInterval(polling);
        console.log("🟢 Akan kirim notifikasi ke Telegram...");

        try {
          const res = await fetch("/api/notify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, nominal, game })
          });
          const notifyRes = await res.json();
          console.log("✅ Respon dari /api/notify:", notifyRes);
        } catch (err) {
          console.error("❌ Gagal kirim notifikasi ke Telegram:", err);
        }

        // Tunggu 3 detik, lalu redirect
        setTimeout(() => {
          window.location.href = "sukses.html";
        }, 30000);
      }

    } catch (err) {
      console.error("Gagal mengecek status pembayaran:", err);
    }
  }, pollingInterval);
}
