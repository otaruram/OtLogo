import 'next-auth';
import { User as PrismaUser } from '@prisma/client';

declare module 'next-auth' {
  /**
   * Extends the built-in session.user object
   */
  interface User extends PrismaUser {
    // Add any other custom properties you want in the user object
  }

  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    credits?: number | null;
    createdAt?: Date | null;
  }
} 