import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import client from "../../../lib/db";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  adapter: MongoDBAdapter(client),
  debug: true,
  callbacks: {
    async session({ session, token, user }) {
      console.log(user?.cart?.length);
      session.cartLength = user?.cart?.length;
      return Promise.resolve(session);
    },
  },
};

export default NextAuth(authOptions);
