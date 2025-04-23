import { z } from "zod";

const baseUserSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6).max(200),
  confirmPassword: z.string().min(6).max(200),
  role: z.enum(["admin", "user"]).default("user"),
  createdAt: z.date().optional(),
  revork: z.boolean().default(false),
  accessVersion: z.number().default(0),
});

// Schema đầy đủ (có refine)
const userSchema = baseUserSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    path: ["confirmPassword"],
    message: "Mật khẩu xác nhận không khớp",
  }
);
const loginSchema = baseUserSchema.pick({
  email: true,
  password: true,
});
export { userSchema, loginSchema };
// const result = userSchema.safeParse(formData);
// if (result.success) {
//   console.log("✅ Hợp lệ:", result.data);
// } else {
//   console.error("❌ Lỗi:", result.error.errors);
// }
