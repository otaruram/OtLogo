export interface Article {
  slug: string;
  category: string;
  title: string;
  content: string;
}

export interface Category {
  name: string;
  description: string;
  articles: Article[];
}

export const helpData: Category[] = [
  {
    name: "Memulai Petualangan Anda",
    description: "Baru di sini? Anggap ini sebagai paket selamat datang dan peta awal untuk memulai petualangan kreatif Anda.",
    articles: [
      {
        slug: "welcome-to-otlogo",
        category: "Memulai Petualangan Anda",
        title: "Selamat Datang di OtLogo! Sebenarnya, Ini Apa Sih?",
        content: `
          <p>Hai, kreator! Selamat datang di OtLogo. Singkatnya? Kami adalah partner kreatif AI Anda.</p>
          <p>Bayangkan seorang desainer jenius yang minum 100 cangkir kopi, tidak pernah tidur, dan bisa mengubah isi kepala Anda menjadi logo dalam hitungan detik. Nah, itulah kami.</p>
          <p class="mt-2">Kami menggunakan gaya 'Kinetic Brutalism'—Jujur dan kuat dalam hasil, namun hidup dan menyenangkan saat digunakan. Mari ciptakan sesuatu yang luar biasa!</p>
        `,
      },
      {
        slug: "anatomy-of-creation-studio",
        category: "Memulai Petualangan Anda",
        title: "Anatomi Studio Kreasi: Tur Singkat Kokpit Anda",
        content: `
          <p>Melihat Studio Kreasi untuk pertama kali mungkin terasa seperti masuk ke kokpit pesawat ruang angkasa. Tenang, Anda tidak butuh lisensi pilot. Ini peta singkatnya:</p>
          <ul class="list-disc list-inside space-y-2 mt-4">
            <li><strong>Panel Kontrol (Kiri):</strong> Ini adalah pusat komando Anda. Di sinilah Anda memberikan instruksi kepada AI, mulai dari prompt utama hingga detail terkecil seperti warna dan gaya.</li>
            <li><strong>Area Preview (Kanan):</strong> Ini adalah jendela Anda ke dimensi imajinasi. Hasil sementara atau sketsa Anda akan muncul di sini.</li>
            <li><strong>Tombol Generate (Tombol Peluncuran!):</strong> Tombol besar yang paling menggoda. Menekannya akan mengirim semua ide Anda ke otak AI kami untuk diproses. Siap meluncur?</li>
          </ul>
        `,
      },
      {
        slug: "credit-system",
        category: "Memulai Petualangan Anda",
        title: "Sistem Kredit: Bahan Bakar Roket Kreatif Anda",
        content: `
          <p>Setiap penjelajahan butuh bahan bakar. Di OtLogo, bahan bakar itu adalah Kredit. Konsepnya sederhana:</p>
          <p class="font-bold my-2">1 Sesi Generate = Menggunakan 1 Kredit.</p>
          <p>Apa yang Anda dapatkan dari 1 sesi generate?</p>
          <ul class="list-disc list-inside space-y-2 mt-2">
            <li><strong>4 Variasi Logo Unik:</strong> AI kami akan memberikan 4 interpretasi berbeda dari prompt Anda sekaligus. Ini memberi Anda pilihan, bukan hanya satu hasil tunggal.</li>
            <li><strong>Akses Penuh ke Fitur 'Remix':</strong> Gunakan hasil yang ada untuk menciptakan sesuatu yang baru lagi.</li>
          </ul>
          <p class="mt-4">Kredit tidak memiliki masa kedaluwarsa. Gunakan hari ini, atau simpan untuk inspirasi mendadak tahun depan. Terserah Anda!</p>
        `,
      },
    ],
  },
  {
    name: "Dojo Kreasi: Menguasai AI",
    description: "Dari pemula menjadi master. Pelajari trik dan teknik untuk membengkokkan imajinasi AI sesuai keinginan Anda.",
    articles: [
      {
        slug: "writing-effective-prompts",
        category: "Dojo Kreasi: Menguasai AI",
        title: "Membisiki Sang AI: Seni Menulis Prompt yang Jitu",
        content: `
            <p>Seni menulis prompt yang baik adalah kunci untuk membuka potensi penuh AI. Ini bukan sekadar memberi perintah, ini adalah percakapan kreatif.</p>
            <h3 class="text-xl font-bold mt-4 mb-2">Jadilah Super Spesifik</h3>
            <p>AI menyukai detail. Semakin banyak konteks yang Anda berikan, semakin akurat hasilnya.</p>
            <ul class="list-disc list-inside space-y-2 my-2">
                <li><strong>Prompt biasa:</strong> "logo serigala"</li>
                <li><strong>Prompt luar biasa:</strong> "Logo emblem seekor serigala siberpunk dengan surai dari kabel neon, menatap percaya diri ke depan, gaya vektor minimalis."</li>
            </ul>
            <h3 class="text-xl font-bold mt-4 mb-2">Gunakan Kata Kunci Gaya</h3>
            <p>Arahkan AI dengan menambahkan kata kunci gaya di akhir prompt Anda, seperti "gaya retro 80-an," "vektor datar minimalis," atau "desain cat air yang lembut."</p>
            <h3 class="text-xl font-bold mt-4 mb-2">Eksperimen dengan Kombinasi Aneh</h3>
            <p>Jangan takut untuk mencoba ide-ide gila. "Paus kosmik yang terbuat dari konstelasi bintang, dalam gaya art nouveau" bisa menghasilkan sesuatu yang menakjubkan.</p>
        `,
      },
      {
        slug: "sketch-area-magic",
        category: "Dojo Kreasi: Menguasai AI",
        title: "Dari Coretan Jadi Karya: Sihir Area Sketsa",
        content: `
          <p>Lihat kotak sketsa itu? Itu bukan sekadar mainan. Itu adalah peta untuk AI Anda. Teknologi di baliknya (bernama ControlNet) menggunakan coretan Anda sebagai 'tulang punggung' dari gambar.</p>
          <p class="font-bold mt-2">Tips Pro: Tidak perlu jadi seniman! Coretan bentuk dasar saja sudah cukup. Gambar lingkaran kasar jika Anda ingin logo berbentuk bulat. Gambar garis melengkung jika Anda ingin ada elemen ombak. AI akan mengisi detailnya dengan ajaib.</p>
        `,
      },
      {
        slug: "alchemy-lab-variations-remix",
        category: "Dojo Kreasi: Menguasai AI",
        title: "Lab Alkimia: Memahami Variasi & Fitur 'Remix'",
        content: `
          <p>Halaman hasil adalah laboratorium Anda.</p>
          <ul class="list-disc list-inside space-y-2 mt-2">
            <li><strong>Variasi:</strong> Anggap 4 hasil pertama sebagai versi logo Anda dari 4 alam semesta paralel yang berbeda. Semuanya valid, tinggal pilih mana yang paling 'Anda'.</li>
            <li><strong>Remix:</strong> Ini adalah fitur 'persilangan genetik' kreatif. Pilih satu variasi yang paling Anda suka, tekan 'Remix', dan tambahkan instruksi baru. Contoh: 'Jadikan logo ini lebih minimalis' atau 'Tambahkan percikan warna emas'. Hasilnya adalah evolusi dari ide Anda.</li>
          </ul>
        `,
      },
    ],
  },
  {
    name: "Markas Besar Digital Anda",
    description: "Mengelola identitas dan keamanan Anda di dunia OtLogo. Cepat, mudah, dan tanpa birokrasi.",
    articles: [
      {
        slug: "sculpting-your-digital-identity",
        category: "Markas Besar Digital Anda",
        title: "Memahat Identitas Digital Anda",
        content: `
          <p>Halaman profil Anda adalah etalase Anda. Mari kita poles.</p>
          <ul class="list-disc list-inside space-y-2 mt-2">
            <li><strong>Foto Profil:</strong> Wajah digital Anda. Unggah gambar yang paling merepresentasikan Anda (atau kucing Anda, kami tidak menghakimi).</li>
            <li><strong>Nickname:</strong> Ini adalah panggilan Anda di jagat OtLogo.</li>
            <li><strong>Bio:</strong> Manifesto Anda dalam beberapa kata. Siapakah Anda? Apa yang Anda ciptakan?</li>
          </ul>
        `,
      },
      {
        slug: "fortress-of-solitude-password-change",
        category: "Markas Besar Digital Anda",
        title: "Benteng Pertahanan: Mengganti Password Anda",
        content: `
          <p>Menjaga markas Anda tetap aman adalah prioritas. Mengganti password di sini semudah 1-2-3.</p>
          <ol class="list-decimal list-inside space-y-2 mt-2">
            <li>Pergi ke halaman Settings.</li>
            <li>Masukkan password lama Anda (kami perlu yakin ini benar-benar Anda).</li>
            <li>Ketik password baru Anda yang super kuat dan unik. Selesai! Benteng Anda kini lebih kokoh.</li>
          </ol>
        `,
      },
    ],
  },
  {
    name: "Logistik & Keuangan",
    description: "Semua tentang transaksi. Dijelaskan dengan transparan, tanpa cetakan kecil yang menyebalkan.",
    articles: [
      {
        slug: "refueling-rocket-buying-credits",
        category: "Logistik & Keuangan",
        title: "Isi Ulang Bahan Bakar: Panduan Membeli Kredit",
        content: `
          <p>Kehabisan bahan bakar roket? Jangan khawatir. Mengisi ulang sangat mudah.</p>
           <ol class="list-decimal list-inside space-y-2 mt-2">
            <li>Pergi ke halaman 'Get Credits'.</li>
            <li>Pilih paket yang paling menggoda (semakin besar, semakin hemat!). Kartunya bisa berputar, lho.</li>
            <li>Anda akan diarahkan ke portal pembayaran kami yang aman (Gumroad).</li>
            <li>Selesaikan pembayaran, dan Anda akan kembali ke OtLogo dengan tangki yang terisi penuh!</li>
          </ol>
        `,
      },
      {
        slug: "mission-tracking-credits-not-arrived",
        category: "Logistik & Keuangan",
        title: "Misi Pelacakan: Kredit Saya Belum Masuk!",
        content: `
            <p>Tenang, 99% kasus ini hanya masalah waktu sinkronisasi. Coba langkah-langkah ini:</p>
            <ol class="list-decimal list-inside space-y-2 mt-2">
                <li><strong>Tunggu 60 Detik:</strong> Terkadang portal pembayaran dan server kami perlu waktu sejenak untuk berkomunikasi.</li>
                <li><strong>Refresh Halaman:</strong> Trik klasik yang sering berhasil (Ctrl+R atau Cmd+R).</li>
                <li><strong>Periksa Email:</strong> Pastikan Anda menerima email konfirmasi dari Gumroad dan OtLogo.</li>
            </ol>
            <p class="mt-4">Jika setelah beberapa menit kredit masih belum muncul, hubungi tim dukungan kami dengan menyertakan email dan nomor transaksi Anda. Kami akan segera menyelesaikannya!</p>
        `,
      },
      {
        slug: "refund-policy",
        category: "Logistik & Keuangan",
        title: "Kebijakan Mundur: Bisakah Saya Refund?",
        content: `
          <p>Kami percaya pada transparansi. <strong>Jawaban Singkat: Umumnya tidak, tapi ada pengecualian.</strong></p>
          <p class="mt-2"><strong>Mengapa?</strong> Setiap kali Anda menekan 'Generate', kami harus membayar biaya komputasi yang signifikan kepada partner AI kami. Biaya ini tidak dapat dikembalikan. Karena itu, kredit yang sudah digunakan tidak dapat di-refund.</p>
          <p class="mt-2"><strong>Kapan Pengecualian Berlaku?</strong> Jika Anda mengalami masalah teknis yang jelas dari pihak kami, atau misalnya, terjadi pembelian ganda yang tidak disengaja. Hubungi tim dukungan, dan kami akan meninjaunya dengan adil.</p>
        `,
      },
    ],
  },
    {
    name: "Saat Mesin Sedikit Batuk",
    description: "Bahkan mesin terbaik pun butuh sedikit perhatian. Temukan solusi cepat untuk masalah umum di sini.",
    articles: [
      {
        slug: "self-diagnosis-generation-failed",
        category: "Saat Mesin Sedikit Batuk",
        title: "Diagnosis Mandiri: Kenapa Generate Saya Gagal?",
        content: `
          <p>Melihat pesan error 'Failed to create prediction'? Tenang, Anda tidak merusak apa pun. Ini biasanya disebabkan oleh salah satu dari tiga hal ini:</p>
          <ul class="list-disc list-inside space-y-2 mt-2">
            <li><strong>Koneksi Internet Anda:</strong> Coba cek koneksi Anda.</li>
            <li><strong>Model AI Sedang 'Pemanasan':</strong> Terkadang model AI perlu 'bangun tidur'. Coba lagi dalam satu menit.</li>
            <li><strong>Prompt Terlalu 'Liar':</strong> Ada kemungkinan prompt Anda secara tidak sengaja memicu filter keamanan dari partner AI kami. Coba ubah sedikit kata-katanya.</li>
          </ul>
        `,
      },
      {
        slug: "ai-is-weird",
        category: "Saat Mesin Sedikit Batuk",
        title: "AI-nya Aneh: Hasilnya Tidak Sesuai Harapan.",
        content: `
          <p>Ingat, AI adalah seniman yang brilian, tapi terkadang interpretasinya abstrak. Jika hasilnya jauh dari harapan:</p>
           <ul class="list-disc list-inside space-y-2 mt-2">
            <li><strong>Perjelas Prompt Anda:</strong> Apakah ada ambiguitas? Tambahkan detail.</li>
            <li><strong>Gunakan 'Remix':</strong> Arahkan kembali AI dari hasil yang paling mendekati.</li>
            <li><strong>Anggap Sebagai Kejutan:</strong> Terkadang, hasil yang 'aneh' justru merupakan ide baru yang tidak pernah Anda pikirkan sebelumnya! Terimalah sedikit kekacauan kreatif.</li>
          </ul>
        `,
      },
    ],
  },
];