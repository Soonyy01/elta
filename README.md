# ELTA

LP radar dan rug shield untuk likuiditas Delta di Robinhood Chain. Data live dari DexScreener, tanpa biaya.

## Isi

| File | Fungsi |
|---|---|
| `public/index.html` | Seluruh website (satu halaman, tanpa build step) |
| `public/favicon.svg` | Logo |
| `api/dex.js` | Proxy ke API publik DexScreener, hanya path yang dibutuhkan, cache 30 detik |
| `package.json` | Penanda ESM untuk fungsi Vercel |

## Fitur versi awal

- **Yield Radar**: semua pool Robinhood Chain yang terlihat, diurutkan menurut perkiraan fee APR (volume 24 jam × fee tier ÷ likuiditas). Filter DEX (semua / Uniswap saja, tempat Delta bekerja), minimum likuiditas, pilihan fee tier 0.05 / 0.3 / 1%, pencarian token.
- **Halaman pool**: APR, turnover harian, transaksi beli/jual per jendela waktu, grafik likuiditas, link ke Delta, chart, dan explorer.
- **Rug Shield**: mencatat likuiditas tiap pool setiap 5 menit di browser pengunjung, lalu menandai pool yang likuiditasnya turun ≥15% (kuning) atau ≥35% (merah) dibanding sekitar satu jam sebelumnya. Watchlist dan notifikasi browser.
- **Coming next**: Depth Map, Shape Studio, Copy-LP, Delta Wrapped, alert Telegram.
- Data diperbarui otomatis setiap 30 detik; angka dan bar beranimasi.

## Deploy ke Vercel

1. vercel.com/new → pilih repo ini → **Deploy**. Tidak perlu setting apa pun.
2. Buka URL-nya. ELTA tidak memakai data contoh: kalau data gagal dimuat, halaman menampilkan request mana yang gagal, kode errornya, dan link untuk membuka request itu. Kalau sebagian request gagal, muncul strip **PARTIAL DATA** di atas halaman dengan rinciannya.

## Sumber data

- Daftar token: DexScreener token boosts dan profiles (chain `robinhood`), token DELTA, dan token yang pernah dicari pengunjung (disimpan di browser).
- Pool: `tokens/v1/robinhood/…` dan `token-pairs/v1/robinhood/…`.
- Alamat kontrak Delta (vault factory, ladder manager v1–v9, router) dicatat dari adapter DefiLlama `projects/delta-liquidity`, untuk fitur berikutnya yang membaca posisi langsung dari chain.

## Batasan yang perlu diketahui

- DexScreener tidak memberikan fee tier per pool, jadi APR adalah perkiraan berdasarkan tier yang dipilih pengunjung.
- Rug Shield memakai riwayat di browser masing-masing pengunjung. Alert yang tetap jalan saat situs ditutup (Telegram) butuh worker dan database, masuk tahap berikutnya.

Proyek komunitas, tidak berafiliasi dengan Delta. Bukan saran investasi.
