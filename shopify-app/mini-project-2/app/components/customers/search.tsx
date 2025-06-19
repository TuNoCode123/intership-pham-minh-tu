import { useSearchParams } from "@remix-run/react";
import { TextField } from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";

function Search() {
  const [value, setValue] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const handleChange = useCallback(
    (newValue: string) => {
      setValue(newValue);
      const params = Object.fromEntries(searchParams);
      delete params.skip;
      if (!newValue) {
        delete params.query;
      } else {
        params.query = newValue;
      }

      setSearchParams(params);
    },
    [searchParams, setSearchParams],
  );
  useEffect(() => {
    setValue(searchParams.get("query") || "");
  }, [searchParams, setSearchParams]);
  return (
    <TextField
      label="Search"
      value={value}
      onChange={handleChange}
      placeholder="Search by firstName or lastName or email"
      autoComplete="off"
    />
  );
}

export default Search;

//
