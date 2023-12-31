import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const { auth, signIn, signOut, handlers } = NextAuth({
  providers: [
    GoogleProvider({
      clientId:
        "203976553665-epfo6t3961erg1lue8kte6j9d24q5ekg.apps.googleusercontent.com",
      clientSecret: "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",
    }),
  ],
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl;
      if (pathname === "/dashboard") return !!auth;
      return true;
    },
  },
  pages: {
    signIn: "/login",
  },
});
