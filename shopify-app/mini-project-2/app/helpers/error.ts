import { Prisma } from "@prisma/client";
import { json } from "@remix-run/node";
import { ZodSafeParseError } from "zod/v4";

export class AppError extends Error {
  status: number;

  constructor(message: string, status: number = 500) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;

    // Fix lỗi mất stack trace khi transpile từ TS -> JS
    Error.captureStackTrace?.(this, this.constructor);
  }
}
export const handleError = (error: any) => {
  //error of Prisma
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Xử lý lỗi cụ thể dựa trên mã lỗi
    if (error.code === "P2002") {
      // Lỗi vi phạm ràng buộc khóa duy nhất (unique constraint)
      return {
        EC: 1,
        EM: error.meta?.target + " duplicated",
        ST: 400,
      };
    } else if (error.code === "P2003") {
      // Lỗi vi phạm ràng buộc khóa ngoại (foreign key)
      return {
        EC: 1,
        EM: "Foreign key constraint failed",
        ST: 400,
      };
    } else if (error.code === "P2025") {
      // Không tìm thấy bản ghi
      return {
        EC: 1,
        EM: "Record not found",
        ST: 404,
      };
    }
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    // Lỗi xác thực query
    const details = error.message
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line);
    return {
      EC: 1,
      EM:
        "Validate Error: lack or wrong data input type" +
        JSON.stringify(details),
      ST: 400,
    };
  }
  //error of App
  if (error instanceof AppError) {
    return {
      EC: 1,
      EM: error.message,
      ST: error.status,
    };
  }
  //common error
  if (error instanceof Error) {
    return {
      EC: 1,
      EM: error.message,
      ST: 400,
    };
  }
  //server Error
  return {
    EC: 1,
    EM: "Server Error",
    ST: 500,
  };
};
export const ErrorValidateZodCustom = (
  isValidateData: ZodSafeParseError<any>,
) => {
  return json(
    {
      EC: 1,
      EM: Object.entries(isValidateData.error.flatten().fieldErrors).flatMap(
        ([field, messages]) =>
          messages?.map((message) => ({ field, message })) ?? [],
      ),
    },
    { status: 400 },
  );
};
