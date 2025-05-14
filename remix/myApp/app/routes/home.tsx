import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, Link, useLoaderData, useSearchParams } from "@remix-run/react";
import {
  Page,
  Grid,
  Pagination,
  Text,
  Button,
  TextField,
} from "@shopify/polaris";
import { useCallback, useEffect, useMemo, useState } from "react";
import pkg from "lodash";
const { debounce } = pkg;

import Product from "~/components/products/product";
import { api } from "~/constants/api";
import useProduct from "~/hooks/useProduct";
export const meta: MetaFunction = () => {
  return [
    { title: "My App" },
    { name: "description", content: "Welcome to My App!" },
  ];
};
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") || 1;
  const limit = url.searchParams.get("limit") || 6;
  const search = url.searchParams.get("search");
  const data = search
    ? await fetch(
        `${api.getAllProduct}?page=${page}&limit=${limit}&search=${search}`
      )
    : await fetch(`${api.getAllProduct}?page=${page}&limit=${limit}`);
  const res = await data.json();
  const { EC, DT } = res;
  const { total: TotalProduct, data: products } = DT;
  if (EC == 0) return json({ products, TotalProduct, page, limit });
  else return json({ products: [], TotalProduct: 0, page, limit });
};
export default function Index() {
  const { products, TotalProduct, page, limit } =
    useLoaderData<typeof loader>();
  const { loadingDataToContext, products: ProductState } = useProduct();

  const [searchParams, setSearchParams] = useSearchParams();

  const totalPages =
    TotalProduct % +limit == 0
      ? TotalProduct / +limit
      : Math.ceil(TotalProduct / +limit);
  const handlePrevious = () => {
    const newPage = Math.max(+page - 1, 1);
    setSearchParams({ page: newPage.toString(), limit: limit.toString() });
  };

  const handleNext = () => {
    const newPage = Math.min(+page + 1, totalPages);
    setSearchParams({ page: newPage.toString(), limit: limit.toString() });
  };
  const [search, setSearch] = useState("");
  const debouncedSetSearchParams = useMemo(
    () =>
      debounce((value: string) => {
        setSearchParams({
          page: "1",
          limit: limit.toString(),
          search: value,
        });
      }, 500),
    [setSearchParams, limit]
  );
  const hanlderSearchChange = useCallback(
    (value: string) => {
      setSearch(value);
      debouncedSetSearchParams(value);
    },
    [setSearch, debouncedSetSearchParams]
  );
  useEffect(() => {
    loadingDataToContext(products);
  }, [searchParams]);
  return (
    <div>
      <div className=" text-5xl text-center font-bold mt-5 cursor-pointer">
        <div className=" flex justify-center gap-5">
          <Link to="/cart">
            <Button size="large">Cart</Button>
          </Link>
          <Link to="/product">
            <Button size="large" tone="success">
              Manage Product
            </Button>
          </Link>
        </div>

        <div className=" flex w-1/2 gap-5 justify-center items-end mx-auto">
          <div className=" w-full">
            <TextField
              value={search}
              onChange={hanlderSearchChange}
              label="Search"
              type="email"
              autoComplete="email"
            />
          </div>
          <div>
            <Button size="large">Search</Button>
          </div>
        </div>
      </div>
      <Page fullWidth>
        <Grid>
          {ProductState?.map((item: any, index: number) => {
            return (
              <>
                <Grid.Cell
                  columnSpan={{ xs: 3, sm: 3, md: 3, lg: 3, xl: 4 }}
                  key={index}
                >
                  <Product
                    price={item.price}
                    name={item.name}
                    description={item.description}
                    stock={item.stock}
                    id={item.id}
                  />
                </Grid.Cell>
              </>
            );
          })}
        </Grid>
        <div className=" mt-5 flex justify-center">
          <div>
            <Pagination
              hasPrevious={+page > 1}
              onPrevious={handlePrevious}
              hasNext={+page < +totalPages}
              onNext={handleNext}
            />
            <Text variant="bodyMd" as="span">
              Page {page} of {totalPages}
            </Text>
          </div>
        </div>
      </Page>
    </div>
  );
}
