import { useState } from "react";
import { Tab } from "../components/Tab";

const useTabs = (tabNames: Array<string>) => {
  const [currentTab, setCurrentTab] = useState<number>(0);

  const tabs = tabNames.map((tabName, index) => (
    <Tab key={tabName} onClick={() => setCurrentTab(index)}>
      {tabName}
    </Tab>
  ));

  return { currentTab, tabs };
};

export default useTabs;
