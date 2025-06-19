import { AppError, handleError } from "app/helpers/error";
import db from "../db.server";
import { ReviewType } from "app/validates/reviews";
import { fetchPaginatedData } from "app/helpers/pagination";
import { Ireviews } from "app/interfaces/reviews";
import { CursorType } from "app/validates/point";
import redisService from "./redis-service";
import { Iresponse } from "app/interfaces/api";
import cloudinaryService from "./cloudinary-service";
import { REASON } from "app/constrant/record";
class ReviewService {
  async createReview(
    reviewData: ReviewType & {
      id?: number;
      urls?: {
        url: string;
        publicId: string;
      }[];
      shopId: string;
    },
  ) {
    try {
      const isExistedUser = db.customers.findUnique({
        where: {
          customerId: reviewData.customer_id,
          shopId: reviewData.shopId,
        },
      });

      const [userResult] = await Promise.all([isExistedUser]);
      if (!userResult) {
        throw new AppError("user  not found", 404);
      }
      // const { id, customer_id, images, urls, ...restObject } = reviewData;
      const { id, customer_id, images, urls, ...restObject } = reviewData;
      const idValid = id ? id : -1;
      const rs = await db.$transaction(async (prismaTx) => {
        const res = await prismaTx.reviews.upsert({
          where: {
            id: idValid,
          },
          create: {
            ...restObject,
            customer_id: userResult.id,
            shopId: reviewData.shopId,
          },
          update: {
            ...restObject,
            customer_id: userResult.id,
          },
        });
        let listFuncAsync = [];
        if (urls) {
          const createReviewImage = prismaTx.reviews_Image.createMany({
            data: urls?.map((item) => ({
              reviewsId: res.id,
              image: item.url,
              imageId: item.publicId,
            })),
          });
          listFuncAsync.push(createReviewImage);
        }
        const orderNumbeUpdate = prismaTx.orderNumber.update({
          where: {
            customerId_productId: {
              customerId: userResult.id,
              productId: reviewData.product_id,
            },
          },
          data: {
            purchaseNumber: {
              decrement: 1,
            },
          },
        });
        await Promise.all([orderNumbeUpdate, ...listFuncAsync]);
        return res;
      });

      return {
        EC: 0,
        EM:
          idValid != -1
            ? "UPDATE REVIEW SUCCESSFULLY"
            : "CREATE REVIEW SUCCESSFULLY",
        DT: rs,
        ST: 200,
      };
    } catch (error) {
      return handleError(error);
    }
  }

  async getReviewsByProductId({
    productId,
    lastId,
    limit,
    typeCursor,
    orderBy,
    skip,
    group,
  }: {
    productId: string;
    lastId?: any;
    limit?: any;
    typeCursor: "after" | "before";
    orderBy?: string | null;
    skip?: number;
    group?: string | null;
  }) {
    try {
      const id = lastId && lastId != "undefined" ? lastId : 0;
      const numbeRecords = limit ? limit : (process.env.LIMIT ?? 5);
      const groupClause = {} as any;

      if (group && group != "none") {
        const keyArr = group.split("-");
        const key = keyArr.length > 0 ? keyArr[0] : "";
        const value = keyArr.length > 0 ? keyArr[1] : "";
        if (key == "review") {
          if (value == "noImage") {
            groupClause["images"] = {
              none: {},
            };
          } else {
            groupClause["images"] = {
              some: {},
            };
          }
        } else {
          groupClause[key] = {
            equals: key == "rating" ? +value : value === "true",
          };
        }
      }
      // db.reviews.findMany({
      //   include: {
      //     images: {
      //       where: {
      //         imageId: {
      //           not: undefined,
      //         },
      //       },
      //     },
      //   },
      // });
      const data = fetchPaginatedData(
        db.reviews,
        numbeRecords,
        id,
        typeCursor,
        {
          include: {
            images: {
              select: {
                image: true,
                imageId: true,
              },
            },
            customers: {
              select: {
                firstName: true,
                lastName: true,
                created_at: true,
                customerId: true,
              },
            },
          },
        },
        {
          product_id: productId,
          approved: true,
          ...groupClause,
        },
        orderBy && orderBy != "none"
          ? orderBy == "desc"
            ? { created_at: "desc" }
            : { created_at: "asc" }
          : undefined,
        skip,
      );
      const totalPage = db.reviews.count({
        where: {
          product_id: productId,
          approved: true,
          ...groupClause,
        },
      });
      const [dataResult, PagesResult] = await Promise.all([data, totalPage]);
      return {
        EC: 0,
        EM: "Get Reviews By Product Id Successfully",
        DT: {
          ...dataResult,
          totalPages: PagesResult,
        },
        ST: 200,
      };
    } catch (error) {
      return handleError(error);
    }
  }
  async getAllReviews({
    limit,
    typeCursor,
    lastId,
    query,
    orderBy,
    skip,
    group,
    shopId,
  }: {
    typeCursor: "after" | "before";
    limit: any;
    lastId: any;
    query?: string;
    orderBy?: string | null;
    skip?: number;
    group?: string;
    shopId?: string;
  }): Promise<{
    EC: number;
    EM: any;
    ST: number;
    DT?: {
      data: Ireviews[];
      cursor: CursorType;
    };
  }> {
    try {
      const validLimit = limit && limit > 0 ? limit : (process.env.LIMIT ?? 5);
      const id = lastId ?? 0;
      const newQuery = query ? query : "";
      const groupClause = {} as any;
      if (group) {
        const keyArr = group.split("-");
        const key = keyArr.length > 0 ? keyArr[0] : "";
        const value = keyArr.length > 0 ? keyArr[1] : "";

        groupClause[key] = {
          equals: key == "rating" ? +value : value === "true",
        };
      }

      const data = await fetchPaginatedData(
        db.reviews,
        +validLimit,
        id,
        typeCursor,
        {
          select: {
            id: true,
            product_id: true,
            customer_id: true,
            rating: true,
            approved: true,
            created_at: true,
            award: true,
            customers: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                customerId: true,
              },
            },
          },
        },
        {
          shopId,
          customers: {
            OR: [
              { firstName: { contains: newQuery } },
              { lastName: { contains: newQuery } },
              { email: { contains: newQuery } },
            ],
          },
          ...groupClause,
        },
        orderBy
          ? orderBy == "newest"
            ? { created_at: "desc" }
            : orderBy == "odest"
              ? { created_at: "asc" }
              : { rating: orderBy }
          : undefined,
        skip,
      );
      return {
        EC: 0,
        EM: "Get Reviews Successfully",
        DT: data,
        ST: 200,
      };
    } catch (error) {
      return handleError(error);
    }
  }
  async getDetailReview(id: number) {
    try {
      const key = `review-${id}`;
      const getCachedData = (await redisService.getKey(
        key,
      )) as Iresponse<string>;
      if (getCachedData && getCachedData.EC == 0) {
        return {
          EC: 0,
          EM: "Get Detail Review Successfully",
          DT: JSON.parse(getCachedData.DT ?? ""),
          ST: 200,
        };
      }

      const res = await db.reviews.findUnique({
        where: {
          id,
        },
        include: {
          customers: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          images: {
            select: {
              image: true,
              imageId: true,
            },
          },
        },
      });
      await redisService.setKey({
        key,
        value: JSON.stringify(res),
        time: 3600,
      });

      return {
        EC: 0,
        EM: "Get Detail Review Successfully",
        DT: res ?? [],
        ST: 200,
        // LC: Location_Api.DETAIL_REVIEW,
      };
    } catch (error) {
      return handleError(error);
    }
  }
  async changeStateReviews({
    idReview,
    state,
    rating,
    customerId,
    shopId,
  }: {
    idReview: number;
    state: boolean;
    rating: number;
    customerId: number;
    shopId: string;
  }) {
    try {
      const isExistedUser = db.customers.findUnique({
        where: {
          id: customerId,
          shopId,
        },
      });

      const getAward = db.reviewAward.findFirst({
        where: {
          startNumber: {
            equals: rating,
          },
          shopId,
        },
      });
      const [userResult, awardResult] = await Promise.all([
        isExistedUser,
        getAward,
      ]);
      if (!userResult || !awardResult) {
        throw new AppError("user or award not found", 404);
      }

      await db.$transaction(async (prismaTx) => {
        const res = await prismaTx.reviews.update({
          where: {
            id: idReview,
          },
          data: {
            approved: state,
            award: state ? awardResult.point : 0,
          },
        });
        const changeAmount = res.approved
          ? awardResult.point
          : -awardResult.point;
        const upsertPoint = prismaTx.points.upsert({
          where: {
            customerId: userResult.id,
          },
          create: {
            total_points: awardResult.point,
            customerId: userResult.id,
          },
          update: {
            total_points: {
              increment: changeAmount,
            },
          },
        });
        let asyncFunc = [];
        if (!state) {
          const updateOrderNumber = prismaTx.orderNumber.update({
            where: {
              customerId_productId: {
                customerId: userResult.id,
                productId: res.product_id,
              },
            },
            data: {
              purchaseNumber: {
                increment: 1,
              },
            },
          });
          asyncFunc.push(updateOrderNumber);
        } else {
          const pointLog = prismaTx.point_Logs.create({
            data: {
              type: "L7",
              reason: REASON["REVIEWS"],
              customerId: userResult.id,
              amount: awardResult.point ?? 0,
              shopId,
            },
          });
          asyncFunc.push(pointLog);
        }

        await Promise.all([upsertPoint, ...asyncFunc]);
      });
      const res = await redisService.deleteKey(`review-${idReview}`);
      if (res.EC == 1) {
        console.log("Error at clear caching");
      }
      return {
        EC: 0,
        EM: "Change state successfully",
        ST: 200,
        // LC: Location_Api.CHANGE_REVIEW_STATE,
      };
    } catch (error) {
      return handleError(error);
    }
  }
  async deleteReview(id: number) {
    try {
      console.log("reviewId", id);
      const result = await db.$transaction(async (prismaTx) => {
        await prismaTx.reviews_Image.deleteMany({
          where: { reviewsId: id },
        });
        const res = await prismaTx.reviews.delete({
          where: {
            id,
          },
          include: {
            images: true,
          },
        });
        console.log("res1111", res);

        await prismaTx.orderNumber.update({
          where: {
            customerId_productId: {
              customerId: res.customer_id,
              productId: res.product_id,
            },
          },
          data: {
            purchaseNumber: {
              increment: 1,
            },
          },
        });
        // await Promise.all([deleteImage, updateOrderNumber]);
        return res;
      });
      const keys = `review-${id}`;
      await Promise.all([
        ...result.images.map((item) =>
          cloudinaryService.deleteImageFromCloudinary(item.imageId),
        ),
        ,
        redisService.deleteKey(keys),
      ]);

      return {
        EC: 0,
        EM: "Delete Review Successfully",
        ST: 200,
      };
    } catch (error) {
      return handleError(error);
    }
  }
  async getOverviewProduct(productId: number) {
    try {
      const listRating = {
        "1": 1,
        "2": 2,
        "3": 3,
        "4": 4,
        "5": 5,
      } as any;
      const result = await db.reviews.groupBy({
        by: ["rating"],
        _count: {
          _all: true,
        },
        where: {
          product_id: `gid://shopify/Product/${productId}`,
          approved: true,
        },
        orderBy: {
          rating: "asc",
        },
      });
      let total_star = 0,
        review_number = 0;
      const convertArr = result.map((item) => {
        const {
          rating,
          _count: { _all },
        } = item;
        delete listRating[`${rating}`];
        total_star += rating * _all;
        review_number += _all;
        return {
          star: rating,
          reviewNumber: _all,
        };
      });
      const getValues = Object.values(listRating).map((item) => {
        return {
          star: item as number,
          reviewNumber: 0,
        };
      });

      return {
        EC: 0,
        EM: "Get Overview Product Successfully",
        DT: {
          listStar: [...convertArr, ...getValues].sort(
            (a, b) => a.star - b.star,
          ),
          avg_star: +(total_star / review_number).toFixed(2),
          total_reviews: review_number,
        },
        ST: 200,
      };
    } catch (error) {
      return handleError(error);
    }
  }
}
export default new ReviewService();
