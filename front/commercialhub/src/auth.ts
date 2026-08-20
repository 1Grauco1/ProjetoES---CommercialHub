import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { BACKEND_URL } from "@/src/config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        username: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const { username, password } = credentials ?? {};

        if (!username || !password) return null;

        console.error("[AUTH] BACKEND_URL:", BACKEND_URL);

        const params = new URLSearchParams({
          username: String(username),
          password: String(password),
        });

        const loginResponse = await fetch(`${BACKEND_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params.toString(),
        });

        if (!loginResponse.ok) {
          console.error("[AUTH] Backend login failed:", loginResponse.status, await loginResponse.text());
          return null;
        }

        const loginData = await loginResponse.json();

        const access_token = loginData.access_token ?? loginData.token;

        if (!access_token) return null;

        const perfilResponse = await fetch(`${BACKEND_URL}/usuario/me`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        if (!perfilResponse.ok) {
          console.error("[AUTH] Profile fetch failed:", perfilResponse.status, await perfilResponse.text());
          return null;
        }

        const perfil = await perfilResponse.json();

        return {
          id: String(perfil.id),
          name: perfil.nome,
          email: perfil.email,
          access_token,
          id_pessoa: perfil.id,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.access_token = user.access_token;
        token.id_pessoa = user.id_pessoa;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    session({ session, token }) {
      const access_token = token.access_token as string | undefined;
      const id_pessoa = token.id_pessoa as number | undefined;

      if (access_token) {
        session.access_token = access_token;
      }
      if (id_pessoa) {
        session.user.id_pessoa = id_pessoa;
      }
      return session;
    },
  },
});
