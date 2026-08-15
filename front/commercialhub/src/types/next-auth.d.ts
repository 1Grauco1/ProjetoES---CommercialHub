import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    access_token?: string;
    user: {
      id_pessoa?: number;
    } & DefaultSession["user"];
  }

  interface User {
    access_token?: string;
    id_pessoa?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token?: string;
    id_pessoa?: number;
  }
}
