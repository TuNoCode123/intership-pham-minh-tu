import { useNavigate, useSearchParams } from "@remix-run/react";
import { Icon, Select } from "@shopify/polaris";
import {
  CaretUpIcon,
  CaretDownIcon,
  ShieldNoneIcon,
  FlipHorizontalIcon,
} from "@shopify/polaris-icons";
import { POINT } from "app/constrant/enum";
import { useState, useCallback, useEffect, ReactNode } from "react";

function FilterCustomerForPoints({
  filters,
}: {
  filters?: {
    label: string;
    value: string;
    prefix: ReactNode;
  }[];
}) {
  const [selected, setSelected] = useState("none");
  const [searchParams, setSearchParams] = useSearchParams();
  const handleSelectChange = useCallback(
    (value: string) => {
      setSelected(value);
      const params = Object.fromEntries(searchParams);
      if (value == "none") {
        delete params.orderBy;
        delete params.skip;
        setSearchParams(params);
        return;
      }
      params.orderBy = value;
      delete params.skip;
      setSearchParams(params);
    },
    [searchParams, setSearchParams],
  );
  useEffect(() => {
    const value = searchParams.get(POINT.ORDER_BY);
    if (value) {
      setSelected(value);
    } else {
      setSelected("none");
    }
  }, [searchParams, setSearchParams, selected]);
  const options = [
    {
      label: "Increase",
      value: "asc",
      prefix: <Icon source={CaretUpIcon} />,
    },
    {
      label: "Decrease",
      value: "desc",
      prefix: <Icon source={CaretDownIcon} />,
    },
    {
      label: "Newest",
      value: "newest",
      prefix: <Icon source={FlipHorizontalIcon} />,
    },
    {
      label: "Odest",
      value: "odest",
      prefix: <Icon source={FlipHorizontalIcon} />,
    },
    {
      label: "NONE",
      value: "none",
      prefix: <Icon source={ShieldNoneIcon} />,
    },
    ...(filters ?? []),
  ];

  return (
    <Select
      label="Sort"
      options={options}
      onChange={handleSelectChange}
      value={selected}
    />
  );
}
export default FilterCustomerForPoints;
