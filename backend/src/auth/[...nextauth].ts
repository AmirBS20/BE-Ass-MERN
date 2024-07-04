import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import User from '../models/user.model';
import bcrypt from "bcrypt";
import "dotenv/config";
import connectDB from '../util/connectDB';


export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        await connectDB();

        if (!credentials) {
          return null;
        }

        const user = await User.findOne({ username: credentials.username }).select("+password");
        if (user && await bcrypt.compare(credentials.password, user.password)) {
          return {
            id: user._id.toString(),
            username: user.username,
          };
        } else {
          return null;
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          username: token.username as string,
        };
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    }
  },
  pages: {
    signIn: '/auth/signin', 
  },
  secret: process.env.NEXTAUTH_SECRET,
});