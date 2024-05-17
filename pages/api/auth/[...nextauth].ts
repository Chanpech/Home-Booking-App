import { PrismaAdapter } from "@next-auth/prisma-adapter";
import  NextAuth, { AuthOptions } from "next-auth";

import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

import prisma from "@/app/libs/prismadb";

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: {label: 'email', type: 'text'},
                password: {label: 'password', type: 'password'},
            },
            async authorize(credentials){
                if(!credentials?.email || !credentials?.password){ // check if email and password are provided
                    throw new Error('Invalid credentials');
                }

                const user = await prisma.user.findUnique({ // find user by email
                    where : {
                        email: credentials.email
                    }
                });
                
                if(!user || !user?.hashedPassword){ // user not found
                    throw new Error('Invalid credentials');
                }

                const isCorrectPassword = await bcrypt.compare(
                    credentials.password,
                    user.hashedPassword
                );
                
                if(!isCorrectPassword){ // password incorrect
                    throw new Error('Invalid credentials');
                }

                //If everything is correct, return the user
                return user;
            }
        })
    ],
    pages: {
        signIn: '/' // redirect to home page if any error occurs
    },
    debug: process.env.NODE_ENV === 'development',
    session: {
        strategy: 'jwt' //jwt is the default strategy 
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions); // export the auth options to NextAuth