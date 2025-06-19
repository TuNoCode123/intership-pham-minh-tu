import { ActionFunctionArgs, json } from "@remix-run/node";
import cloudinaryService from "app/services/cloudinary-service";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const files = formData.getAll("images") as File[];
  const customerId = formData.get("customer_id") as string;
  const productId = formData.get("product_id") as string;
  if (!customerId || !productId) {
    return json({ error: "error input" }, { status: 400 });
  }

  if (!files || files.length == 0) {
    return json({ error: "No file uploaded" }, { status: 400 });
  }
  const result = await Promise.all(
    files.map(async (file: File) => {
      try {
        const res = await cloudinaryService.uploadToCloudinary(
          file,
          file.name,
          customerId,
          productId,
        );
        return res.DT;
      } catch (err) {
        console.error("Upload failed for file:", file.name);
        return null;
      }
    }),
  );
  return json({ DT: result.filter((url) => !!url?.url) });
};
