import db from "../db.server";
export const fetchPaginatedDataCustomer = async (
  limit: number,
  startId: number,
  type: "after" | "before",

  query?: string,
  orders?: any,
  skip?: number,
) => {
  const orderClause = orders ? [orders] : [];
  // console.log("type", type);
  const data = orders
    ? await db.customers.findMany({
        skip: skip,
        take: +limit,
        where: {
          OR: [
            { firstName: { contains: query ? query : "" } },
            { lastName: { contains: query ? query : "" } },
          ],
        },
        include: {
          total_point: {
            select: {
              total_points: true,
            },
          },
        },
        orderBy: orders ? [orders, { id: "desc" }] : [{ id: "desc" }],
      })
    : type == "before"
      ? await db.customers.findMany({
          take: +limit,
          where: {
            id: {
              lt: +startId,
            },
            OR: [
              { firstName: { contains: query ? query : "" } },
              { lastName: { contains: query ? query : "" } },
            ],
          },
          include: {
            total_point: {
              select: {
                total_points: true,
              },
            },
          },
          orderBy: [{ id: "desc" }],
        })
      : await db.customers.findMany({
          take: +limit,
          where: {
            id: {
              gt: +startId,
            },
            OR: [
              { firstName: { contains: query ? query : "" } },
              { lastName: { contains: query ? query : "" } },
            ],
          },
          include: {
            total_point: {
              select: {
                total_points: true,
              },
            },
          },
          // orderBy: orderClause,
        });
  const isNextRecords = await db.customers.findMany({
    skip: skip ? skip + 3 : 0,
    take: +limit,
    where: {
      OR: [
        { firstName: { contains: query ? query : "" } },
        { lastName: { contains: query ? query : "" } },
      ],
    },
    include: {
      total_point: {
        select: {
          total_points: true,
        },
      },
    },
    orderBy: orders ? [orders, { id: "desc" }] : [{ id: "desc" }],
  });
  const isRunOutOfRecords =
    data.length < limit
      ? false
      : isNextRecords && isNextRecords.length <= 0
        ? false
        : true;
  const isRunOutOfRecordPrevious = skip
    ? skip - limit >= 0
      ? true
      : false
    : false;

  const isNextPage =
    data.length > 0
      ? orders
        ? isRunOutOfRecords
        : type == "before"
          ? await db.customers.findFirst({
              where: {
                id: {
                  gt: +data[0].id,
                },
                OR: [
                  { firstName: { contains: query ? query : "" } },
                  { lastName: { contains: query ? query : "" } },
                ],
              },
              include: {
                total_point: {
                  select: {
                    total_points: true,
                  },
                },
              },
            })
          : await db.customers.findFirst({
              where: {
                id: {
                  gt: +data[data.length - 1].id,
                },
                OR: [
                  { firstName: { contains: query ? query : "" } },
                  { lastName: { contains: query ? query : "" } },
                ],
              },
              include: {
                total_point: {
                  select: {
                    total_points: true,
                  },
                },
              },
            })
      : false;

  const isPreviousPage =
    data.length > 0
      ? orders
        ? isRunOutOfRecordPrevious
        : type == "before"
          ? await db.customers.findFirst({
              where: {
                id: {
                  lt: +data[data.length - 1]?.id,
                },
                OR: [
                  { firstName: { contains: query ? query : "" } },
                  { lastName: { contains: query ? query : "" } },
                ],
              },
              include: {
                total_point: {
                  select: {
                    total_points: true,
                  },
                },
              },
            })
          : await db.customers.findFirst({
              where: {
                id: {
                  lt: +data[0]?.id,
                },
                OR: [
                  { firstName: { contains: query ? query : "" } },
                  { lastName: { contains: query ? query : "" } },
                ],
              },
              include: {
                total_point: {
                  select: {
                    total_points: true,
                  },
                },
              },
            })
      : false;

  return {
    data,
    cursor: {
      isNextPage: !!isNextPage,
      nextId:
        data.length > 0
          ? type == "before"
            ? data[0].id
            : data[data.length - 1].id
          : 0,
      previousId:
        data.length > 0
          ? type == "before"
            ? data[data.length - 1]?.id
            : data[0]?.id
          : 0,
      isPreviousPage: !!isPreviousPage,
    },
  };
};
