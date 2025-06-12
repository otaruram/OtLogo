import type { NextApiRequest, NextApiResponse } from 'next';

type Action = {
  type: 'navigate';
  payload: string;
};

type ResponseData = {
  response: string;
  suggestions: string[];
  action?: Action | null;
};

// Helper function untuk menunda respon agar terasa lebih alami
const randomDelay = (min = 400, max = 1000) => 
  new Promise(res => setTimeout(res, Math.floor(Math.random() * (max - min + 1) + min)));

// --- LOGIKA BARU CHATBOT TANPA API EKSTERNAL ---
const getComplexStaticReply = (message: string): ResponseData => {
  const lowerCaseMessage = message.toLowerCase();

  // Keyword-based matching
  if (lowerCaseMessage.includes('apa itu') && lowerCaseMessage.includes('otlogo')) {
    return {
      response: "OtLogo adalah platform revolusioner berbasis AI yang memungkinkan siapa saja, dari individu hingga agensi, untuk menciptakan logo berkualitas tinggi dalam hitungan detik. Cukup tuliskan ide Anda, dan AI kami akan menerjemahkannya menjadi visual yang menakjubkan. Kami menggabungkan kekuatan teknologi dengan kebebasan kreativitas.",
      suggestions: ["Bagaimana cara kerjanya?", "Apa saja fiturnya?", "Beri contoh prompt"],
      action: null,
    };
  }

  if (lowerCaseMessage.includes('bagaimana') && lowerCaseMessage.includes('simpan') && lowerCaseMessage.includes('logo')) {
    return {
      response: "Tentu! Setelah AI kami selesai membuat logo, Anda akan melihat tombol 'Save to My Logos'. Cukup klik tombol itu, dan logo akan langsung tersimpan di galeri pribadi Anda di halaman 'Logo Saya'. Dari sana, Anda bisa mengunduh, membagikan, atau melihatnya kembali kapan saja.",
      suggestions: ["Di mana halaman 'Logo Saya'?", "Apakah logo bisa di-edit lagi?", "Format filenya apa?"],
      action: null,
    };
  }

  if (lowerCaseMessage.includes('contoh') && lowerCaseMessage.includes('prompt')) {
    return {
      response: "Tentu, ini beberapa contoh prompt yang bagus untuk inspirasi:\n\n*   **Minimalis:** 'logo rubah dengan gaya garis tunggal, modern, warna oranye'\n*   **Maskot:** 'maskot naga untuk tim e-sport, garang, dengan warna merah menyala dan emas'\n*   **Vintage:** 'emblem untuk kedai kopi, gaya retro tahun 70-an, dengan gambar cangkir kopi dan biji kopi'\n\nKuncinya adalah detail pada gaya, subjek, dan warna!",
      suggestions: ["Saya mau coba buat logo", "Apa itu gaya garis tunggal?"],
      action: null,
    };
  }

  if (lowerCaseMessage.includes('pergi') && lowerCaseMessage.includes('halaman') && lowerCaseMessage.includes('harga')) {
    return {
      response: "Tentu, saya akan antar Anda ke halaman harga sekarang.",
      suggestions: [],
      action: { type: 'navigate', payload: '/pricing' },
    };
  }

  if (lowerCaseMessage.includes('pergi') && lowerCaseMessage.includes('halaman') && lowerCaseMessage.includes('generate')) {
    return {
      response: "Oke, ayo kita mulai berkreasi! Mengarahkanmu ke halaman Generate...",
      suggestions: [],
      action: { type: 'navigate', payload: '/config' },
    };
  }

  if (lowerCaseMessage.includes('halo') || lowerCaseMessage.includes('hai') || lowerCaseMessage.includes('hi')) {
    return {
      response: "Halo! Aku Kirana, asisten AI-mu di OtLogo. Ada yang bisa kubantu untuk proyek logomu hari ini?",
      suggestions: ["Apa itu OtLogo?", "Bagaimana cara buat logo?", "Berapa harga paket?"],
      action: null,
    };
  }
  
  if (lowerCaseMessage.includes('harga') || lowerCaseMessage.includes('kredit') || lowerCaseMessage.includes('paket') || lowerCaseMessage.includes('beli')) {
    return {
      response: "Tentu! Kami punya beberapa paket kredit. Paket 'Creator' seharga $15 untuk 200 kredit adalah yang paling populer. Ini sudah termasuk lisensi komersial penuh. Kamu bisa lihat semua detailnya di halaman 'Harga'.",
      suggestions: ["Jelaskan fitur paket Creator", "Pergi ke halaman Harga", "Apa itu lisensi komersial?"],
      action: null,
    };
  }

  if (lowerCaseMessage.includes('cara kerja') || (lowerCaseMessage.includes('bagaimana') && lowerCaseMessage.includes('buat'))) {
    return {
      response: "Caranya simpel! Kamu cukup tuliskan ide logomu di kolom prompt pada halaman 'Generate'. Semakin detail deskripsimu (misal: 'logo kucing ninja dengan gaya modern minimalis, warna oranye dan hitam'), semakin akurat hasilnya. AI kami akan memberikan beberapa opsi yang bisa kamu kembangkan lagi.",
      suggestions: ["Beri contoh prompt", "Pergi ke halaman Generate", "Apakah logonya unik?"],
      action: null,
    };
  }

  if (lowerCaseMessage.includes('fitur')) {
      return {
          response: "OtLogo punya banyak fitur keren! Kamu bisa generate logo dari teks, mengubah style, warna, bahkan menambahkan teks khusus. Selain itu, ada galeri untuk inspirasi, dan semua logo yang kamu buat akan tersimpan di halaman 'Logo Saya'.",
          suggestions: ["Bagaimana cara simpan logo?", "Di mana galeri?", "Saya mau buat logo sekarang"],
          action: null,
      };
  }
  
  if (lowerCaseMessage.includes('hak cipta') || lowerCaseMessage.includes('lisensi') || lowerCaseMessage.includes('komersial')) {
      return {
          response: "Ini penting! Saat kamu membeli paket 'Creator' atau 'Pro', kamu mendapatkan lisensi komersial penuh. Artinya, logo itu 100% milikmu dan bebas kamu gunakan untuk bisnis. Untuk paket 'Starter', lisensinya hanya untuk penggunaan personal ya.",
          suggestions: ["Apa beda lisensi personal?", "Berapa harga paket Pro?"],
          action: null,
      };
  }

  if (lowerCaseMessage.includes('terima kasih') || lowerCaseMessage.includes('thanks')) {
    return {
      response: "Sama-sama! Senang bisa membantu. Kalau ada pertanyaan lain, jangan ragu tanya aku lagi ya!",
      suggestions: [],
      action: null,
    };
  }
  
  if (lowerCaseMessage.includes('bye') || lowerCaseMessage.includes('sampai jumpa')) {
    return {
        response: "Baik, sampai jumpa lagi. Selamat berkreasi dengan OtLogo!",
        suggestions: [],
        action: null,
    };
  }

  // Jawaban default
  return {
    response: "Maaf, aku belum mengerti. Mungkin kamu bisa tanya soal fitur, harga, atau cara membuat logo?",
    suggestions: ["Apa saja fiturnya?", "Berapa harga paket?", "Bagaimana cara buat logo?"],
    action: null,
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | { error: string }>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message must be a non-empty string.' });
  }

  try {
    // Simulasi waktu "berpikir" dari AI
    await randomDelay();

    const botReply = getComplexStaticReply(message);
    
    res.status(200).json(botReply);

  } catch (error) {
    console.error('Error in message handler:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
} 