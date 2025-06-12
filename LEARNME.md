# LEARNME – Panduan Belajar Proyek **OtLogo**

Selamat datang di *LEARNME*. Dokumen ini menyajikan **peta belajar terstruktur** agar Anda dapat memahami, memodifikasi, dan memperluas seluruh kode OtLogo secara mandiri.

---

## 1. Gambaran Umum

| Layer | Teknologi | Berkas Utama |
|-------|-----------|--------------|
| Front-end | Next.js 14 (App Router disabled) • React 18 • TypeScript • Tailwind CSS • CVA • Framer-Motion • React-Three-Fiber | `frontend/src/*` |
| Back-end | Next.js API Routes • Prisma ORM • PostgreSQL | `frontend/src/pages/api/*` + `prisma/*` |
| Autentikasi | NextAuth.js (Credentials & Social) | `frontend/src/pages/api/auth/[...nextauth].ts` |
| Infrastruktur AI | Replicate API (Stable Diffusion XL) | `frontend/src/pages/api/predictions/*` |
| Kredit & Pembayaran | Prisma (kolom `credits`) • Virtual-Account (Midtrans/Gumroad) | `contexts/CreditsContext.tsx`, API routes |

---

## 2. Struktur Proyek Lengkap

```
OtLog/
├── frontend/
│   ├── src/
│   │   ├── components/      # UI & util components (Header, KiranaChatbot, etc.)
│   │   ├── contexts/        # React Context Providers (Credits)
│   │   ├── lib/             # Helper utilities (prisma, auth)
│   │   ├── pages/           # Next.js Pages + API routes
│   │   │   ├── api/         # REST-like JSON endpoints
│   │   │   └── ...          # UI pages (index, account, config)
│   │   └── styles/          # Tailwind config & globals
│   └── package.json         # FE dependencies & scripts
├── prisma/
│   ├── schema.prisma        # DB schema
│   └── seed.ts              # Dev sample data
├── backend/ (optional microservice sample)
└── README.md • LEARNME.md   # Dokumentasi
```

---

## 3. Alur Kerja Utama

1. **User mendaftar** → NextAuth membuat record `User` (Prisma).
2. **Dashboard** memperlihatkan kredit tersisa (dari `CreditsContext`).
3. **Generate Logo** (`/config`) → POST `/api/predictions`:
   - Server memeriksa kredit, men-decrement.
   - Memanggil Replicate API & mem-poll hingga *succeeded*.
   - Hasil URL gambar dikirim balik.
4. **Simpan / My Logos** → POST `/api/logos/save` menyimpan prompt & URL ke DB.
5. **Quick Edits (Remove BG)** → `/api/predictions/remove-background` (Belum selesai).
6. **Smart Variations** → Placeholder; rencana gunakan *image-to-image* & 1 variasi gratis.

---

## 4. Modul Penting

| Modul | Fungsi | File |
|-------|--------|------|
| `KiranaChatbot` | Floating chatbot + FAQ navigasi | `components/KiranaChatbot.tsx` |
| `CreditsContext` | Global state kredit (fetch, update) | `contexts/CreditsContext.tsx` |
| `Header` | Navigasi responsif + switch bahasa i18n | `components/Header.tsx` |
| `ConfigPage` | Form pembuatan logo & hasil | `pages/config.tsx` |
| API `predictions` | End-point AI generation + BG removal | `pages/api/predictions/*.ts` |
| `prisma/schema.prisma` | Definisi tabel `User`, `Logo`, `Purchase` | prisma |

---

## 5. Debugging & Tips

### 5.1 TypeScript (`tsc`)

* Jalankan `npm run lint` & `npm run type-check`.
* Error *“i18n is possibly null”* diselesaikan dengan `const { t, i18n } = useTranslation()`. Pastikan tidak meng-import `i18n` langsung.

### 5.2 Next.js API Routes

* Gunakan `req.method` guard.
* Semua handler menangani status 405 / 500 jelas.

### 5.3 Prisma

* Migrasi: `npx prisma migrate dev`.
* Debug query: set `DEBUG="prisma:*"`.

### 5.4 Credit Race-Condition

* Update `credits` dalam **single** query `prisma.user.update({ data:{ credits:{ decrement:1 }}})`.
* Gunakan transaksi (`$transaction`) jika perlu multi-step.

### 5.5 UI/UX

* Kontrol posisi komponen via Tailwind util (`fixed bottom-5 right-5`).
* Gunakan **React-Three-Fiber** hanya di client (dynamic import `ssr:false`).

---

## 6. Menambahkan Fitur Baru

1. **Smart Variations**
   - Buat endpoint `/api/predictions/variation` yang memanggil *control-net* atau *image-to-image*.
   - Allow gratis satu kali (`sessionStorage.getItem('freeVar')`).
   - Setelah itu dec `credits`.

2. **Remove Background**
   - Integrasi [remove.bg](https://www.remove.bg/api) atau `replicate:carvekit`.
   - Mirip alur credit di atas.

---

## 7. Testing

* Unit & integration with **Jest** + **React Testing Library** (belum di-setup).
* e2e dengan **Playwright** (recommended).

---

## 8. Deployment

| Target | Command |
|--------|---------|
| Dev   | `npm run dev` |
| Prod  | `npm run build && npm start` |
| Vercel| Autodetect Next.js |

---

## 9. FAQ Ringkas

<details>
<summary>Bagaimana cara menambah kredit?</summary>
Gunakan halaman **Billing** yang mem-POST `/api/credits/add` dengan jumlah kredit.
</details>

<details>
<summary>Apa beda paket Starter / Creator / Pro?</summary>
Starter → Non-komersial; Creator & Pro → Lisensi penuh + prioritas.
</details>

---

> Selamat bereksplorasi! Jika ada kendala, buka *Issues* di repo atau kontak maintainer.
