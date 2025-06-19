export const fetchPaginatedData = async (
  dbModel: any,
  limit: number,
  startId: number,
  type: "after" | "before",
  options?: object,
  conditionExtra?: object,
  orders?: any,
  skip?: number,
) => {
  const data = orders
    ? await dbModel.findMany({
        skip: skip,
        take: +limit,
        where: {
          ...conditionExtra,
        },
        ...options,
        orderBy: orders ? [orders, { id: "desc" }] : [{ id: "desc" }],
      })
    : type == "before"
      ? await dbModel.findMany({
          take: +limit,
          where: {
            id: {
              lt: +startId,
            },
            ...conditionExtra,
          },
          ...options,
          orderBy: [{ id: "desc" }],
        })
      : await dbModel.findMany({
          take: +limit,
          where: {
            id: {
              gt: +startId,
            },
            ...conditionExtra,
          },
          ...options,
        });
  const isNextRecords = await dbModel.findMany({
    skip: skip ? skip + 3 : 0,
    take: +limit,
    where: {
      ...conditionExtra,
    },
    ...options,
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
          ? await dbModel.findFirst({
              where: {
                id: {
                  gt: +data[0].id,
                },
                ...conditionExtra,
              },
              ...options,
            })
          : await dbModel.findFirst({
              where: {
                id: {
                  gt: +data[data.length - 1].id,
                },
                ...conditionExtra,
              },
              ...options,
            })
      : false;

  const isPreviousPage =
    data.length > 0
      ? orders
        ? isRunOutOfRecordPrevious
        : type == "before"
          ? await dbModel.findFirst({
              where: {
                id: {
                  lt: +data[data.length - 1]?.id,
                },
                ...conditionExtra,
              },
              ...options,
            })
          : await dbModel.findFirst({
              where: {
                id: {
                  lt: +data[0]?.id,
                },
                ...conditionExtra,
              },
              ...options,
            })
      : false;
  let cloneDeepData = JSON.parse(JSON.stringify(data));
  if (!orders && type == "before") {
    cloneDeepData = cloneDeepData.sort((a: any, b: any) => {
      return a.id - b.id;
    });
  }
  return {
    data: cloneDeepData,
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
