import { useState } from "react";
import { Tab } from "../components/Tab";

const useTabs = (tabRefs: Array<{ title: string; content: JSX.Element }>) => {
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);

  const tabs = tabRefs.map((tabRef, index) => (
    <Tab
      key={tabRef.title}
      onClick={() => setCurrentTabIndex(index)}
      current={index === currentTabIndex}
    >
      {tabRef.title}
    </Tab>
  ));

  const CurrentTab = () => tabRefs[currentTabIndex].content;

  return { CurrentTab, tabs };
};

export default useTabs;
