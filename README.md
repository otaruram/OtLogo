# OtLogo – AI-Powered Logo Generator

Generate stunning, unique logos for your brand in seconds. OtLogo combines cutting-edge AI with an intuitive UI so you can focus on creativity, not complexity.

[▶️ App Preview](https://youtu.be/AmeXM55LgL4?si=W2g2dE_WsUFDX50S)

---

## ✨ Features

- **AI-Generated Logos** – Enter a short prompt and receive multiple, high-quality logo concepts instantly.
- **Secure Authentication** – Sign in via email/password or popular social logins using NextAuth.js.
- **Credit System** – Flexible credit model for logo generations and top-ups.
- **Purchase History** – Full record of previous orders and credit transactions.
- **Modern Stack** – Built with Next.js 14, TypeScript, Tailwind CSS, and Prisma for performance and scalability.

---

## 📦 Tech Stack

| Category   | Technology                               |
|------------|------------------------------------------|
| Framework  | Next.js 14                               |
| Language   | TypeScript                               |
| Styling    | Tailwind CSS, CVA                        |
| Backend    | Next.js API routes, Prisma ORM           |
| Auth       | NextAuth.js (+ social providers)         |
| Database   | PostgreSQL (Supabase)                    |

---

## 🚀 Quick Start

**Clone & Install:**
```bash
git clone https://github.com/<your-username>/OtLogo.git
cd OtLogo
npm install
```

**Configure environment variables:**
- Copy `.env.example` → `.env` and fill in the values:
  ```env
  DATABASE_URL="postgresql://user:pass@localhost:5432/otlogo"
  NEXTAUTH_SECRET="super-secret-string"
  NEXTAUTH_URL="http://localhost:3000"
  GITHUB_ID="…"              # optional social providers
  GITHUB_SECRET="…"
  ```

**Prisma migrate & generate:**
```bash
npx prisma migrate dev
```

**Start the dev server:**
```bash
npm run dev
# Visit http://localhost:3000
```

---

## 📁 Project Structure

```
.
├── prisma/                # database schema & seed
├── public/                # static assets
├── src/
│   ├── components/        # reusable UI components
│   ├── contexts/          # React contexts / providers
│   ├── lib/               # utility functions
│   ├── pages/             # Next.js pages & API routes
│   └── styles/            # global styles
└── …
```

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

1. Fork the project
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.

---

OtLogo – AI-Powered Logo Generator 🚀
