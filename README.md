Siapp bre! Tinggal klik *Copy* di pojok kanan atas kotak ini, murni tanpa basa-basi:


# 🤖 My AIsisten (Stealth Personal AI Assistant)

**My AIsisten** adalah aplikasi web yang menyulap nomor WhatsApp Anda menjadi asisten pribadi bertenaga AI (Groq Llama-3). Didesain dengan arsitektur *stealth* (penyamaran), AI ini membalas pesan layaknya manusia asli berdasarkan *Persona* yang Anda buat, dan **hanya merespons** nomor atau grup yang sudah Anda izinkan (Whitelist).

Dibangun untuk menyelesaikan masalah ngilang tanpa kabar karena ngoding biar ayang ga ngambek.

![UI/UX](https://img.shields.io/badge/UI%2FUX-shadcn%2Fui-black?style=for-the-badge&logo=uiomatic)
![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Groq](https://img.shields.io/badge/Groq_API-F55036?style=for-the-badge&logo=groq&logoColor=white)

---

## ✨ Fitur "Dewa" (Core Features)

* 🕵️‍♂️ **Spy Mode & Smart Takeover:** Pantau obrolan AI dengan kontak Anda secara *real-time* melalui laci *slide-out* layaknya CCTV. Matikan AI secara instan (Takeover) dengan satu tombol jika Anda ingin membalas pesan secara manual.
* 🧠 **Memory Vault (Knowledge Base):** Suntikkan jadwal kuliah, harga layanan, atau rahasia pribadi ke dalam "Buku Pintar" AI. Sistem akan otomatis mengingatnya sebagai fakta saat membalas pesan.
* 👁️ **Vision Mode (Mata AI):** Terintegrasi dengan `Llama-3.2-Vision`. Jika lawan bicara mengirimkan foto, AI dapat melihat dan mengomentari gambar tersebut layaknya manusia asli.
* 🎭 **Dynamic Persona Builder:** Buat kepribadian tanpa batas. Jadikan AI sebagai dosen yang kaku, *customer service* yang ramah, atau teman tongkrongan yang asik.
* 🛡️ **Strict Group Anti-Spam:** Aman dimasukkan ke dalam Grup WhatsApp. AI **HANYA** akan bangun dan merespons jika nomornya di- *mention* menggunakan tag resmi (contoh: `@198519...`).
* 📰 **Daily Briefing (Laporan Ajudan):** Malas membaca log puluhan chat? Tekan satu tombol di Dashboard, dan AI akan merangkum semua kejadian hari ini secara singkat dan padat.
* 🎛️ **GUI Settings Management:** Lupakan edit `.env` manual! Masukkan API Key Groq dan Token Fonnte langsung melalui antarmuka web yang elegan.

---

## 🛠️ Tech Stack

* **Backend:** Laravel (PHP)
* **Database:** PostgreSQL
* **Frontend:** React.js, Inertia.js, Tailwind CSS
* **UI Components:** shadcn/ui & Lucide Icons
* **WhatsApp Gateway:** Fonnte API
* **AI Engine:** Groq API (`llama-3.3-70b-versatile` & `llama-3.2-11b-vision-preview`)

---

## 🚀 Panduan Instalasi (Local Development - Windows)

Pastikan sistem operasi Windows Anda sudah terinstal **PHP**, **Composer**, **Node.js**, dan **PostgreSQL**.

1. **Clone Repository**
   ```bash
   git clone [https://github.com/username-anda/my-aisisten.git](https://github.com/username-anda/my-aisisten.git)
   cd my-aisisten


2. **Install Dependensi Backend & Frontend**
    ```bash
    composer install
    npm install


3. **Setup Environment**
    ```cmd
    copy .env.example .env
    php artisan key:generate


*Atur koneksi PostgreSQL Anda di dalam file `.env` (`DB_CONNECTION=pgsql`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, dll).*
4. **Migrasi Database**
    ```bash
    php artisan migrate



5. **Jalankan Aplikasi**
    ```bash
    composer run dev

---

## ⚙️ Cara Menghubungkan WhatsApp & AI

Aplikasi ini menggunakan **GUI** untuk pengaturan kredensial. Anda tidak perlu memasukkan API Key di `.env`.

1. Daftar akun di [Groq Cloud](https://console.groq.com) dan buat **API Key**.
2. Daftar akun di [Fonnte](https://md.fonnte.com), hubungkan (scan) WhatsApp bot Anda, dan dapatkan **Token**-nya.
3. Login ke dalam Dashboard My AIsisten.
4. Pergi ke menu **Pengaturan Sistem** (Settings).
5. Masukkan **Groq API Key**, **Fonnte Token**, **Nomor WA Owner**, dan **Nomor WA Bot** (Penting untuk deteksi grup).
6. Klik **Simpan Perubahan**.
7. Buka dashboard Fonnte Anda, pergi ke menu **API/Webhook**, dan atur URL Webhook mengarah ke: `https://domain-anda.com/api/webhook` (Gunakan *Ngrok* jika masih di *localhost*).


## ⚠️ Disclaimer

Aplikasi ini dibuat murni untuk keperluan manajemen waktu pribadi, produktivitas, dan pembelajaran. Pengembang tidak bertanggung jawab atas pemblokiran nomor WhatsApp oleh pihak Meta akibat penggunaan yang melanggar *Terms of Service* (seperti *spamming* atau penipuan). Gunakan secara bijak!
