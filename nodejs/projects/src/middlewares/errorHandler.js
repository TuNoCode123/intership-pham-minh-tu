import HttpError from "../interfaces/error.js";

export const notFound = (req, res, next) => {
  next(new HttpError(404, "Không tìm thấy url này!")); // Gọi next() với lỗi để chuyển đến middleware xử lý lỗi
};
export const errorHandler = (err, req, res, next) => {
  try {
    // console.log("----->", err);
    // // console.log(err);
    // if (process.env.NODE_ENV !== "production") {
    //   return res.status(err.status || 500).json({
    //     message: err.message,
    //     // stack: err.stack, // Gửi thông tin stack trace nếu không phải môi trường sản xuất
    //   });
    // } else {
    //   return res.status(err.status || 500).json({
    //     message: err.message,
    //     status: err.status || 500,
    //   });
    // }

    const statusCode = err.status || 500;
    let message = err.message || "Internal Server Error";

    // Nếu message là mảng thì trả về mảng luôn
    if (Array.isArray(message)) {
      return res.status(statusCode).json({
        EC: 1,
        EM: message,
      });
    }
    // Nếu message là string
    res.status(statusCode).json({
      EC: 1,
      EM: `${message}`,
    });
  } catch (error) {
    console.error("Lỗi ghi log:", error); // Ghi lỗi vào console nếu không thể ghi vào file
    res.status(500).send("Đã xảy ra lỗi khi xử lý yêu cầu của bạn."); // Gửi thông báo lỗi chung
  }
};
