import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import type { TabsProps } from "antd";
import AppMain from "./app";
import Cart from "./components/carts/cart";
import { useSearchParams } from "react-router";

const items: TabsProps["items"] = [
  {
    key: "1",
    label: "Home",
    children: <AppMain />,
  },
  {
    key: "2",
    label: "Cart",
    children: <Cart />,
  },
];

const App: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  //   const [currentTab, setCurrentTab] = useState("1");
  const onChange = (key: string) => {
    const currentTab = items?.find((item) => item.key == key);
    if (currentTab) {
      searchParams.set("tab", currentTab.key);
      setSearchParams(searchParams);
    }
  };
  const currentTab = searchParams.get("tab") || "1";
  //   useEffect(() => {
  //     setCurrentTab(searchParams.get("tab") || "1");
  //   }, []);
  //   const currentTab = searchParams.get("tab");

  return (
    <>
      <div className=" p-8">
        <Tabs
          defaultActiveKey={currentTab}
          items={items}
          onChange={onChange}
          size="large"
        />
      </div>
    </>
  );
};

export default App;
