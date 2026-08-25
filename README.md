# 🧠 Shopee Analytics Helper

Chrome Extension untuk menganalisis data Toko Shopee dan menerjemahkannya ke dalam bahasa manusia yang mudah dipahami.

## 🎯 Tujuan

Bukan untuk membuat Anda hafal analisis data. Tujuannya agar Anda bisa mengambil keputusan bisnis yang tepat meskipun tidak mengerti istilah analitik yang rumit.

## ✨ Fitur V1

### 5 Mode Analisis:
1. **👀 BACA** - "Ini sebenarnya angka apa?"
2. **🧠 ANALISA** - "Apa yang sedang terjadi?"
3. **⚠️ MASALAH** - "Ada yang aneh atau boros?"
4. **🎯 TINDAKAN** - "Gue harus ngapain sekarang?"

### Otomatis Mendeteksi:
- **Status Toko**: 🟢 BAGUS / 🟡 PERLU DICEK / 🔴 MASALAH
- **Masalah Potensial**: Traffic tinggi tapi penjualan rendah? Extension akan beritahu!
- **Rekomendasi Aksi**: Jangan naikkan budget dulu - cek ini dulu!

## 📦 Instalasi

### 1. Download File
```bash
git clone https://github.com/srftwr/shopee-analytics-helper.git
cd shopee-analytics-helper
```

### 2. Load di Chrome
1. Buka `chrome://extensions/`
2. Aktifkan **Developer mode** (kanan atas)
3. Klik **Load unpacked**
4. Pilih folder `shopee-analytics-helper`

### 3. Gunakan
1. Buka Shopee Seller Centre
2. Pergi ke halaman **Performa Toko**
3. Klik icon extension di toolbar Chrome
4. Lihat analisis otomatis Anda! ✨

## 🏗️ Struktur File

```
shopee-analytics-helper/
├── manifest.json       # Konfigurasi extension
├── popup.html         # UI untuk popup
├── popup.css          # Styling
├── popup.js           # Logic analisis
├── content.js         # Script untuk membaca halaman Shopee
├── background.js      # Service worker
└── README.md          # File ini
```

## 🔍 Cara Kerja

```
Halaman Performa Toko Shopee
    ↓
Content Script Membaca Data
    ↓
Kirim ke Popup untuk Analisis
    ↓
Analyzer Memproses Metrik
    ↓
Generate Status & Rekomendasi
    ↓
Tampilkan dalam Bahasa Manusia
```

## 📊 Contoh Output

### Skenario 1: Toko Bagus 🟢
```
Toko sedang performa bagus! 2500+ pengunjung dan 120+ order.
✅ Pertahankan strategi saat ini
📈 Monitor performa terus-menerus
💪 Pertimbangkan scaling budget secara gradual
```

### Skenario 2: Conversion Rendah 🔴
```
Banyak pengunjung tapi sedikit penjualan. Ada masalah dengan conversion!

MASALAH TERDETEKSI:
- Conversion rate sangat rendah
- Kemungkinan: harga terlalu tinggi, foto kurang menarik, atau penawaran kurang jelas

TINDAKAN:
🔍 Cek foto produk - apakah cukup menarik?
💰 Review harga - bandingkan dengan kompetitor
📝 Cek deskripsi - apakah jelas dan menarik?
⏸️ JANGAN naikkan budget iklan dulu!
```

### Skenario 3: Data Belum Jelas 🟡
```
Situasi sedang berfluktuasi. Perlu dicek lebih detail.

📊 Monitor tren lebih lanjut
🔄 Jangan buru-buru ubah strategi
📈 Tunggu data yang lebih lengkap sebelum ambil keputusan
```

## 🚀 Roadmap V2+

- [ ] Analisis Produk Individual
- [ ] Tracking Trend Harian
- [ ] Export Laporan
- [ ] Notifikasi Alert untuk Anomali
- [ ] Integrasi dengan Spreadsheet
- [ ] Mode Prediksi (Machine Learning)

## 🐛 Troubleshooting

### Extension Tidak Muncul Data
1. Pastikan Anda di halaman Performa Toko Seller Centre
2. Refresh halaman
3. Klik ulang button Analisa Ulang

### Error "Tidak bisa membaca data"
- Shopee mungkin mengubah struktur HTML halaman
- Update extension atau buka issue di GitHub

## 💡 Tips Penggunaan

1. **Jangan mengandalkan satu data saja** - selalu lihat trend jangka panjang
2. **Cross-check dengan Seller Centre** - extension hanya membantu interpretasi
3. **Tunggu data lengkap** - jangan ambil keputusan dari data setengah hari

## 📝 License

MIT License - Silakan fork dan develop!

## 💬 Kontribusi

Punya ide? Buat issue atau pull request! Mari berkembang bersama.

---

**Dibuat dengan ❤️ untuk memudahkan hidup seller Shopee**
