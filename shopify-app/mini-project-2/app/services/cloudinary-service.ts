import cloudinary from "app/cloudinary.server";
import { UploadApiResponse } from "cloudinary";
import redisService from "./redis-service";
import { REDIS_KEY } from "app/constrant/enum";
import sharp from "sharp";
import { handleError } from "app/helpers/error";
class CloudinaryService {
  uploadToCloudinary = async (
    file: File,
    publicId: string,
    customerId: string,
    productId: string,
  ): Promise<{
    EC: number;
    EM: any;
    ST: number;
    DT?: UploadApiResponse;
  }> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const optimizedBuffer = await sharp(buffer)
        .resize({ width: 800, withoutEnlargement: true })
        .webp({ quality: 25 })
        .toBuffer();
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "temp",
            public_id: publicId,
          },
          (error, result) => {
            if (error) {
              reject({
                EC: 1,
                EM: "Image upload failed",
                ST: 200,
              });
            } else {
              redisService
                .setKey({
                  key: `${REDIS_KEY.IMAGE}-${customerId}-${productId}-${result?.public_id}`,
                  value: result?.url ?? "",
                  time: 3600,
                })
                .catch((error) => console.log("errorRedis", error));
              resolve({
                EC: 0,
                EM: "Image upload successfully",
                ST: 200,
                DT: result!,
              });
            }
          },
        );
        uploadStream.end(optimizedBuffer);
      });
    } catch (error) {
      console.log("Error111", error);
      throw new Error(`Image upload failed: ${error}`);
    }
  };
  deleteImageFromCloudinary = async (publicId: string) => {
    try {
      await cloudinary.uploader.destroy(publicId);
      return {
        EC: 1,
        EM: `Delete image having id=${publicId} successfully`,
      };
    } catch (error) {
      console.log("Error111", error);
      return handleError(error);
    }
  };
  uploadImages = async (
    file: File,
  ): Promise<{
    EC: number;
    EM: any;
    ST: number;
    DT?: UploadApiResponse;
  }> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const optimizedBuffer = await sharp(buffer)
        .resize({ width: 800, withoutEnlargement: true })
        .webp({ quality: 25 })
        .toBuffer();
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "temp",
          },
          (error, result) => {
            if (error) {
              reject({
                EC: 1,
                EM: "Image upload failed",
                ST: 200,
              });
            } else {
              resolve({
                EC: 0,
                EM: "Image upload successfully",
                ST: 200,
                DT: result!,
              });
            }
          },
        );
        uploadStream.end(optimizedBuffer);
      });
    } catch (error) {
      console.log("Error111", error);
      throw new Error(`Image upload failed: ${error}`);
    }
  };
}
export default new CloudinaryService();
