## [IF 3110 Pengembangan Aplikasi Berbasis Web]

### Deskripsi Web Service 

WS-Transaksi menggunakan Node JS dengan npm sebagai package manager. Protokol yang digunakan adalah Representational State Transfer.
Root file dari webservice ini adalah index.js

Beberapa module yang digunakan adalah sebagai berikut :
    1.  axios       :   Promise - based HTTP client module
    2.  dom-parser  :   Dom Parser based on regexps
    3.  dotenv      :   Env reader module
    4.  express     :   Web application server framework
    5.  mysql       :   Module for creating easy mysql connection

Terdapat 3 API yang disesuaikan dengan requirement Tugas Besar 2 kali ini yaitu :
1.  Menambah transaksi baru dengan status “Pending”. Input yang diberikan adalah id pengguna, id film, kursi yang dipilih, dan nomor akun virtual yang menjadi tujuan pembayaran.            Layanan mengembalikan id transaksi.
    - Address dari API : /addPendingTransaction

2.  Mengubah status suatu transaksi menjadi status “Success” atau “Cancelled”. Input yang diberikan adalah id transaksi.
    - Diupdate saat mengambil seluruh transaksi

3.  Mengembalikan seluruh data transaksi pembelian film seorang pengguna Engima
    - Address dari API : /getAllTransactions

### Basis Data yang Digunakan
Basis data untuk Web Service ini menggunakan MySQL, dengan bantuan suatu node module `mysql` untuk mempermudah koneksi

Berikut adalah isi dari create_tables.sql

CREATE TABLE IF NOT EXISTS `transactions` ( `id` int NOT NULL AUTO_INCREMENT, `user_id` int NOT NULL, `flag` bit(2) NOT NULL, `virtual_account_number` varchar(11) NOT NULL, `film_id` int NOT NULL, `screening_id` int NOT NULL, `showtime` timestamp NOT NULL, `seat_id` int NOT NULL, `created_at` timestamp NOT NULL DEFAULT now(), PRIMARY KEY (`id`));

Terdapat satu tabel utama yaitu transactions. Atribut dari setiap tabel dapat dilihat di create_tables.sql

### Running Transaction Web Service using Node JS

1. Buat file .env dengan mengikuti struktur ENV.SAMPLE
2. Install dependensi node dengan menjalankan `npm install`
3. Jalankan `docker-compose up` pada terminal sehingga instance dari database akan dibangun pada mysql
4. Lalu run aplikasi dengan menjalankan `npm index.js` pada terminal
5. Lalu ketik "mysql -u <username pada .env> -p" dan masukkan password sesuai dengan .env
6. Buat database dengan perintah "CREATE DATABASE <nama database pada .env> ;".
7. Copy paste isi dari create_tables.sql dan tekan enter.
8. Testing dapat menggunakan software tester untuk service seperti Postman dengan melakukan request ke masing - masing API

## [IF3159 Dasar Pembangunan Perangkat Lunak]

1. CI/CD: 13517070
2. Eksplorasi mesin deployment: 13517070

URL Deployment:
engima.club:4000