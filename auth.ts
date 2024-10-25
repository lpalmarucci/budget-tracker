import { AuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import db from "@/lib/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import * as bcrypt from "bcrypt";

const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: {},
        username: {},
        password: {},
      },
      async authorize(credentials) {
        // check to see if email and password is there
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter an email and password");
        }

        // check to see if user exists
        const user = await db.user.findUnique({
          where: {
            email: credentials?.email,
          },
        });

        // if no user was found
        if (!user || !user?.password) {
          throw new Error("No user found");
        }

        // check to see if password matches
        const passwordMatch = await bcrypt.compare(credentials.password, user.password);

        // if password does not match
        if (!passwordMatch) {
          throw new Error("Incorrect password");
        }

        return user;
      },
    }),
  ],
  // callbacks: {
  //   async redirect({ url, baseUrl }) {
  //     const userSettings = await db.userSettings.findFirst({
  //       where: {
  //         userId: account.userId,
  //       },
  //     });
  //     if (!userSettings) return "/wizard";
  //     return url;
  //   },
  // },
  pages: {
    signIn: "/auth/signin",
    newUser: "/wizard",
  },
  secret: process.env.SECRET,
};

/**
 * Helper function to get the session on the server without having to import the authOptions object every single time
 * @returns The session object or null
 */
const getSession = () => getServerSession(authOptions);

export { authOptions, getSession };
