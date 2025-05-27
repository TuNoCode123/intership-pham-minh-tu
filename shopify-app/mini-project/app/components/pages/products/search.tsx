import { useSearchParams } from "@remix-run/react";
import { Autocomplete, Icon } from "@shopify/polaris";
import { SearchIcon } from "@shopify/polaris-icons";
import { ENUM_PARAMS } from "app/constraints/params";
import { IOption } from "app/routes/app.products";
import _ from "lodash";
import { useState, useCallback, useMemo, useEffect } from "react";
interface IsearchProps {
  options: IOption[];
}
export default function SearchProduct({
  options: productOptions,
}: IsearchProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState(
    searchParams.get(ENUM_PARAMS.SEARCH) || "",
  );
  const deselectedOptions = productOptions.slice(0, 3);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const [options, setOptions] = useState(deselectedOptions);

  const updateText = useCallback((value: string) => {
    setInputValue(value);
    if (value === "") {
      setOptions(deselectedOptions);
      return;
    }

    const filterRegex = new RegExp(value, "i");
    const resultOptions = productOptions.filter((option) =>
      option.label.match(filterRegex),
    );
    setOptions(resultOptions);
  }, []);

  const updateSelection = useCallback(
    (selected: string[]) => {
      const selectedValue = selected.map((selectedItem) => {
        const matchedOption = options.find((option) => {
          return option.value.match(selectedItem);
        });
        return matchedOption && matchedOption.label;
      });
      setSelectedOptions(selected);
      setInputValue(selectedValue[0] || "");
    },
    [options],
  );
  // Trong component
  const searchFunction = useCallback(
    (input: string) => {
      if (input === "") {
        searchParams.delete(ENUM_PARAMS.AFTER);
        searchParams.delete(ENUM_PARAMS.BEFORE);
        searchParams.delete(ENUM_PARAMS.SEARCH);
      } else {
        searchParams.set(ENUM_PARAMS.SEARCH, input);
      }
      setSearchParams(searchParams);
    },
    [searchParams, setSearchParams],
  );
  const [first, setFirst] = useState(false);
  //   const debouseSearch = _.debounce(searchFunction, 20);
  useEffect(() => {
    setFirst(true);
  }, []);
  useEffect(() => {
    if (first) searchFunction(inputValue);
  }, [inputValue]);

  const textField = (
    <Autocomplete.TextField
      onChange={updateText}
      label=""
      value={inputValue}
      prefix={<Icon source={SearchIcon} tone="base" />}
      placeholder="Search"
      autoComplete="off"
    />
  );

  return (
    <div>
      <Autocomplete
        options={options}
        selected={selectedOptions}
        onSelect={updateSelection}
        textField={textField}
      />
    </div>
  );
}
