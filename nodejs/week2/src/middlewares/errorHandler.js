export const notFound = (req, res, next) => {
  next(new HttpError(404, "Không tìm thấy url này!")); // Gọi next() với lỗi để chuyển đến middleware xử lý lỗi
};
export const errorHandler = (err, req, res, next) => {
  try {
    if (process.env.NODE_ENV !== "production") {
      console.error(err); // Ghi lỗi vào console nếu không phải môi trường sản xuất
      return res.status(err.status || 500).json({
        message: err.message,
        stack: err.stack, // Gửi thông tin stack trace nếu không phải môi trường sản xuất
      });
    } else {
      return res.status(err.status || 500).json({
        message: err.message,
        status: err.status || 500,
      });
    }
  } catch (error) {
    console.error("Lỗi ghi log:", error); // Ghi lỗi vào console nếu không thể ghi vào file
    res.status(500).send("Đã xảy ra lỗi khi xử lý yêu cầu của bạn."); // Gửi thông báo lỗi chung
  }
};
