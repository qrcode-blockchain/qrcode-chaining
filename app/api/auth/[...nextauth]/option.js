import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';
import {dbConnect} from "../../../../lib/dbConnect";
import manufacturerModel from "../../../../model/Manufacturer";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Please provide both email and password');
                }

                await dbConnect();
                try {
                    const manufacturer = await manufacturerModel.findOne({
                        email: credentials.email
                    });

                    if (!manufacturer) {
                        throw new Error('No user found with this email');
                    }

                    if (!manufacturer.isVerified) {
                        throw new Error('Please verify your account before login');
                    }

                    const isPasswordCorrect = await bcrypt.compare(
                        credentials.password,
                        manufacturer.password
                    );

                    if (!isPasswordCorrect) {
                        throw new Error('Password is incorrect');
                    }

                    // Return only the necessary data
                    return {
                        id: manufacturer._id.toString(),
                        email: manufacturer.email,
                        name: manufacturer.name,
                        isVerified: manufacturer.isVerified
                    };

                } catch (err) {
                    throw new Error(err.message);
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            // authorization: {
            //     params: {
            //         prompt: "select_account",
            //         access_type: "offline",
            //         response_type: "code"
            //     }
            // }
        })
    ],
    callbacks: {  // Add this redirect callback
        async redirect({ url, baseUrl }) {
          // If the URL is already a relative URL (starts with /), prefix it with baseUrl
          if (url.startsWith('/')) {
            return `${baseUrl}${url}`;
          }
          // If the URL is already an absolute URL on the same origin, return it as-is
          else if (url.startsWith(baseUrl)) {
            return url;
          }
          // Default to redirecting to the dashboard
          return `${baseUrl}/dashboard`;
        },
        async signIn({ user, account, profile }) {
            await dbConnect();

            if (account?.provider === "google") {
                 //allowing google to authenticate users without storing in database
            return true;
        }return true;
    },
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.isVerified = user.isVerified;
                token.provider = account?.provider || "credentials";
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                // Initialize the manufacturer object
                session.manufacturer = {
                    _id: token.id,
                    email: token.email,
                    name: token.name,
                    isVerified: token.isVerified,
                    provider: token.provider
                };
            }
            return session;
        }
    },
    pages: {
        signIn: '/SignIn'
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60 // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development'
};