# Youth Tiger Soccer School Backend

**Youth Tiger Soccer School Backend** adalah API yang menangani sistem backend untuk aplikasi sekolah sepak bola. API ini dirancang untuk memproses data pengguna, mengelola pendaftaran, serta memberikan informasi terkait program pelatihan.

## 📌 Cara Kerja Aplikasi
Aplikasi bekerja dengan mengikuti serangkaian langkah dasar yang melibatkan interaksi antara pengguna, antarmuka pengguna, dan sistem backend. Berikut adalah proses umumnya:

1. **Pengguna Berinteraksi dengan UI**  
   - Pengguna mendaftar dan masuk ke dalam aplikasi.
   - Mengakses informasi terkait program pelatihan dan jadwal.
   
2. **Permintaan Dikirim ke Backend**  
   - Data dari aplikasi dikirim ke server melalui **HTTP request**.
   - Backend memproses permintaan dan berinteraksi dengan database.
   
3. **Proses Autentikasi & Otorisasi**  
   - Sistem memverifikasi identitas pengguna menggunakan **JWT (JSON Web Token)**.
   - Hanya pengguna yang memiliki izin yang dapat mengakses fitur tertentu.
   
4. **Interaksi dengan Database**  
   - Data pengguna, jadwal pelatihan, dan informasi lainnya disimpan dalam **MySQL** menggunakan **mysql2/promise**.
   - API mengambil atau memperbarui data sesuai permintaan pengguna.
   
5. **Respon Dikirim ke Aplikasi**  
   - Backend mengembalikan **respons JSON** yang berisi data yang diminta.
   - Aplikasi menampilkan informasi kepada pengguna dengan antarmuka yang interaktif.

## 🚀 Teknologi yang Digunakan
- **Node.js** dengan **Express.js** sebagai framework backend.
- **MySQL** sebagai database utama dengan **mysql2/promise**.
- **JWT (JSON Web Token)** untuk autentikasi pengguna.
- **dotenv** untuk pengelolaan variabel lingkungan.
- **ngrok** untuk menjalankan server secara publik dan aman.

Dengan backend ini, **Youth Tiger Soccer School** dapat memberikan pengalaman pengguna yang **mudah, aman, dan efisien** dalam mengakses layanan sekolah sepak bola. ⚽🔥

