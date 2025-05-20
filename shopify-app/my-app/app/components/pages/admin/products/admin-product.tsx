import {
  useFetcher,
  useMatch,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import _, { set } from "lodash";
import {
  Page,
  LegacyCard,
  DataTable,
  Filters,
  TextField,
  ChoiceList,
  Thumbnail,
  SkeletonPage,
  Layout,
  SkeletonBodyText,
  Spinner,
} from "@shopify/polaris";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SortKey } from "app/routes/api.product";
import invariant from "tiny-invariant";
import { NoteIcon } from "@shopify/polaris-icons";
interface IEdgeImage {
  node: {
    id: string;
    altText: string;
    originalSrc: string;
    transformedSrc: string;
  };
}
interface INodeProduct {
  id: string;
  title: string;
  handle: string;
  images: {
    edges: IEdgeImage[];
  };
  description: string;
}
interface IEdgeproduct {
  node: INodeProduct;
  cursor: string;
}
interface IpageInfor {
  hasPreviousPage: false;
  startCursor: string;
  hasNextPage: true;
  endCursor: string;
}
export interface Iproduct {
  edges: IEdgeproduct[];
  pageInfo: IpageInfor;
}
enum statePaginate {
  BEFORE = "before",
  AFTER = "after",
}
function DataTableWithPaginationExample() {
  const fetcher = useFetcher();
  const [products, setProducts] = useState<IEdgeproduct[]>([]);
  const [pageInfor, setPageInfor] = useState<IpageInfor>();
  const [availability, setAvailability] = useState<string[]>([]);
  const [sort, setSort] = useState<string>("");
  const [queryValue, setQueryValue] = useState("");
  const [first, setFirst] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  // const [previousCursor, setPriviousCursor] = useState(currentCursor);

  const handleAvailabilityChange = useCallback((value: string[]) => {
    searchParams.delete("after");
    searchParams.delete("before");
    setSearchParams(searchParams);
    // setPriviousCursor(undefined);
    setSort(value[0]);
    setAvailability(value);
  }, []);
  const handleSearch = useCallback((filter: string, search: string) => {
    fetchListProduct(search, filter);
  }, []);
  const debouncedSearch = useMemo(() => _.debounce(handleSearch, 200), []);
  const handleFiltersQueryChange = useCallback(
    (value: string) => {
      setQueryValue(value);
    },
    [sort, queryValue],
  );

  const fetchListProduct = async (
    search?: string,
    filter?: string,
    afterCursor?: string,
    beforeCursor?: string,
    state?: statePaginate,
    previousPageInfor?: IpageInfor,
  ) => {
    try {
      // console.log("previousPageInfor222", previousPageInfor);
      setLoading(true);
      let query = `/api/product`;
      let cnt = false;
      if (search && filter) {
        cnt = true;
        query += `?search=${search}&sortKey=${filter}`;
      }
      if (search && !filter) {
        cnt = true;
        query += `?search=${search}`;
      }
      if (filter && !search) {
        cnt = true;
        query += `?sortKey=${filter}`;
      }

      if (afterCursor) {
        query += cnt ? `&after=${afterCursor}` : `?after=${afterCursor}`;
      }
      if (beforeCursor) {
        query += cnt ? `&before=${beforeCursor}` : `?before=${beforeCursor}`;
      }

      // console.log("Query", query);
      const response = await fetch(query, {
        method: "POST",
      });

      // invariant(response.ok, "Error fetching data");

      const data = await response.json();

      const { edges, pageInfo } = data;
      setProducts(edges);
      setPageInfor(pageInfo);

      // if (_.isEmpty(previousPageInfor)) {
      //   setPriviousPageInfor(pageInfo);
      //   return;
      // }

      if (state == statePaginate.BEFORE) {
        if (previousPageInfor) {
          searchParams.delete("after");
          searchParams.set("before", previousPageInfor?.startCursor);
          setSearchParams(searchParams);
        }
        // setCurrentCursor(pageInfo.startCursor);
      } else {
        if (previousPageInfor) {
          searchParams.delete("before");
          searchParams.set("after", previousPageInfor?.endCursor);
          setSearchParams(searchParams);
        }
        // setCurrentCursor(pageInfo.endCursor);
      }

      // setSearchParams(searchParams);
      // searchParams.set("after", pageInfo.startCursor);
      // searchParams.set("before",pageInfo.startCursor);
      // setSearchParams(searchParams); // cập nhật URL
      // setData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  // useEffect(() => {
  //   if (previousCursor) {
  //     if (state === statePaginate.AFTER) {
  //       searchParams.delete("before");
  //       searchParams.set("after", previousCursor);
  //     }
  //     if (state === statePaginate.BEFORE) {
  //       searchParams.delete("after");
  //       searchParams.set("before", previousCursor);
  //     }

  //     setSearchParams(searchParams);
  //   }
  // }, [previousCursor, state]);
  const headings = useMemo(() => {
    const product = products.length > 0 ? products[0] : null;
    if (!product) return [];

    const { node } = product;
    const keys = Object.keys(node);
    const heading = keys.filter((key) => key !== "images" && key !== "id");

    return ["image", ...heading];
  }, [products]);

  useEffect(() => {
    const getAfter = searchParams.get("after") ?? "";
    const getBefore = searchParams.get("before") ?? "";

    if (getAfter) {
      console.log("1");
      fetchListProduct(
        undefined,
        undefined,
        getAfter,
        undefined,
        statePaginate.AFTER,
      );
    } else if (getBefore) {
      console.log("2");
      fetchListProduct(
        undefined,
        undefined,
        undefined,
        getBefore,
        statePaginate.BEFORE,
      );
    } else {
      fetchListProduct();
    }

    setFirst(true);
  }, []);
  useEffect(() => {
    if (first) debouncedSearch(sort, queryValue);
  }, [sort, queryValue]);
  const rows = products.map((product) => {
    const {
      node: { images, id, ...restNode },
    } = product;

    const value = Object.values(restNode);
    if (images?.edges?.length > 0) {
      return [
        <div>
          <Thumbnail
            source={images.edges[0].node.originalSrc}
            size="medium"
            alt="Black choker necklace"
          />
        </div>,
        ...value,
      ];
    }
    return [
      <div>
        <Thumbnail source={NoteIcon} size="medium" alt="Small document" />;
      </div>,
      ...value,
    ];
  });
  const handleAvailabilityRemove = useCallback(() => setAvailability([]), []);
  const handleQueryValueRemove = useCallback(() => setQueryValue(""), []);
  const handleFiltersClearAll = useCallback(() => {
    handleAvailabilityRemove();
    handleQueryValueRemove();
    fetchListProduct();
  }, [handleAvailabilityRemove, handleQueryValueRemove]);
  const filters = [
    {
      key: "Title",
      label: "Title",
      filter: (
        <ChoiceList
          title="Title"
          titleHidden
          choices={[
            { label: "Name A → Z", value: SortKey.TITLE_ASC },
            { label: "Name Z → A", value: SortKey.TITLE_DESC },
          ]}
          selected={availability || []}
          onChange={handleAvailabilityChange}
        />
      ),
      shortcut: true,
    },
  ];
  const appliedFilters = [];
  if (!isEmpty(availability)) {
    const key = "availability";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, availability),
      onRemove: handleAvailabilityRemove,
    });
  }

  return (
    <Page title="Sales by product">
      <LegacyCard>
        <Filters
          queryValue={queryValue}
          queryPlaceholder="Search items"
          filters={filters}
          appliedFilters={appliedFilters}
          onQueryChange={handleFiltersQueryChange}
          onQueryClear={handleQueryValueRemove}
          onClearAll={handleFiltersClearAll}
        />
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              height: "200px",
              alignItems: "center",
            }}
          >
            <Spinner accessibilityLabel="Spinner example" size="large" />
          </div>
        ) : (
          <>
            <DataTable
              columnContentTypes={["text", "numeric", "numeric", "numeric"]}
              headings={[...headings]}
              rows={rows}
              pagination={{
                hasNext: pageInfor?.hasNextPage,
                hasPrevious: pageInfor?.hasPreviousPage,
                onNext: async () => {
                  // console.log("---------------------->", pageInfor);
                  // setPriviousPageInfor(pageInfor);
                  // setState(statePaginate.AFTER);
                  await fetchListProduct(
                    undefined,
                    undefined,
                    pageInfor?.endCursor,
                    undefined,
                    statePaginate.AFTER,
                    pageInfor,
                  );
                },
                onPrevious: async () => {
                  // setPriviousPageInfor(pageInfor);
                  // await setState(statePaginate.BEFORE);
                  await fetchListProduct(
                    undefined,
                    undefined,
                    undefined,
                    pageInfor?.startCursor,
                    statePaginate.BEFORE,
                    pageInfor,
                  );
                },
              }}
            />
          </>
        )}
      </LegacyCard>
    </Page>
  );
  function disambiguateLabel(key: string, value: string[]): string {
    switch (key) {
      case "taggedWith":
        return `Tagged with ${value}`;
      case "availability":
        return value.map((val) => `Available on ${val}`).join(", ");
      case "productType":
        return value.join(", ");
      default:
        return value.toString();
    }
  }

  function isEmpty(value: string | string[]): boolean {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === "" || value == null;
    }
  }
}

export default DataTableWithPaginationExample;
