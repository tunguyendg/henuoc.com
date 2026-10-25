import { emailOTPClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

// Chạy trên TRÌNH DUYỆT: chỉ gọi /api/auth/*, không biết secret nào cả
export const authClient = createAuthClient({ plugins: [emailOTPClient()] });
