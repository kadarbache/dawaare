import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

import { prisma } from "./db";
import EmailVerfication from "@/components/EmailVerfication";
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  //   aditional fields
  user: {
    additionalFields: {
      role: {
        type: ["ADMIN", "SELLER"],
        default: "SELLER",
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: user.email,
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${url}`,
        react: EmailVerfication({
          userName: user.name,
          role: (user as any).role,
          verificationUrl: url,
          storeName: "Dawaare",
        }),
      });
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },
});
