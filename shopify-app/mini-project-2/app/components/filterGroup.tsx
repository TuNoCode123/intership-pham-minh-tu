import { useNavigate, useSearchParams } from "@remix-run/react";
import { Icon, Select } from "@shopify/polaris";
import { ShieldNoneIcon } from "@shopify/polaris-icons";
import { POINT } from "app/constrant/enum";
import { useState, useCallback, useEffect, ReactNode } from "react";

function FilterGroup({
  options,
}: {
  options: {
    label: any;
    value: string;
    prefix?: ReactNode;
  }[];
}) {
  const [selected, setSelected] = useState("L4");
  const [searchParams, setSearchParams] = useSearchParams();
  const handleSelectChange = useCallback(
    (value: string) => {
      setSelected(value);
      const params = Object.fromEntries(searchParams);
      if (value == "L4") {
        delete params.skip;
        delete params.group;
        setSearchParams(params);
        return;
      }

      params.group = value;
      delete params.skip;
      setSearchParams(params);
    },
    [searchParams, setSearchParams],
  );
  useEffect(() => {
    const value = searchParams.get(POINT.GROUP);
    if (value) {
      setSelected(value);
    }
  }, [searchParams, setSearchParams, selected]);

  return (
    <Select
      label="Group"
      options={options}
      onChange={handleSelectChange}
      value={selected}
    />
  );
}
export default FilterGroup;
