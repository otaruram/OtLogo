import 'next-auth';
import 'next-auth/jwt';

// Learn more about extending types in NextAuth.js here:
// https://next-auth.js.org/getting-started/typescript

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      bio?: string | null;
      language?: string | null;
      credits?: number | null;
    };
  }

  interface User {
      bio?: string | null;
      language?: string | null;
      credits?: number | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    bio?: string | null;
    language?: string | null;
    credits?: number | null;
  }
} 