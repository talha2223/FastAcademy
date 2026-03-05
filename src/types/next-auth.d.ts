import NextAuth from 'next-auth';

type AppRole = 'ADMIN' | 'USER';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      role: AppRole;
    };
  }

  interface User {
    id: string;
    email: string;
    role: AppRole;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId?: string;
    role?: AppRole;
  }
}
