import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { authConfig } from "./auth.config";

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    GoogleProvider({
      clientId:
        "203976553665-epfo6t3961erg1lue8kte6j9d24q5ekg.apps.googleusercontent.com",
      clientSecret: "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",
    }),
  ],
});
