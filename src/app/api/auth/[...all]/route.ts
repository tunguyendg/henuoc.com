import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

// [...all] = bắt MỌI đường dẫn /api/auth/... (callback Google, gửi OTP, lấy phiên…) giao cho Better Auth
export const { GET, POST } = toNextJsHandler(auth);
