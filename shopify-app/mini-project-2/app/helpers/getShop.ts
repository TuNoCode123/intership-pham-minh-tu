import db from "../db.server";
export const getShop = async (domain: string) => {
  try {
    const res = await db.shop.findFirst({
      where: {
        domain,
      },
    });
    return res?.id;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};
