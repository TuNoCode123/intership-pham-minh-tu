import { createIndexFulltextSearch } from "./product.model.js";

async function setupDatabase() {
  const models = [
    import("./user.model.js"),
    import("./product.model.js"),
    import("./order.model.js"),
    import("./order_items.model.js"),
  ];

  try {
    for (const modelPromise of models) {
      const model = await modelPromise;
      if (model.default && typeof model.default === "function") {
        await model.default();
      } else {
        console.warn(
          "Model module does not export a default function:",
          modelModule
        );
      }
    }
    // await createIndexFulltextSearch("products", [
    //   "name",
    //   "description",
    //   "category",
    // ]);

    console.log("All models have been created successfully.");
  } catch (error) {
    console.error("Error creating models:", error.message);
  }
}
export default setupDatabase;
