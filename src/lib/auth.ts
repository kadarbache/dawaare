import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

import { prisma } from "./db";
import EmailVerfication from "@/components/EmailVerfication";
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [nextCookies()],
  //   aditional fields
  user: {
    additionalFields: {
      role: {
        type: "string",
        default: "SELLER",
      },
      number: {
        type: "string",
        default: "",
      },
      image: {
        type: "string",
        default: "",
      },
      image_id: {
        type: "string",
        default: "",
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      const typedUser = user as (typeof auth.$Infer.Session)["user"];
      const { error } = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: user.email,
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${url}`,
        react: EmailVerfication({
          userName: user.name,
          role: typedUser.role,
          verificationUrl: url,
          storeName: "Dawaare",
        }),
      });
      
      if (error) {
        console.error("Resend API Error:", error);
      }
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },
});

export type User = (typeof auth.$Infer.Session)["user"];
