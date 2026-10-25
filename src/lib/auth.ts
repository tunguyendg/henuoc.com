import "server-only";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { emailOTP } from "better-auth/plugins";
import { Resend } from "resend";
import { db } from "@/lib/db";
import { serverEnv } from "@/lib/env.server";

const resend = new Resend(serverEnv.RESEND_API_KEY);

export const auth = betterAuth({
  // Lưu user/session/account/verification vào 4 bảng đã migrate ở T-003
  database: prismaAdapter(db, { provider: "postgresql" }),
  secret: serverEnv.BETTER_AUTH_SECRET,
  baseURL: serverEnv.BETTER_AUTH_URL,

  socialProviders: {
    google: {
      clientId: serverEnv.GOOGLE_CLIENT_ID,
      clientSecret: serverEnv.GOOGLE_CLIENT_SECRET,
    },
  },

  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 300, // mã sống 5 phút
      async sendVerificationOTP({ email, otp }) {
        // KHÔNG await: nếu chờ gửi mail, kẻ xấu đo thời gian phản hồi để đoán email nào có tài khoản
        resend.emails
          .send({
            from: "Hẹn Ước <no-reply@henuoc.com>",
            to: email,
            subject: `${otp} là mã đăng nhập Hẹn Ước`,
            text: `Mã đăng nhập của bạn: ${otp}\nMã có hiệu lực 5 phút.\nNếu không phải bạn yêu cầu, hãy bỏ qua email này.`,
          })
          .then(({ error }) => {
            if (error) console.error("[auth] Resend từ chối gửi OTP:", error.name);
          })
          .catch(() => console.error("[auth] Không gọi được Resend"));
        // Log chỉ ghi TÊN lỗi — không ghi email, không ghi mã (AGENTS.md §4)
      },
    }),
    nextCookies(), // luôn để CUỐI: cho Server Action đặt được cookie đăng nhập
  ],
});
